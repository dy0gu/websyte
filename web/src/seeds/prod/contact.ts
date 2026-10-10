import type { Payload, RequiredDataFromCollectionSlug } from 'payload';
import { env } from '$/env';
import { defaultLocale, type Locale, locales } from '~/i18n/config';

type ContactFormTranslation = {
  confirmation: string;
  emailLabel: string;
  emailSubject: string;
  messageLabel: string;
  nameLabel: string;
  submitButtonLabel: string;
  title: string;
};

type ContactFormFields = NonNullable<RequiredDataFromCollectionSlug<'forms'>['fields']>;

const contactFormTranslations: Record<Locale, ContactFormTranslation> = {
  en: {
    confirmation: 'Your message has been sent!',
    emailLabel: 'Email',
    emailSubject: 'New website message from {{full-name}}',
    messageLabel: 'Message',
    nameLabel: 'Name',
    submitButtonLabel: 'Send message',
    title: 'Contact',
  },
  pt: {
    confirmation: 'A tua mensagem foi enviada!',
    emailLabel: 'Email',
    emailSubject: 'Nova mensagem do website de {{full-name}}',
    messageLabel: 'Mensagem',
    nameLabel: 'Nome',
    submitButtonLabel: 'Enviar mensagem',
    title: 'Contacto',
  },
};

const paragraph = (text: string) => ({
  children: [
    {
      detail: 0,
      format: 0,
      mode: 'normal',
      style: '',
      text: text,
      type: 'text',
      version: 1,
    },
  ],
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  textFormat: 0,
  type: 'paragraph',
  version: 1,
});

const contactFormFields = (
  locale: Locale,
  existingFields?: ContactFormFields,
): ContactFormFields => {
  const translation = contactFormTranslations[locale];
  const labels: Record<string, string> = {
    email: translation.emailLabel,
    'full-name': translation.nameLabel,
    message: translation.messageLabel,
  };

  return (
    existingFields?.map((field) => {
      if (!('name' in field)) return field;

      return {
        ...field,
        label: labels[field.name] || ('label' in field ? field.label : undefined),
      };
    }) ?? [
      {
        blockName: 'full-name',
        blockType: 'text' as const,
        label: translation.nameLabel,
        name: 'full-name',
        required: true,
        width: 100,
      },
      {
        blockName: 'email',
        blockType: 'email' as const,
        label: translation.emailLabel,
        name: 'email',
        required: true,
        width: 100,
      },
      {
        blockName: 'message',
        blockType: 'textarea' as const,
        label: translation.messageLabel,
        name: 'message',
        required: true,
        width: 100,
      },
    ]
  );
};

const contactFormData = (
  contactEmail: string | undefined,
  locale: Locale,
  existingFields?: ContactFormFields,
): RequiredDataFromCollectionSlug<'forms'> => {
  const translation = contactFormTranslations[locale];

  return {
    confirmationMessage: {
      root: {
        children: [paragraph(translation.confirmation)],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      },
    },
    confirmationType: 'message',
    emails: contactEmail
      ? [
          {
            emailFrom: `"Websyte" <${contactEmail}>`,
            emailTo: contactEmail,
            message: {
              root: {
                children: [paragraph('{{message}}')],
                direction: 'ltr',
                format: '',
                indent: 0,
                type: 'root',
                version: 1,
              },
            },
            replyTo: '{{email}}',
            subject: translation.emailSubject,
          },
        ]
      : [],
    fields: contactFormFields(locale, existingFields),
    formKey: 'contact',
    redirect: undefined,
    submitButtonLabel: translation.submitButtonLabel,
    title: translation.title,
  };
};

export const seedContactForm = async (payload: Payload): Promise<void> => {
  payload.logger.info('Ensuring the contact form exists...');

  const existingForms = await payload.find({
    collection: 'forms',
    depth: 0,
    limit: 1,
    pagination: false,
    where: {
      formKey: {
        equals: 'contact',
      },
    },
  });

  const existingForm = existingForms.docs[0];
  const form =
    existingForm ??
    (await payload.create({
      collection: 'forms',
      data: contactFormData(env.CONTACT_EMAIL, defaultLocale),
      depth: 0,
      locale: defaultLocale,
    }));

  for (const locale of locales) {
    await payload.update({
      collection: 'forms',
      data: contactFormData(
        env.CONTACT_EMAIL,
        locale,
        (form.fields as ContactFormFields | null | undefined) ?? undefined,
      ),
      id: form.id,
      locale: locale,
    });
  }

  payload.logger.info(
    existingForm
      ? 'Contact form updated in all configured locales.'
      : 'Contact form created in all configured locales.',
  );
};

import type { Payload, RequiredDataFromCollectionSlug } from 'payload';
import { env } from '$/env';

const contactFormTitle = 'Contact';

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

const contactFormData = (contactEmail?: string): RequiredDataFromCollectionSlug<'forms'> => ({
  confirmationMessage: {
    root: {
      children: [paragraph('Your message has been sent!')],
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
          emailFrom: `"Website contact" <${contactEmail}>`,
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
          subject: 'New website message from {{full-name}}',
        },
      ]
    : [],
  fields: [
    {
      blockName: 'full-name',
      blockType: 'text',
      label: 'Full name',
      name: 'full-name',
      required: true,
      width: 100,
    },
    {
      blockName: 'email',
      blockType: 'email',
      label: 'Email',
      name: 'email',
      required: true,
      width: 100,
    },
    {
      blockName: 'message',
      blockType: 'textarea',
      label: 'Message',
      name: 'message',
      required: true,
      width: 100,
    },
  ],
  formKey: 'contact',
  redirect: undefined,
  submitButtonLabel: 'Send message',
  title: contactFormTitle,
});

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

  const data = contactFormData(env.CONTACT_EMAIL);
  const existingForm = existingForms.docs[0];

  if (existingForm) {
    payload.logger.info('Contact form already exists.');
  } else {
    const created = await payload.create({
      collection: 'forms',
      data: data,
      depth: 0,
    });
    await payload.update({
      collection: 'forms',
      data: {
        confirmationMessage: {
          root: {
            children: [paragraph('A tua mensagem foi enviada!')],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'root',
            version: 1,
          },
        },
        fields: created.fields?.map((field) => {
          if (!('name' in field)) return field;
          const labels: Record<string, string> = {
            email: 'Email',
            'full-name': 'Nome completo',
            message: 'Mensagem',
          };
          return {
            ...field,
            label: labels[field.name] || ('label' in field ? field.label : undefined),
          };
        }),
        submitButtonLabel: 'Enviar mensagem',
        title: 'Contacto',
      },
      id: created.id,
      locale: 'pt',
    });
    payload.logger.info('Contact form created.');
  }
};

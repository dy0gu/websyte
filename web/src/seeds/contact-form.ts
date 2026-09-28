import type { Payload, RequiredDataFromCollectionSlug } from 'payload'

export const contactFormTitle = 'Contact'

const paragraph = (text: string) => ({
  type: 'paragraph',
  children: [
    {
      type: 'text',
      detail: 0,
      format: 0,
      mode: 'normal',
      style: '',
      text,
      version: 1,
    },
  ],
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  textFormat: 0,
  version: 1,
})

export const contactFormData = (
  contactEmail?: string,
): RequiredDataFromCollectionSlug<'forms'> => ({
  title: contactFormTitle,
  formKey: 'contact',
  fields: [
    {
      name: 'full-name',
      blockName: 'full-name',
      blockType: 'text',
      label: 'Full name',
      required: true,
      width: 100,
    },
    {
      name: 'email',
      blockName: 'email',
      blockType: 'email',
      label: 'Email',
      required: true,
      width: 100,
    },
    {
      name: 'message',
      blockName: 'message',
      blockType: 'textarea',
      label: 'Message',
      required: true,
      width: 100,
    },
  ],
  submitButtonLabel: 'Send message',
  confirmationType: 'message',
  confirmationMessage: {
    root: {
      type: 'root',
      children: [paragraph('Your message has been sent!')],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  },
  redirect: undefined,
  emails: contactEmail
    ? [
        {
          emailFrom: `"Website contact" <${contactEmail}>`,
          emailTo: contactEmail,
          replyTo: '{{email}}',
          subject: 'New website message from {{full-name}}',
          message: {
            root: {
              type: 'root',
              children: [paragraph('{{message}}')],
              direction: 'ltr',
              format: '',
              indent: 0,
              version: 1,
            },
          },
        },
      ]
    : [],
})

export const seedContactForm = async (payload: Payload): Promise<void> => {
  payload.logger.info('Ensuring the contact form exists...')

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
  })

  const data = contactFormData(process.env.CONTACT_EMAIL)
  const existingForm = existingForms.docs[0]

  if (existingForm) {
    payload.logger.info('Contact form already exists.')
  } else {
    const created = await payload.create({
      collection: 'forms',
      data,
      depth: 0,
    })
    await payload.update({
      collection: 'forms',
      id: created.id,
      locale: 'pt',
      data: {
        title: 'Contacto',
        fields: created.fields?.map((field) => {
          if (!('name' in field)) return field
          const labels: Record<string, string> = {
            'full-name': 'Nome completo',
            email: 'Email',
            message: 'Mensagem',
          }
          return {
            ...field,
            label: labels[field.name] || ('label' in field ? field.label : undefined),
          }
        }),
        submitButtonLabel: 'Enviar mensagem',
        confirmationMessage: {
          root: {
            type: 'root',
            children: [paragraph('A tua mensagem foi enviada!')],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
      },
    })
    payload.logger.info('Contact form created.')
  }
}

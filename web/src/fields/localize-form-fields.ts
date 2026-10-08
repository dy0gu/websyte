import type { Field } from 'payload';

export function localizeFormFields(fields: Field[]): Field[] {
  return fields.map((field): Field => {
    if (
      'name' in field &&
      ['title', 'label', 'submitButtonLabel', 'confirmationMessage', 'message'].includes(
        field.name,
      ) &&
      ['text', 'textarea', 'richText'].includes(field.type)
    ) {
      return { ...field, localized: true } as Field;
    }
    if ('fields' in field && (!('name' in field) || field.name !== 'emails'))
      return { ...field, fields: localizeFormFields(field.fields) } as Field;
    if (field.type === 'blocks')
      return {
        ...field,
        blocks: field.blocks.map((block) => ({
          ...block,
          fields: localizeFormFields(block.fields),
        })),
      };
    return field;
  });
}

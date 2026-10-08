import { FormCheckbox } from '~/blocks/form/checkbox';
import { Country } from '~/blocks/form/country';
import { Email } from '~/blocks/form/email';
import { Message } from '~/blocks/form/message';
import { NumberField } from '~/blocks/form/number';
import { FormSelect } from '~/blocks/form/select';
import { State } from '~/blocks/form/state';
import { Text } from '~/blocks/form/text';
import { FormTextarea } from '~/blocks/form/textarea';

export const fields = {
  checkbox: FormCheckbox,
  country: Country,
  email: Email,
  message: Message,
  number: NumberField,
  select: FormSelect,
  state: State,
  text: Text,
  textarea: FormTextarea,
};

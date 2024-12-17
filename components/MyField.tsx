import { Input } from "@nextui-org/react";
import { Field, FieldAttributes, FieldProps } from "formik";

export interface MyFieldProps extends FieldAttributes<any> {
  parse?: (value: string) => any;
  format?: (value: any) => string;
}

/**
 * MyField component is a custom form field component that integrates with Formik.
 * It allows for optional parsing and formatting of the field value.
 *
 * @param {Object} props - The props object.
 * @param {Function} [props.parse] - Optional function to parse the input value before setting it in the form state.
 * @param {Function} [props.format] - Optional function to format the field value before displaying it in the input.
 * @param {Object} props.rest - Other props passed down to the Field component.
 *
 * @returns {JSX.Element} The rendered Field component with custom input handling.
 */
export const MyField: React.FC<MyFieldProps> = ({
  parse,
  format,
  ...props
}) => {
  return (
    <Field {...props}>
      {({ field, form, ..._metaProps }: FieldProps) => (
        <Input
          {...props}
          value={format ? format(field.value) : field.value}
          onChange={(e) => {
            form.setFieldValue(
              field.name,
              parse ? parse(e.target.value) : e.target.value,
            );
          }}
        />
      )}
    </Field>
  );
};

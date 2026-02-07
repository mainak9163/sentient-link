import { FC } from 'react'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { FormFieldProps } from './form-field.types'

export const FormField: FC<FormFieldProps> = ({ 
  label, 
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  className
}) => {
  return (
    <Field className={className}>
      <FieldLabel>{label}</FieldLabel>
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
      />
    </Field>
  )
}
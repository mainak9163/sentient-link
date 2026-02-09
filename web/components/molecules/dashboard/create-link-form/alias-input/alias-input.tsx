import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field"
import type { AliasInputProps } from "./alias-input.types"

export function AliasInput({
  value,
  onChange,
  disabled,
  className,
  ...props
}: AliasInputProps) {
  return (
    <Field className={className} {...props}>
      <FieldLabel>Custom short code</FieldLabel>
      <Input
        placeholder="my-custom-link"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        pattern="[a-z0-9-]+"
        disabled={disabled}
        required
      />
      <FieldDescription>
        Lowercase letters, numbers, and hyphens only.
      </FieldDescription>
    </Field>
  )
}

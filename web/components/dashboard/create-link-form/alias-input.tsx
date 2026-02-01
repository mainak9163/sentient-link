import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field"

interface AliasInputProps {
  value: string
  onChange: (value: string) => void
}

export function AliasInput({ value, onChange }: AliasInputProps) {
  return (
    <Field>
      <FieldLabel>Custom short code</FieldLabel>
      <Input
        placeholder="my-custom-link"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        pattern="[a-z0-9-]+"
        required
      />
      <FieldDescription>
        Lowercase letters, numbers, and hyphens only.
      </FieldDescription>
    </Field>
  )
}
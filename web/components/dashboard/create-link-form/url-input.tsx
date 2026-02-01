import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"

interface UrlInputProps {
  value: string
  onChange: (value: string) => void
}

export function UrlInput({ value, onChange }: UrlInputProps) {
  return (
    <Field>
      <FieldLabel>Original URL</FieldLabel>
      <Input
        type="url"
        placeholder="https://example.com"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </Field>
  )
}
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"
import type { UrlInputProps } from "./url-input.types"

export function UrlInput({
  value,
  onChange,
  disabled,
  className,
  ...props
}: UrlInputProps) {
  return (
    <Field className={className} {...props}>
      <FieldLabel>Original URL</FieldLabel>
      <Input
        type="url"
        placeholder="https://example.com"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required
      />
    </Field>
  )
}

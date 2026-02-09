import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field"
import type { IntentInputProps } from "./intent-input.types"

export function IntentInput({
  value,
  onChange,
  disabled,
  className,
  ...props
}: IntentInputProps) {
  return (
    <Field className={className} {...props}>
      <FieldLabel>
        Purpose / Intent{" "}
        <span className="text-muted-foreground">(optional)</span>
      </FieldLabel>
      <Input
        placeholder="share resume with recruiters"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
      <FieldDescription>
        Helps AI generate a better, more meaningful alias.
      </FieldDescription>
    </Field>
  )
}

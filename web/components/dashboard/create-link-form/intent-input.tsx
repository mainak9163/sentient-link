import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field"

interface IntentInputProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function IntentInput({ value, onChange, disabled }: IntentInputProps) {
  return (
    <Field>
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
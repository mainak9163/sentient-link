import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field"

interface IntentInputProps {
  value: string
  onChange: (value: string) => void
}

export function IntentInput({ value, onChange }: IntentInputProps) {
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
      />
      <FieldDescription>Helps AI generate a better alias.</FieldDescription>
    </Field>
  )
}
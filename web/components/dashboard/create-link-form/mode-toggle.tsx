import { Switch } from "@/components/ui/switch"
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field"

interface ModeToggleProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

export function ModeToggle({ checked, onCheckedChange }: ModeToggleProps) {
  return (
    <Field>
      <div className="flex items-center justify-between">
        <FieldLabel>Use custom alias</FieldLabel>
        <Switch checked={checked} onCheckedChange={onCheckedChange} />
      </div>
      <FieldDescription>
        {checked
          ? "Custom aliases skip AI analysis"
          : "AI can suggest a more meaningful alias"}
      </FieldDescription>
    </Field>
  )
}
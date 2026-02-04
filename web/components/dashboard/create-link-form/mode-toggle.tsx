import { Switch } from "@/components/ui/switch"
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field"

interface ModeToggleProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
}

export function ModeToggle({ checked, onCheckedChange, disabled }: ModeToggleProps) {
  return (
    <Field>
      <div className="flex items-center justify-between">
        <FieldLabel>Use custom alias</FieldLabel>
        <Switch 
          checked={checked} 
          onCheckedChange={onCheckedChange}
          disabled={disabled}
        />
      </div>
      <FieldDescription>
        {checked
          ? "Choose your own short code (instant)"
          : "AI generates a meaningful alias (3-10 seconds)"}
      </FieldDescription>
    </Field>
  )
}
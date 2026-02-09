import { Switch } from "@/components/ui/switch"
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field"
import type { ModeToggleProps } from "./mode-toggle.types"

export function ModeToggle({
  checked,
  onCheckedChange,
  disabled,
  className,
  ...props
}: ModeToggleProps) {
  return (
    <Field className={className} {...props}>
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

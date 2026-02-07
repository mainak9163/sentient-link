import { FC } from 'react'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PasswordRequirementsProps, PasswordRule } from './password-requirements.types'

const rules: PasswordRule[] = [
  {
    label: 'At least 8 characters',
    test: (v) => v.length >= 8,
  },
  {
    label: 'One uppercase letter',
    test: (v) => /[A-Z]/.test(v),
  },
  {
    label: 'One lowercase letter',
    test: (v) => /[a-z]/.test(v),
  },
  {
    label: 'One number',
    test: (v) => /[0-9]/.test(v),
  },
  {
    label: 'One special character',
    test: (v) => /[^a-zA-Z0-9]/.test(v),
  },
]

export const PasswordRequirements: FC<PasswordRequirementsProps> = ({ password, className }) => {
  return (
    <ul className={cn('space-y-1 text-sm pt-2', className)}>
      {rules.map((rule) => {
        const valid = rule.test(password)

        return (
          <li
            key={rule.label}
            className={cn(
              'flex items-center gap-2',
              valid ? 'text-green-600' : 'text-muted-foreground'
            )}
          >
            {valid ? (
              <Check className="h-4 w-4" />
            ) : (
              <X className="h-4 w-4" />
            )}
            {rule.label}
          </li>
        )
      })}
    </ul>
  )
}
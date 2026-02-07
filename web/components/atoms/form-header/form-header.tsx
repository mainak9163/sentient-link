import { FC } from 'react'
import { FormHeaderProps } from './form-header.types'

export const FormHeader: FC<FormHeaderProps> = ({ title, description, className }) => {
  return (
    <div className={`flex flex-col items-center gap-1 text-center ${className || ''}`}>
      <h1 className="text-2xl font-bold">{title}</h1>
      {description && (
        <p className="text-muted-foreground text-sm">{description}</p>
      )}
    </div>
  )
}
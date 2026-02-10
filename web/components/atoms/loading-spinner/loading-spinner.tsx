import { FC } from 'react'
import { Loader2 } from 'lucide-react'
import { LoadingSpinnerProps } from './loading-spinner.types'
import { BoxLayout } from '@/components/atoms/box-layout/box-layout'

export const LoadingSpinner: FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  title, 
  description,
  className 
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  return (
    <BoxLayout className={`flex flex-col items-center gap-4 text-center ${className || ''}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-muted-foreground`} />
      {title && <h1 className="text-xl font-semibold">{title}</h1>}
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </BoxLayout>
  )
}

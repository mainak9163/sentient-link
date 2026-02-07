import { FC } from 'react'
import Image from 'next/image'
import { ThemeToggle } from '@/components/theme-toggle'
import { AuthLayoutProps } from './auth-layout.types'

export const AuthLayout: FC<AuthLayoutProps> = ({ 
  children, 
  showImage = false,
  imageSrc = '/placeholder.svg',
  imageAlt = 'Authentication Image',
  showThemeToggle = true,
  className 
}) => {
  return (
    <div className={`grid min-h-svh ${showImage ? 'lg:grid-cols-2' : ''} ${className || ''}`}>
      <div className="flex flex-col gap-4 p-6">
        {showThemeToggle && (
          <div className="fixed right-4 top-4">
            <ThemeToggle />
          </div>
        )}
        
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            {children}
          </div>
        </div>
      </div>
      
      {showImage && (
        <div className="bg-muted relative hidden lg:block">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      )}
    </div>
  )
}
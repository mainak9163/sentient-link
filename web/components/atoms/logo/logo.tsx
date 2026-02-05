import { FC } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Link2 } from 'lucide-react'
import { LogoProps } from './logo.types'

export const Logo: FC<LogoProps> = ({ 
  size = 'md', 
  showText = true, 
  href = '/',
  className 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  }

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  }

  return (
    <Link href={href} className={`flex items-center gap-2 group ${className || ''}`}>
      <motion.div
        className={`${sizeClasses[size]} rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link2 className={`${iconSizes[size]} text-white`} />
      </motion.div>
      {showText && (
        <span className={`${textSizes[size]} font-bold gradient-text`}>
          SentientLink
        </span>
      )}
    </Link>
  )
}
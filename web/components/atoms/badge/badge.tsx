import { FC } from 'react'
import { motion } from 'framer-motion'
import { BadgeProps } from './badge.types'

export const Badge: FC<BadgeProps> = ({ icon, text, className }) => {
  return (
    <motion.div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 ${className || ''}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
    >
      {icon}
      <span className="text-sm font-medium text-violet-700 dark:text-violet-300">
        {text}
      </span>
    </motion.div>
  )
}
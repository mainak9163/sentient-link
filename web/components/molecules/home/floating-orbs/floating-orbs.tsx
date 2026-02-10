import { FC } from 'react'
import { motion } from 'framer-motion'
import { FloatingOrbsProps } from './floating-orbs.types'
import { BoxLayout } from '@/components/atoms/box-layout/box-layout'

export const FloatingOrbs: FC<FloatingOrbsProps> = () => {
  return (
    <BoxLayout className="fixed inset-0 pointer-events-none overflow-hidden">
      <motion.div
        className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-linear-to-br from-violet-400/30 to-purple-600/30 blur-3xl"
        animate={{
          x: [0, 30, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      <motion.div
        className="absolute top-1/4 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-cyan-400/20 to-teal-600/20 blur-3xl"
        animate={{
          x: [0, -40, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      <motion.div
        className="absolute -bottom-40 left-1/3 w-80 h-80 rounded-full bg-gradient-to-br from-orange-400/20 to-red-500/20 blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
    </BoxLayout>
  )
}

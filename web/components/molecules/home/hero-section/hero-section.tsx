import { FC } from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { Badge } from '@/components/atoms/badge/badge'
import { HeroSectionProps } from './hero-section.types'

export const HeroSection: FC<HeroSectionProps> = ({ className }) => {
  return (
    <section className={`relative px-6 ${className || ''}`}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6">
            <Badge 
              icon={<Sparkles className="h-4 w-4 text-violet-500" />}
              text="AI-Powered URL Shortening"
            />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            <span className="gradient-text">Shorten Links,</span>
            <br />
            <span className="text-foreground">Amplify Reach</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Transform long URLs into memorable, brandable short links powered by AI.
            Perfect for social media, marketing, and sharing.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
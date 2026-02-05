import { FC } from 'react'
import { Link2 } from 'lucide-react'
import { FooterProps } from './footer.types'

export const Footer: FC<FooterProps> = ({ className }) => {
  return (
    <footer className={`py-4 px-6 border-t border-border/50 fixed bottom-0 w-full ${className || ''}`}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <Link2 className="h-5 w-5 text-primary" />
          <span className="font-semibold gradient-text">SentientLink</span>
        </div>
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} SentientLink. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
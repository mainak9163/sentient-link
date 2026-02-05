import { FC } from 'react'
import { BackgroundEffectsProps } from './background-effect.types'

export const BackgroundEffects: FC<BackgroundEffectsProps> = () => {
  return (
    <div className="fixed inset-0 pointer-events-none">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-77.5 w-77.5 rounded-full bg-primary/20 opacity-20 blur-[100px]" />
      <div className="absolute right-0 bottom-0 -z-10 h-62.5 w-62.5 rounded-full bg-secondary/20 opacity-20 blur-[100px]" />
    </div>
  )
}
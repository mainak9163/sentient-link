"use client"

import { Footer } from "@/components/molecules/footer/footer"
import { BackgroundEffects } from "@/components/molecules/home/background-effects/background-effects"
import { FloatingOrbs } from "@/components/molecules/home/floating-orbs/floating-orbs"
import { HeroSection } from "@/components/molecules/home/hero-section/hero-section"
import { Navbar } from "@/components/molecules/navbar/navbar"
import { BoxLayout } from "@/components/atoms/box-layout/box-layout"


export default function HomePage(){
  return (
    <BoxLayout className="min-h-screen relative overflow-hidden flex flex-col justify-center items-center">
      <BackgroundEffects />
      <FloatingOrbs />
      <Navbar />
      <HeroSection />
      <Footer />
    </BoxLayout>
  )
}

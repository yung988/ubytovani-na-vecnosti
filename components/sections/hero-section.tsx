'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

export function HeroSection() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <motion.div
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 20 }}
        className="relative h-full w-full"
      >
        <Image
          src="/images/na-vecnosti-main.jpg"
          alt="Na věčnosti - hlavní pohled"
          fill
          priority
          className="object-cover brightness-75"
        />
      </motion.div>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <motion.h1 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 1,
            type: "spring",
            stiffness: 100 
          }}
          className="text-6xl md:text-7xl font-light mb-4 text-center"
        >
          Na Věčnosti
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-xl md:text-2xl text-center"
        >
          Váš klid v srdci přírody
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-8"
        >
          <motion.a
            href="#booking"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white border border-white/30 hover:bg-white/30 transition-colors"
          >
            Rezervovat pobyt
          </motion.a>
        </motion.div>
      </div>
    </div>
  )
}
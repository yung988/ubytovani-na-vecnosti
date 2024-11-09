import { useState } from "react"
import { Tab } from '@headlessui/react'
import Image from "next/image"
import { motion } from "framer-motion"

interface GallerySectionProps {
  onImageSelect: (src: string) => void
}

const categories = ['Vše', 'Ložnice', 'Koupelna', 'Kuchyň', 'Exteriér']

const galleryImages = [
  // Ložnice
  { 
    src: "/images/loznice-cela-s.jpg", 
    alt: "Hlavní ložnice",
    category: "Ložnice"
  },
  { 
    src: "/images/loznice-postel-v.jpg", 
    alt: "Postel v hlavní ložnici",
    category: "Ložnice"
  },
  { 
    src: "/images/druha-loznice-postel-v.jpg", 
    alt: "Druhá ložnice",
    category: "Ložnice"
  },
  { 
    src: "/images/druha-loznice-kresilka.jpg", 
    alt: "Posezení v ložnici",
    category: "Ložnice"
  },
  
  // Koupelna
  { 
    src: "/images/koupelna.jpg", 
    alt: "Koupelna",
    category: "Koupelna"
  },
  { 
    src: "/images/sprcha.jpg", 
    alt: "Sprchový kout",
    category: "Koupelna"
  },
  { 
    src: "/images/koupelna-ommyvadlo-v.jpg", 
    alt: "Umyvadlo",
    category: "Koupelna"
  },

  // Kuchyň
  { 
    src: "/images/kuchyn-s.jpg", 
    alt: "Kuchyňský prostor",
    category: "Kuchyň"
  },
  { 
    src: "/images/kuchyn-linka.jpg", 
    alt: "Kuchyňská linka",
    category: "Kuchyň"
  },
  { 
    src: "/images/kychun-kreslo.jpg", 
    alt: "Posezení v kuchyni",
    category: "Kuchyň"
  },

  // Exteriér
  { 
    src: "/images/balkon-main.jpg", 
    alt: "Hlavní pohled na balkon",
    category: "Exteriér"
  },
  { 
    src: "/images/bis-s-balkon.jpg", 
    alt: "Pohled z balkonu",
    category: "Exteriér"
  },
  { 
    src: "/images/zahrada-balkon.jpg", 
    alt: "Zahrada s balkonem",
    category: "Exteriér"
  },
  { 
    src: "/images/dvorek.jpg", 
    alt: "Dvorek",
    category: "Exteriér"
  },
  { 
    src: "/images/posezeni-dole.jpg", 
    alt: "Venkovní posezení",
    category: "Exteriér"
  }
]

export function GallerySection({ onImageSelect }: GallerySectionProps) {
  const [selectedCategory, setSelectedCategory] = useState('Vše')

  const filteredImages = galleryImages.filter(img => 
    selectedCategory === 'Vše' || img.category === selectedCategory
  )

  const getCategoryCount = (category: string) => {
    return category === 'Vše' 
      ? galleryImages.length 
      : galleryImages.filter(img => img.category === category).length
  }

  return (
    <div id="gallery" className="mb-24 container mx-auto px-4">
      <h2 className="text-4xl font-light text-center mb-12">Galerie</h2>
      
      <div className="flex flex-col space-y-8">
        <Tab.Group>
          <Tab.List className="flex flex-wrap justify-center gap-2 p-2 rounded-xl bg-stone-50">
            {categories.map((category) => (
              <Tab
                key={category}
                className={({ selected }) =>
                  `rounded-lg py-2.5 px-6 text-sm font-medium leading-5 transition-all duration-200
                  ${selected 
                    ? 'bg-stone-900 text-white shadow-lg transform -translate-y-0.5'
                    : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'}`
                }
                onClick={() => setSelectedCategory(category)}
              >
                <span>{category}</span>
                <span className="ml-2 text-xs opacity-75">({getCategoryCount(category)})</span>
              </Tab>
            ))}
          </Tab.List>
        </Tab.Group>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          layout
        >
          {filteredImages.map((image) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={image.src}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer group"
              onClick={() => onImageSelect(image.src)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-lg font-medium">{image.alt}</p>
                  <p className="text-sm opacity-75">{image.category}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
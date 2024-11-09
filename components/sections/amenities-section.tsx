import { motion } from "framer-motion"
import { Wifi, Sun, Car, Coffee, Bath, Bed } from "lucide-react"

const amenities = [
  { icon: Wifi, label: "Wi-Fi", description: "Vysokorychlostní internet" },
  { icon: Sun, label: "Terasa", description: "Prostorná terasa s výhledem" },
  { icon: Car, label: "Parkování", description: "Soukromé parkovací místo" },
  { icon: Coffee, label: "Kávovar", description: "Plně vybavená kuchyně" },
  { icon: Bath, label: "Koupelna", description: "Moderní koupelna s vanou" },
  { icon: Bed, label: "2 ložnice", description: "Komfortní spaní až pro 4 osoby" }
]

export function AmenitiesSection() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-24">
      {amenities.map((amenity, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="flex flex-col items-center text-center p-6 bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all"
        >
          <amenity.icon className="h-8 w-8 mb-4 text-stone-600" />
          <span className="text-stone-600 font-medium mb-2">{amenity.label}</span>
          <span className="text-sm text-stone-500">{amenity.description}</span>
        </motion.div>
      ))}
    </div>
  )
} 
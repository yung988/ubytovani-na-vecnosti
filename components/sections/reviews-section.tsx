import { motion } from "framer-motion"
import { Star } from "lucide-react"

const reviews = [
  {
    name: "Jana Nováková",
    rating: 5,
    text: "Naprosto úžasné místo pro odpočinek. Překrásný výhled a perfektní služby.",
    date: "Březen 2024"
  },
  {
    name: "Petr Svoboda",
    rating: 5,
    text: "Luxusní ubytování v krásné lokalitě. Vše bylo perfektně připravené a čisté.",
    date: "Únor 2024"
  },
  {
    name: "Marie Dvořáková",
    rating: 5,
    text: "Nádherné místo pro relaxaci. Určitě se vrátíme!",
    date: "Leden 2024"
  }
]

export function ReviewsSection() {
  return (
    <div className="mb-24">
      <h2 className="text-3xl font-light text-center mb-12">Co říkají naši hosté</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reviews.map((review, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-4">
              {[...Array(review.rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-stone-600 mb-4">{review.text}</p>
            <div className="flex justify-between items-center text-sm text-stone-500">
              <span>{review.name}</span>
              <span>{review.date}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
} 
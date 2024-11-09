'use client'

import { useState } from "react"
import { HeroSection } from "./sections/hero-section"
import { AmenitiesSection } from "./sections/amenities-section"
import { FloatingMenu } from "./floating-menu"
import { GallerySection } from "./sections/gallery-section"
import { ReviewsSection } from "./sections/reviews-section"
import { BookingSection } from "./sections/booking-section"
import { ContactDialog } from "./dialogs/contact-dialog"
import { ImageDialog } from "./dialogs/image-dialog"
import { motion } from "framer-motion"

export default function VacationRentalListingComponent() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [showContactInfo, setShowContactInfo] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="relative min-h-screen bg-stone-100">
      <FloatingMenu 
        isOpen={isMenuOpen}
        setIsOpen={setIsMenuOpen}
        showContactInfo={showContactInfo}
        setShowContactInfo={setShowContactInfo}
      />

      <HeroSection />

      <div id="content" className="relative bg-stone-100">
        <div className="max-w-7xl mx-auto px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center mb-24"
          >
            <p className="text-xl text-stone-600 leading-relaxed">
              Objevte luxusní ubytování v klidné lokalitě Biskupic. 
              Moderní apartmán nabízí veškerý komfort pro váš dokonalý odpočinek 
              v objetí přírody.
            </p>
          </motion.div>

          <AmenitiesSection />
          
          <GallerySection 
            onImageSelect={setSelectedImage}
          />

          <ReviewsSection />

          <BookingSection 
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            onBookingRequest={() => setShowContactInfo(true)}
          />
        </div>
      </div>

      <ContactDialog 
        open={showContactInfo} 
        onOpenChange={setShowContactInfo}
      />

      <ImageDialog
        selectedImage={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  )
}
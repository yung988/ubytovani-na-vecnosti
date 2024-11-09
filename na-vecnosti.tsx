'use client'

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Calendar, User, Home, Bed, Leaf, Check, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

const amenities = ["Wi-Fi zdarma", "Balkon", "Parkování zdarma", "Plně vybavená kuchyň", "Nekuřácké pokoje", "Sprcha"]

export default function VacationRentalListing() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 text-center mb-8">
          Na Věčnosti
        </h1>

        <motion.div
          className="bg-white rounded-3xl p-6 shadow-md border border-gray-100"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="relative w-full h-[300px] mb-4">
            <Image
              src="/placeholder.svg?height=300&width=600"
              alt="Hlavní fotografie apartmánu"
              fill
              className="object-cover rounded-2xl"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                O ubytování
              </h2>
              <p className="text-gray-600 mb-4">
                Apartmán v vynikající lokalitě s vybavenou kuchyní a klidným prostředím, 
                vhodný pro hosty hledající relaxaci v blízkosti přírodních parků.
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <Home className="h-5 w-5 text-teal-600 mr-2" />
                  <span className="text-gray-600">59 m²</span>
                </div>
                <div className="flex items-center">
                  <Bed className="h-5 w-5 text-teal-600 mr-2" />
                  <span className="text-gray-600">2 ložnice (4 lůžka)</span>
                </div>
                <div className="flex items-center">
                  <Leaf className="h-5 w-5 text-teal-600 mr-2" />
                  <span className="text-gray-600">Výhled do zahrady</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Vybavení
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-teal-600 mr-2" />
                    <span className="text-gray-600">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            className="bg-white rounded-3xl p-6 shadow-md border border-gray-100"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Rezervace
            </h2>
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border mb-4"
            />
            <div className="space-y-2 mb-4">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-teal-600 mr-2" />
                <span className="text-gray-600">Check-in: 16:00 - 20:00</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-teal-600 mr-2" />
                <span className="text-gray-600">Check-out: 7:00 - 10:00</span>
              </div>
            </div>
            <Button
              onClick={() => setIsContactModalOpen(true)}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white"
            >
              <Calendar className="mr-2 h-4 w-4" /> Kontaktovat pro rezervaci
            </Button>
          </motion.div>

          <motion.div
            className="bg-white rounded-3xl p-6 shadow-md border border-gray-100"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              O hostitelce
            </h2>
            <div className="space-y-4">
              <div className="flex items-center mb-2">
                <User className="h-5 w-5 text-teal-600 mr-2" />
                <span className="text-gray-800 font-semibold">Petra</span>
              </div>
              <p className="text-gray-600 text-sm">
                Baví mě poznávat nové tváře, seznamovat se s lidmi. Miluji přírodu, 
                procházky po okolí se svojí psicí. Vyrábím přírodní mýdla a svíčky 
                a nabízím možnost workshopů.
              </p>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-3xl p-6 shadow-md border border-gray-100"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Kontakt a lokalita
            </h2>
            <div className="space-y-2">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-teal-600 mr-2" />
                <p className="text-gray-600">Biskupice 72, 67557</p>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-teal-600 mr-2" />
                <p className="text-gray-600">+420 123 456 789</p>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-teal-600 mr-2" />
                <p className="text-gray-600">info@ubytovaninanvecnosti.cz</p>
              </div>
            </div>
          </motion.div>
        </div>

        <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
          <DialogContent className="bg-white rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-gray-800">
                Kontaktujte nás pro rezervaci
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-gray-600">
                Pro rezervaci nebo dotazy nás můžete kontaktovat následujícími
                způsoby:
              </p>
              <div className="flex items-center">
                <Phone className="h-6 w-6 text-teal-600 mr-2" />
                <p className="text-gray-600">+420 123 456 789</p>
              </div>
              <div className="flex items-center">
                <Mail className="h-6 w-6 text-teal-600 mr-2" />
                <p className="text-gray-600">info@ubytovaninanvecnosti.cz</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
import { motion, AnimatePresence } from "framer-motion"
import { Mail, ImageIcon, Calendar, X, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FloatingMenuProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  setShowContactInfo: (show: boolean) => void
}

const menuItems = [
  { 
    icon: ImageIcon, 
    label: 'Galerie',
    onClick: (setOpen: (open: boolean) => void) => {
      document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })
      setOpen(false)
    }
  },
  { 
    icon: Calendar, 
    label: 'Rezervace',
    onClick: (setOpen: (open: boolean) => void) => {
      document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })
      setOpen(false)
    }
  },
  { 
    icon: Mail, 
    label: 'Kontakt',
    onClick: (setOpen: (open: boolean) => void, setShowContact: (show: boolean) => void) => {
      setShowContact(true)
      setOpen(false)
    }
  }
]

export function FloatingMenu({ isOpen, setIsOpen, setShowContactInfo }: FloatingMenuProps) {
  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4">
      {/* Menu tlačítka */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="flex flex-col gap-2"
          >
            {menuItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  variant="outline"
                  className="bg-white shadow-md hover:shadow-lg transition-all rounded-full px-6 py-3 flex items-center gap-2"
                  onClick={() => item.onClick(setIsOpen, setShowContactInfo)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upravené hlavní menu tlačítko */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          size="lg"
          className={`rounded-full shadow-lg flex items-center gap-2 px-6 ${
            isOpen ? 'bg-stone-800 text-white' : 'bg-white text-stone-800'
          }`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            className="flex items-center gap-2"
          >
            {isOpen ? (
              <>
                <X className="h-5 w-5" />
                <span className="text-sm font-medium">Zavřít</span>
              </>
            ) : (
              <>
                <Menu className="h-5 w-5" />
                <span className="text-sm font-medium">Menu</span>
              </>
            )}
          </motion.div>
        </Button>
      </motion.div>
    </div>
  )
} 
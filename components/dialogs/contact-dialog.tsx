import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Mail, Phone, MapPin } from "lucide-react"

interface ContactDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ContactDialog({ open, onOpenChange }: ContactDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white rounded-2xl shadow-lg p-6 max-w-md mx-auto">
        <div className="mb-4">
          <h3 className="text-lg font-medium">Kontakt</h3>
        </div>
        <div className="space-y-4">
          <a href="tel:+420123456789" className="flex items-center gap-3 p-2 hover:bg-stone-50 rounded-lg transition-colors">
            <Phone className="h-5 w-5 text-stone-600" />
            <span>+420 123 456 789</span>
          </a>
          <a href="mailto:info@navecnosti.cz" className="flex items-center gap-3 p-2 hover:bg-stone-50 rounded-lg transition-colors">
            <Mail className="h-5 w-5 text-stone-600" />
            <span>info@navecnosti.cz</span>
          </a>
          <div className="flex items-center gap-3 p-2">
            <MapPin className="h-5 w-5 text-stone-600" />
            <span>Biskupice 72, 67557</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 
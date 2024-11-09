import { Dialog, DialogContent } from "@/components/ui/dialog"
import Image from "next/image"

interface ImageDialogProps {
  selectedImage: string | null
  onClose: () => void
}

export function ImageDialog({ selectedImage, onClose }: ImageDialogProps) {
  if (!selectedImage) return null

  return (
    <Dialog open={!!selectedImage} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-5xl bg-transparent border-none p-0">
        <div className="relative aspect-[16/9]">
          <Image
            src={selectedImage}
            alt="Zvětšený pohled"
            fill
            className="object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
} 
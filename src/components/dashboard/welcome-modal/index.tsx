'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, Button } from "@/components/ui"
import { Gift } from 'lucide-react'
import Confetti from 'react-confetti'

export function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome')
    if (!hasSeenWelcome) {
      setIsOpen(true)
      localStorage.setItem('hasSeenWelcome', 'true')
    }

    setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Parabéns por acessar o novo CRM da Ivi!
          </DialogTitle>
        </DialogHeader>
        <div className="flex justify-center items-center py-8">
          <Gift size={100} className="text-[#0146cf] animate-bounce" />
        </div>
        <DialogDescription className="text-center text-lg">
          Bem-vindo ao seu novo painel de controle. Estamos felizes em tê-lo aqui!
        </DialogDescription>
        <div className="flex justify-center mt-6">
          <Button onClick={() => setIsOpen(false)}>Começar a explorar</Button>
        </div>
      </DialogContent>
      {isOpen && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
        />
      )}
    </Dialog>
  )
} 
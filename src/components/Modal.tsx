import { motion } from 'framer-motion'

export default function Modal({ open, onClose, children, title } : { open: boolean, onClose: ()=>void, children: React.ReactNode, title?: string }){
  if(!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative bg-surface rounded-lg p-6 w-full max-w-2xl z-10">
        {title && <div className="font-semibold mb-3">{title}</div>}
        {children}
      </motion.div>
    </div>
  )
}

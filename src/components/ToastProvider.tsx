import React, { createContext, useContext, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Toast = { id: string; type?: 'info'|'success'|'error'; title: string; description?: string }
const ToastContext = createContext<any>(null)

export function useToast(){ return useContext(ToastContext) }

export default function ToastProvider({ children }: { children: React.ReactNode }){
  const [toasts, setToasts] = useState<Toast[]>([])
  const push = useCallback((t: Omit<Toast,'id'>)=>{
    const id = String(Date.now())
    setToasts(s=>[...s, { id, ...t }])
    setTimeout(()=> setToasts(s=> s.filter(x=> x.id !== id)), 5000)
  },[])
  const remove = useCallback((id: string)=> setToasts(s=> s.filter(x=> x.id !== id)),[])
  return (
    <ToastContext.Provider value={{ push, remove }}>
      {children}
      <div className="fixed right-4 bottom-4 z-50 flex flex-col gap-3">
        <AnimatePresence>
          {toasts.map(t=> (
            <motion.div key={t.id} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} className={`p-3 rounded shadow-lg ${t.type==='error'? 'bg-red-600' : t.type==='success'? 'bg-green-600' : 'bg-white/6'}`}>
              <div className="font-semibold">{t.title}</div>
              {t.description && <div className="text-sm text-slate-100">{t.description}</div>}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

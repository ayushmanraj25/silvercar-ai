import React from "react"

export function Dialog({ open, onOpenChange, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-h-[90vh] overflow-y-auto w-full max-w-2xl relative">
        {children}
      </div>
    </div>
  )
}

export function DialogContent({ children, className }) {
  return <div className={`p-6 ${className}`}>{children}</div>
}

export function DialogHeader({ children }) {
  return <div className="mb-4 border-b pb-2">{children}</div>
}

export function DialogTitle({ children }) {
  return <h2 className="text-xl font-semibold">{children}</h2>
}

export function DialogFooter({ children }) {
  return <div className="mt-6">{children}</div>
}

export function DialogTrigger({ asChild, children }) {
  return React.cloneElement(children, { onClick: () => {} })
}

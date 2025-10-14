import React from "react"

export function Select({ value, onValueChange, children }) {
  return (
    <select
      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
    >
      {children}
    </select>
  )
}

export function SelectTrigger({ children }) {
  return <>{children}</>
}

export function SelectContent({ children }) {
  return <>{children}</>
}

export function SelectValue({ placeholder }) {
  return <option disabled value="">{placeholder}</option>
}

export function SelectItem({ value, children }) {
  return <option value={value}>{children}</option>
}

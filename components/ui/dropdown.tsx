"use client"

import * as React from "react"
import { cn } from "../../lib/utils"

export interface DropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  trigger: React.ReactNode
  isOpen: boolean
  onClose: () => void
}

const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  ({ className, trigger, isOpen, onClose, children, ...props }, ref) => {
    const dropdownRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          onClose()
        }
      }

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside)
      }
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }, [isOpen, onClose])

    return (
      <div ref={dropdownRef} className="relative inline-block text-left">
        <div>{trigger}</div>
        {isOpen && (
          <div
            ref={ref}
            className={cn(
              "absolute right-0 z-50 mt-2 min-w-[8rem] origin-top-right rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80 slide-in-from-top-2",
              className
            )}
            {...props}
          >
            <div className="p-1" role="menu" aria-orientation="vertical">
              {children}
            </div>
          </div>
        )}
      </div>
    )
  }
)
Dropdown.displayName = "Dropdown"

export type DropdownItemProps = React.ButtonHTMLAttributes<HTMLButtonElement>

const DropdownItem = React.forwardRef<HTMLButtonElement, DropdownItemProps>(
  ({ className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        role="menuitem"
        className={cn(
          "flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        {...props}
      />
    )
  }
)
DropdownItem.displayName = "DropdownItem"

export { Dropdown, DropdownItem }

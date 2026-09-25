"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  User,
  FileText,
  BarChart3,
  Wallet,
  PlusCircle,
  HelpCircle,
} from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"

export function CommandMenu() {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = (command: () => void) => {
    setOpen(false)
    command()
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem onSelect={() => runCommand(() => router.push("/loans?tab=new-request"))}>
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>Create New Loan Request</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/loans?tab=pending"))}>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>View Pending Loan Requests</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/loans?tab=my-requests"))}>
            <FileText className="mr-2 h-4 w-4" />
            <span>My Loan Requests</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/loans?tab=outstanding"))}>
            <Wallet className="mr-2 h-4 w-4" />
            <span>Outstanding Loans</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Tools">
          <CommandItem onSelect={() => runCommand(() => window.open("/calculator", "_blank"))}>
            <Calculator className="mr-2 h-4 w-4" />
            <span>Loan Calculator</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => window.open("/analytics", "_blank"))}>
            <BarChart3 className="mr-2 h-4 w-4" />
            <span>Analytics Dashboard</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => window.open("/calendar", "_blank"))}>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Payment Calendar</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem onSelect={() => runCommand(() => window.open("/settings/profile", "_blank"))}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile Settings</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => window.open("/settings", "_blank"))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Account Settings</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => window.open("/help", "_blank"))}>
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Help & Support</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}

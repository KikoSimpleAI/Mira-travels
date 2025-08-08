"use client"

import { useState } from "react"
import { useAuth } from "./auth-provider"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { LogOut, User, Bookmark, Settings } from 'lucide-react'

export function UserMenu() {
  const { user, signOutUser } = useAuth()
  const [busy, setBusy] = useState(false)
  const router = useRouter()

  if (!user) return null

  const initials =
    user.displayName?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() ||
    (user.email ? user.email[0].toUpperCase() : "U")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="px-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.photoURL || "/placeholder.svg?height=40&width=40&query=user-avatar"} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="font-medium">{user.displayName || "Traveler"}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/profile")}>
          <User className="h-4 w-4 mr-2" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Bookmark className="h-4 w-4 mr-2" />
          Saved places
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/preferences")}>
          <Settings className="h-4 w-4 mr-2" />
          Preferences
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 cursor-pointer"
          onClick={async () => {
            setBusy(true)
            try {
              await signOutUser()
            } finally {
              setBusy(false)
            }
          }}
        >
          <LogOut className="h-4 w-4 mr-2" />
          {busy ? "Signing out..." : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

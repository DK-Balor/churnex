import { useState } from 'react'
import { Bell, Search, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import UserProfile from './UserProfile'

export default function DashboardHeader() {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSearch, setShowSearch] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <h2 className="text-lg font-semibold">Dashboard</h2>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Button
              variant="ghost"
              className="w-9 px-0"
              onClick={() => setShowSearch(!showSearch)}
            >
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="w-9 px-0"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-4 w-4" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Button
              variant="ghost"
              className="w-9 px-0"
              onClick={() => window.open('https://docs.churnex.ai', '_blank')}
            >
              <HelpCircle className="h-4 w-4" />
              <span className="sr-only">Help</span>
            </Button>
            <UserProfile />
          </div>
        </div>
      </div>

      {showSearch && (
        <Card className="absolute top-14 left-0 right-0 z-50 border-t-0 rounded-t-none p-4">
          <Input
            type="search"
            placeholder="Search..."
            className="w-full md:max-w-sm mx-auto"
            autoFocus
          />
        </Card>
      )}

      {showNotifications && (
        <Card className="absolute top-14 right-0 z-50 w-80 p-4">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">No new notifications</p>
          </div>
        </Card>
      )}
    </header>
  )
} 
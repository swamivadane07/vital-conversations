import { useState } from "react";
import { Bell, Search, User, Settings, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { ConnectionStatus, OfflineNotice } from "./OfflineNotice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function TopBar() {
  const [notifications] = useState(3);

  return (
    <>
      <OfflineNotice />
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="flex h-16 items-center px-6 gap-4">
          {/* Logo/Brand */}
          <div className="flex items-center gap-2 mr-4">
            <div className="w-8 h-8 bg-gradient-medical rounded-lg flex items-center justify-center shadow-glow">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="font-semibold text-lg hidden sm:block">HealthCare Pro</span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search doctors, tests, symptoms..."
              className="pl-10 pr-4 transition-all focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Connection Status */}
            <ConnectionStatus />

            {/* Theme Toggle */}
            <ModeToggle />

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative hover:bg-primary/10">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs animate-pulse"
                >
                  {notifications}
                </Badge>
              )}
              <span className="sr-only">Notifications</span>
            </Button>

            {/* Help */}
            <Button variant="ghost" size="icon" className="hover:bg-primary/10">
              <HelpCircle className="h-5 w-5" />
              <span className="sr-only">Help</span>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-primary/10">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder.svg" alt="User" />
                    <AvatarFallback className="bg-gradient-primary text-white">
                      JD
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">John Doe</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      john.doe@example.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="hover:bg-primary/10">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-primary/10">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive hover:bg-destructive/10">
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </>
  );
}
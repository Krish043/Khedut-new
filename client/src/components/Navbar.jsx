import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Menu, ShoppingCart, Bell, X, User, LogOut } from "lucide-react";
import logo from "../assets/logo2.jpg";
import defaultImg from "/dp.png";

const publicNavigation = [
  { name: "Home", href: "/" },
  { name: "Chat with AI", href: "/chat" },
];

const privateNavigation = [
  { name: "Schemes", href: "/schemes" },
  { name: "Learn", href: "/learn" },
  { name: "Blogs", href: "/blogs" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const [auth, setAuth] = useState({ auth: false });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const localAuth = localStorage.getItem("auth");
    if (!localAuth) {
      localStorage.setItem(
        "auth",
        JSON.stringify({ name: "", email: "", auth: false, role: "" })
      );
    }
    setAuth(JSON.parse(localAuth));
  }, []);

  const signOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("auth");
    setAuth({ auth: false });
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b fixed top-0 left-0 w-full z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col gap-4 pt-6">
                  {publicNavigation.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={({ isActive }) =>
                        `text-sm font-medium transition-colors hover:text-primary ${
                          isActive ? "text-primary" : "text-muted-foreground"
                        }`
                      }
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.name}
                    </NavLink>
                  ))}
                  {auth.auth &&
                    privateNavigation.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.href}
                        className={({ isActive }) =>
                          `text-sm font-medium transition-colors hover:text-primary ${
                            isActive ? "text-primary" : "text-muted-foreground"
                          }`
                        }
                        onClick={() => setMobileOpen(false)}
                      >
                        {item.name}
                      </NavLink>
                    ))}
                  {auth.auth && auth.role === "farmer" && (
                    <NavLink
                      to="/sell"
                      className={({ isActive }) =>
                        `text-sm font-medium transition-colors hover:text-primary ${
                          isActive ? "text-primary" : "text-muted-foreground"
                        }`
                      }
                      onClick={() => setMobileOpen(false)}
                    >
                      Sell
                    </NavLink>
                  )}
                  {auth.auth && auth.role === "businessman" && (
                    <NavLink
                      to="/buy"
                      className={({ isActive }) =>
                        `text-sm font-medium transition-colors hover:text-primary ${
                          isActive ? "text-primary" : "text-muted-foreground"
                        }`
                      }
                      onClick={() => setMobileOpen(false)}
                    >
                      Buy
                    </NavLink>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo and desktop navigation */}
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center">
              <img
                src={logo}
                alt="Logo"
                className="h-10 w-10 rounded-full bg-white p-1 object-cover"
              />
              <span className="ml-2 text-lg font-semibold hidden sm:block text-green-600">
                Khedut
              </span>
            </NavLink>

            <div className="hidden md:ml-10 md:block">
              <div className="flex space-x-6">
                {publicNavigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `text-sm font-medium transition-colors hover:text-green-500 ${
                        isActive ? "text-green-500" : "text-muted-foreground"
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
                {auth.auth &&
                  privateNavigation.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={({ isActive }) =>
                        `text-sm font-medium transition-colors hover:text-green-500 ${
                          isActive ? "text-green-500" : "text-muted-foreground"
                        }`
                      }
                    >
                      {item.name}
                    </NavLink>
                  ))}
                {auth.auth && auth.role === "farmer" && (
                  <NavLink
                    to="/sell"
                    className={({ isActive }) =>
                      `text-sm font-medium transition-colors hover:text-green-500 ${
                        isActive ? "text-green-500" : "text-muted-foreground"
                      }`
                    }
                  >
                    Sell
                  </NavLink>
                )}
                {auth.auth && auth.role === "businessman" && (
                  <NavLink
                    to="/buy"
                    className={({ isActive }) =>
                      `text-sm font-medium transition-colors hover:text-green-500 ${
                        isActive ? "text-green-500" : "text-muted-foreground"
                      }`
                    }
                  >
                    Buy
                  </NavLink>
                )}
              </div>
            </div>
          </div>

          {/* Right side icons */}
          <div className="flex items-center gap-4">
            {auth.auth ? (
              <>
                {auth.role === "businessman" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate("/cart")}
                  >
                    <ShoppingCart className="h-5 w-5" />
                  </Button>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={auth.img || defaultImg} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {auth.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {auth.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="text-green-700"
                  size="sm"
                  onClick={() => navigate("/signin")}
                >
                  Sign In
                </Button>
                <Button
                  variant="default"
                  className="bg-green-600 hover:bg-green-800"
                  size="sm"
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

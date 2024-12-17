"use client";

import { NextUIProvider } from "@nextui-org/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // Hook to get the current route and router
import React from "react";

import HomeButton from "@/components/homeButton"; // Import the HomeButton component
import "../styles/globals.css"; // Import Tailwind CSS styles

/**
 * Layout component that wraps the application with a consistent structure.
 *
 * @param {Object} props - The props object.
 * @param {React.ReactNode} props.children - The child components to be rendered within the layout.
 *
 * @returns {JSX.Element} The layout component.
 *
 * The layout includes:
 * - A conditional Navbar that is only rendered on the "/callback" route.
 * - A HomeButton that is rendered on every page except the main page ("/") and the callback page ("/callback").
 * - A main content area that renders the children passed to the layout.
 * - A footer that is consistently rendered across all pages.
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // Get the current route
  const router = useRouter(); // Get the router instance

  const handleManagerClick = (event: React.MouseEvent) => {
    const jobPositionId = localStorage.getItem("jobPositionId");

    if (!jobPositionId || Number(jobPositionId) !== 2) {
      alert(
        "Access restricted: You do not have permission to access the manager view.",
      );
      event.preventDefault(); // Prevent navigation
      router.push("/callback"); // Redirect to the callback page
    }
  };

  return (
    <html lang="en">
      <body>
        <NextUIProvider>
          <div className="min-h-screen flex flex-col items-center bg-gray-100 text-gray-900">
            {/* Render the Navbar only on the callback page */}
            {pathname === "/callback" && (
              <header className="w-full bg-red-600 py-4 shadow-lg">
                <div className="container mx-auto flex justify-between items-center px-4">
                  <h1 className="text-3xl text-white font-bold">
                    Cracked Donkey
                  </h1>

                  {/* Navigation Links */}
                  <nav className="flex space-x-4">
                    <Link
                      className="text-white hover:text-gray-200"
                      href="/kiosk"
                    >
                      Kiosk
                    </Link>
                    <Link
                      className="text-white hover:text-gray-200"
                      href="/kitchen"
                    >
                      Kitchen
                    </Link>
                    <Link
                      className="text-white hover:text-gray-200"
                      href="/menu"
                    >
                      Menu
                    </Link>
                    <Link
                      className="text-white hover:text-gray-200"
                      href="/cashier"
                    >
                      Cashier
                    </Link>
                    <Link
                      className="text-white hover:text-gray-200"
                      href="/manager"
                      onClick={handleManagerClick} // Add the click handler
                    >
                      Manager
                    </Link>
                    <Link
                      className="text-white hover:text-green-300"
                      href="/assistant"
                    >
                      AI Assistant
                    </Link>
                  </nav>
                </div>
              </header>
            )}

            {/* Render the HomeButton on every page except the main page and callback page */}
            {pathname !== "/" && pathname !== "/callback" && <HomeButton />}

            {/* Main Content */}
            <main className="w-full max-w-5xl px-4 py-6 flex-1">
              {children}
            </main>

            {/* Footer */}
            <footer className="w-full bg-gray-800 py-4 text-center text-white">
              <p>
                © {new Date().getFullYear()} Store Kiosk. All rights reserved.
              </p>
            </footer>
          </div>
        </NextUIProvider>
      </body>
    </html>
  );
}

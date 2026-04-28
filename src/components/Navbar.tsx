"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";

export default function Navbar({ user }: { user: { name?: string | null; role?: string | null } | null }) {
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-wivoo-blue tracking-tight">
              WIVOO
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            {user?.role === "ADMIN" && (
              <Link
                href="/admin"
                className="text-sm font-semibold text-gray-700 hover:text-wivoo-blue transition-colors"
              >
                Administration
              </Link>
            )}
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role?.toLowerCase()}</p>
              </div>
              <button
                onClick={() => signOut()}
                className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

"use client";

import { signIn } from "next-auth/react";

export default function SignInPage() {
  const handleDemoSignIn = (email: string) => {
    signIn("demo", { email, callbackUrl: "/" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl">
        <div className="text-center">
          <div className="flex justify-center mb-6">
             <div className="text-4xl font-bold text-wivoo-blue tracking-tight">WIVOO</div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Plateforme de Tâches
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Connectez-vous pour accéder au board
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <button
            onClick={() => signIn("google")}
            className="group relative flex w-full justify-center rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-wivoo-blue focus:ring-offset-2 transition-all"
          >
            Se connecter avec Google
          </button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500 font-medium uppercase tracking-wider">Mode Démo</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={() => handleDemoSignIn("consultant@wivoo.fr")}
              className="group relative flex w-full justify-center rounded-xl bg-wivoo-blue px-4 py-3 text-sm font-medium text-white hover:bg-wivoo-dark focus:outline-none focus:ring-2 focus:ring-wivoo-blue focus:ring-offset-2 transition-all"
            >
              Mode Démo (Consultant)
            </button>

            <button
              onClick={() => handleDemoSignIn("thibault.ambert@wivoo.fr")}
              className="group relative flex w-full justify-center rounded-xl border-2 border-wivoo-blue bg-white px-4 py-3 text-sm font-medium text-wivoo-blue hover:bg-wivoo-light focus:outline-none focus:ring-2 focus:ring-wivoo-blue focus:ring-offset-2 transition-all"
            >
              Mode Démo (Admin Thibault)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

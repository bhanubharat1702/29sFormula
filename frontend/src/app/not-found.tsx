"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0d0f12] text-white flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-[#16191e] border border-[#262b34] rounded-2xl p-8 text-center shadow-2xl space-y-6">
        <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto text-3xl font-light">
          404
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-white">Page Not Found</h1>
          <p className="text-sm text-gray-400 leading-relaxed">
            The page or resource you are looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-3">
          <Link
            href="/"
            className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg transition-all text-xs tracking-wider uppercase inline-flex items-center justify-center"
          >
            Return to Storefront
          </Link>
          <Link
            href="/superadmin"
            className="w-full py-2.5 px-4 bg-[#20252e] hover:bg-[#2a303b] text-gray-300 font-medium rounded-lg transition-all text-xs tracking-wider uppercase inline-flex items-center justify-center border border-[#323945]"
          >
            Go to Super Admin
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";

interface AccessDeniedProps {
  reason?: string;
  onLoginAgain?: () => void;
}

export default function AccessDenied({
  reason = "You do not have the necessary Super Admin privileges to view this control panel.",
  onLoginAgain
}: AccessDeniedProps) {
  return (
    <div className="min-h-screen bg-[#0d0f12] text-white flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-[#16191e] border border-red-500/20 rounded-2xl p-8 text-center shadow-2xl space-y-6">
        <div className="w-20 h-20 bg-red-500/10 border border-red-500/30 text-red-500 rounded-full flex items-center justify-center mx-auto text-3xl font-light">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest text-red-400 font-semibold bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
            403 Forbidden
          </span>
          <h1 className="text-2xl font-semibold tracking-tight text-white pt-2">Access Denied</h1>
          <p className="text-sm text-gray-400 leading-relaxed">
            {reason}
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-3">
          {onLoginAgain ? (
            <button
              onClick={onLoginAgain}
              className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg transition-all text-xs tracking-wider uppercase"
            >
              Re-authenticate Super Admin
            </button>
          ) : (
            <Link
              href="/login"
              className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg transition-all text-xs tracking-wider uppercase inline-flex items-center justify-center"
            >
              Log In as Super Admin
            </Link>
          )}

          <Link
            href="/"
            className="w-full py-2.5 px-4 bg-[#20252e] hover:bg-[#2a303b] text-gray-300 font-medium rounded-lg transition-all text-xs tracking-wider uppercase inline-flex items-center justify-center border border-[#323945]"
          >
            Back to Main Site
          </Link>
        </div>
      </div>
    </div>
  );
}

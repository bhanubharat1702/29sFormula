"use client";

import { useEffect } from "react";

export default function SuperAdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Super Admin Section Error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-[#16191e] border border-[#262b34] rounded-2xl p-8 shadow-2xl space-y-6">
        <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">Super Admin Dashboard Error</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            An error occurred while loading this administrative section. Your session remains secure.
          </p>
          {error.digest && (
            <p className="text-xs font-mono bg-[#0d0f12] text-gray-500 p-2 rounded border border-[#20252e]">
              Error Digest: {error.digest}
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => reset()}
            className="flex-1 py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg transition-all text-xs tracking-wider uppercase"
          >
            Retry Section
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex-1 py-2.5 px-4 bg-[#20252e] hover:bg-[#2a303b] text-gray-300 font-medium rounded-lg transition-all text-xs tracking-wider uppercase border border-[#323945]"
          >
            Reload App
          </button>
        </div>
      </div>
    </div>
  );
}

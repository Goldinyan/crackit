"use client";

import { LogIn } from "lucide-react";
import type { User } from "../../lib/db";

type LoginProps = {
  userInfo: User;
  handleInputChange: (field: keyof User, value: string) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  addingUser: () => void;
  isLoading: boolean;
  errorVisible: boolean;
  error: string;
};

export default function LoginForm({
  userInfo,
  handleInputChange,
  handleKeyDown,
  addingUser,
  isLoading,
  errorVisible,
  error,
}: LoginProps) {
  return (
    <div>
      <div className="transition-all duration-300 w-70 sm:w-110 md:w-150 lg:w-200 flex flex-col items-center justify-center">
        <div className="text-center flex flex-col gap-4 mb-8">
          <p className="text-xl uppercase tracking-[0.2em] text-neutral-400 transition-all duration-300 opacity-100 translate-y-0">
            Welcome
          </p>
          <h2 className="text-4xl font-semibold text-white transition-all duration-300 opacity-100 scale-100 translate-y-0">
            Create Account
          </h2>
          <p className="text-xl text-neutral-400 transition-all duration-300 delay-75 opacity-100 translate-y-0">
            Enter your details to get started
          </p>
        </div>

        <div className="w-full flex flex-col gap-6">
          <div className="border flex flex-col gap-4 p-8 rounded-2xl border-gray-400 transition-all duration-500 opacity-100 scale-100">
            <div className="flex flex-col gap-2">
              <label className="text-sm uppercase tracking-widest text-neutral-400">
                Username
              </label>
              <input
                type="text"
                value={userInfo.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter username (min. 5 characters)"
                className="w-full rounded-[50px] px-6 py-4 bg-neutral-800 text-white placeholder-neutral-500 outline-none border border-neutral-600 focus:border-neutral-400 focus:ring-2 focus:ring-neutral-400/50 transition-all duration-200 text-lg"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm uppercase tracking-widest text-neutral-400">
                Email
              </label>
              <input
                type="email"
                value={userInfo.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter your email"
                className="w-full rounded-[50px] px-6 py-4 bg-neutral-800 text-white placeholder-neutral-500 outline-none border border-neutral-600 focus:border-neutral-400 focus:ring-2 focus:ring-neutral-400/50 transition-all duration-200 text-lg"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm uppercase tracking-widest text-neutral-400">
                Backup Email (Optional)
              </label>
              <input
                type="email"
                value={userInfo.backupEmail}
                onChange={(e) =>
                  handleInputChange("backupEmail", e.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder="Enter backup email (optional)"
                className="w-full rounded-[50px] px-6 py-4 bg-neutral-800 text-white placeholder-neutral-500 outline-none border border-neutral-600 focus:border-neutral-400 focus:ring-2 focus:ring-neutral-400/50 transition-all duration-200 text-lg"
              />
            </div>
          </div>

          <button
            onClick={addingUser}
            disabled={isLoading}
            className="w-full rounded-full px-8 py-5 bg-neutral-300/90 text-neutral-800 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.6)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_14px_40px_-18px_rgba(0,0,0,0.65)] hover:scale-[1.02] active:translate-y-0 active:scale-100 active:shadow-[0_8px_25px_-18px_rgba(0,0,0,0.6)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:scale-100 flex items-center justify-center gap-3 text-lg font-semibold"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-neutral-800 border-t-transparent rounded-full animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <LogIn className="transition-transform duration-200" />
                <span>Create Account</span>
              </>
            )}
          </button>

          <div
            className={`text-center text-red-400 text-sm font-medium transition-all duration-300 ${
              errorVisible
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-2 scale-95 pointer-events-none"
            }`}
          >
            {error}
          </div>
        </div>
      </div>
    </div>
  );
}



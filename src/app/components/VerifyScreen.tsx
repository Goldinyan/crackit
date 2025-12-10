"use client";

import { useEffect, useState } from "react";
import { requestLoginCode, verifyLoginCode } from "../../../lib/db";
import { useSession } from "../SessionContext";
import { Mail, Shield } from "lucide-react";
import SectionHeader from "./SectionHeader";
import ErrorMessage from "./ErrorMessage";

export default function VerifyScreen() {
  const [username, setUsername] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [errorVisible, setErrorVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [codeRequested, setCodeRequested] = useState(false);
  const [isRequestingCode, setIsRequestingCode] = useState(false);
  const { session, setSession } = useSession();

  useEffect(() => {
    const interval = setInterval(() => {
      setErrorVisible(false);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const showError = (message: string) => {
    setError(message);
    setErrorVisible(true);
  };

  const fetchCode = async () => {
    if (username.length < 5) {
      showError("Username must be at least 5 characters!");
      return;
    }
    
    setIsRequestingCode(true);
    try {
      const errorMsg = await requestLoginCode(username);
      if (errorMsg) {
        showError(errorMsg);
      } else {
        setCodeRequested(true);
        setError("");
        setErrorVisible(false);
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to request code");
    } finally {
      setIsRequestingCode(false);
    }
  };

  const handleVerify = async () => {
    if (code.length !== 6) {
      showError("Code must be 6 digits!");
      return;
    }

    setIsLoading(true);
    try {
      const session = await verifyLoginCode(username, code);
      console.log(session);

      if (session) {
        setSession(session);
      } else {
        showError("Invalid code or user not found");
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (!codeRequested) {
        fetchCode();
      } else {
        handleVerify();
      }
    }
  };

  return (
    <div className="flex h-screen w-full bg-neutral-900 items-center justify-center">
      <div className="flex items-center justify-center w-full px-4">
        <div className="transition-all duration-300 w-70 sm:w-110 md:w-150 lg:w-200 flex flex-col items-center justify-center">
          <div className="mb-8">
            <SectionHeader
              label="Login"
              title="Verify Account"
              subtitle={codeRequested ? "Enter the code sent to your email" : "Enter your username to receive a verification code"}
            />
          </div>

          <div className="w-full flex flex-col gap-6">
            <div className="border flex flex-col gap-4 p-8 rounded-2xl border-gray-400 transition-all duration-500 opacity-100 scale-100">
              <div className="flex flex-col gap-2">
                <label className="text-sm uppercase tracking-widest text-neutral-400">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter your username"
                  disabled={codeRequested}
                  className="w-full rounded-[50px] px-6 py-4 bg-neutral-800 text-white placeholder-neutral-500 outline-none border border-neutral-600 focus:border-neutral-400 focus:ring-2 focus:ring-neutral-400/50 transition-all duration-200 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {codeRequested && (
                <div className="flex flex-col gap-2 animate-fade-in">
                  <label className="text-sm uppercase tracking-widest text-neutral-400">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                      setCode(value);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="000000"
                    className="w-full rounded-[50px] px-6 py-4 bg-neutral-800 text-white placeholder-neutral-500 outline-none border border-neutral-600 focus:border-neutral-400 focus:ring-2 focus:ring-neutral-400/50 transition-all duration-200 text-center text-2xl tracking-widest"
                  />
                  <p className="text-xs text-neutral-500 text-center mt-1">
                    Check your email for the 6-digit code
                  </p>
                </div>
              )}
            </div>

            {!codeRequested ? (
              <button
                onClick={fetchCode}
                disabled={isRequestingCode || username.length < 5}
                className="w-full rounded-full px-8 py-5 bg-neutral-300/90 text-neutral-800 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.6)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_14px_40px_-18px_rgba(0,0,0,0.65)] hover:scale-[1.02] active:translate-y-0 active:scale-100 active:shadow-[0_8px_25px_-18px_rgba(0,0,0,0.6)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:scale-100 flex items-center justify-center gap-3 text-lg font-semibold"
              >
                {isRequestingCode ? (
                  <>
                    <div className="w-5 h-5 border-2 border-neutral-800 border-t-transparent rounded-full animate-spin" />
                    <span>Sending Code...</span>
                  </>
                ) : (
                  <>
                    <Mail className="transition-transform duration-200" />
                    <span>Request Code</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleVerify}
                disabled={isLoading || code.length !== 6}
                className="w-full rounded-full px-8 py-5 bg-neutral-300/90 text-neutral-800 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.6)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_14px_40px_-18px_rgba(0,0,0,0.65)] hover:scale-[1.02] active:translate-y-0 active:scale-100 active:shadow-[0_8px_25px_-18px_rgba(0,0,0,0.6)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:scale-100 flex items-center justify-center gap-3 text-lg font-semibold"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-neutral-800 border-t-transparent rounded-full animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <Shield className="transition-transform duration-200" />
                    <span>Verify Code</span>
                  </>
                )}
              </button>
            )}

            {codeRequested && (
              <button
                onClick={() => {
                  setCodeRequested(false);
                  setCode("");
                  setError("");
                  setErrorVisible(false);
                }}
                className="w-full text-neutral-400 hover:text-neutral-300 text-sm transition-colors duration-200"
              >
                Request new code
              </button>
            )}

            <ErrorMessage message={error} visible={errorVisible} className="text-center" />
          </div>
        </div>
      </div>
    </div>
  );
}

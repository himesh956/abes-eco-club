import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { loginWithGoogle, checkIsAuthorizedAdmin } from '../services/admin.service';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onNavigateHome: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onNavigateHome }) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [unauthorizedEmail, setUnauthorizedEmail] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMessage(null);
    setUnauthorizedEmail(null);

    try {
      const user = await loginWithGoogle();
      const isAuthorized = await checkIsAuthorizedAdmin(user);

      if (isAuthorized) {
        onLoginSuccess();
      } else {
        setUnauthorizedEmail(user.email || 'Your account');
        setErrorMessage(
          `Access Denied: ${user.email} is not listed in the Eco Club authorized administrator allowlist.`
        );
      }
    } catch (err: unknown) {
      console.error(err);
      setErrorMessage(
        err instanceof Error ? err.message : 'Authentication failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7EF] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Back to public link */}
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7DAA65] hover:text-[#173F35] mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Public Website</span>
        </button>

        {/* Brand Lockup */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-[#173F35] text-[#C7E7A1] flex items-center justify-center shadow-md">
            <svg
              className="w-7 h-7 fill-none stroke-current stroke-2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
          </div>
          <div>
            <span className="font-serif text-2xl font-bold tracking-tight text-[#173F35] block">
              ECO CLUB
            </span>
            <span className="text-[11px] text-[#737D73] uppercase tracking-widest font-medium">
              Administrative Portal
            </span>
          </div>
        </div>

        <h2 className="text-center font-serif text-2xl font-bold text-[#173F35] mt-4">
          Sign In to Administrator Hub
        </h2>
        <p className="mt-2 text-center text-xs text-[#737D73] max-w">
          Secure management access for authorized Eco Club faculty heads, committee leads, and technical administrators.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#FCFCF8] py-8 px-6 shadow-xl rounded-3xl sm:px-10 border border-stone-200/90">
          {/* Error Notice */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">Authentication Notice</strong>
                <span>{errorMessage}</span>
                {unauthorizedEmail && (
                  <p className="mt-2 text-[11px] text-red-700">
                    If you are a faculty mentor or core committee lead, contact the club secretariat to grant administrative rights to your email.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-5 py-3.5 border border-stone-300 rounded-xl bg-white text-sm font-semibold text-[#202C25] hover:bg-stone-50 hover:border-stone-400 focus:outline-none focus:ring-2 focus:ring-[#7DAA65] shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 text-[#173F35] animate-spin" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Sign in with Verified Google Account</span>
              </>
            )}
          </button>

          {/* Security Assurance */}
          <div className="mt-8 pt-6 border-t border-stone-200 text-center">
            <div className="inline-flex items-center gap-1.5 text-xs text-[#737D73]">
              <ShieldCheck className="w-4 h-4 text-[#7DAA65]" />
              <span>Firebase Authentication & Zero-Trust RBAC Enabled</span>
            </div>
            <p className="mt-1 text-[11px] text-stone-400">
              Only authorized addresses can view student PII, applications, or modify public club drives.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

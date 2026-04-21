import Link from "next/link";
import { Mail } from "lucide-react";

export default function VerifyPage({ searchParams }) {
  const email = searchParams?.email || "your email";
  return (
    <div className="min-h-screen grid place-items-center p-6 anim-fade">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-neutral-900 rounded-full grid place-items-center mx-auto mb-6">
          <Mail className="text-amber-300" size={28} />
        </div>
        <h1 className="font-serif text-4xl mb-3">Check your email</h1>
        <p className="text-neutral-600 mb-2">We've sent a verification link to</p>
        <p className="font-mono text-sm mb-8">{decodeURIComponent(email)}</p>
        <p className="text-sm text-neutral-500 mb-6">Click the link in the email to verify your account, then log in.</p>
        <Link href="/login" className="inline-block py-3 px-6 bg-neutral-900 text-neutral-50 rounded-xl font-medium hover:bg-neutral-800">
          Back to log in
        </Link>
      </div>
    </div>
  );
}

import { LoginForm } from "./LoginForm";

export default function CustomerLoginPage({
  params,
}: {
  params: { token: string };
}) {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16 bg-neutral-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.4em] opacity-60 mb-3">
            Edit your event
          </p>
          <h1 className="font-display text-4xl">Sign in to continue</h1>
          <p className="opacity-70 text-sm mt-3">
            We&apos;ll email you a 6-digit code to confirm it&apos;s you.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-black/10 p-6">
          <LoginForm token={params.token} />
        </div>
        <p className="text-xs opacity-50 text-center mt-6">
          Trouble signing in? Contact the admin who sent your edit link.
        </p>
      </div>
    </main>
  );
}

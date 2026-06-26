import { LoginForm } from "./LoginForm";

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams?: { next?: string };
}) {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16 bg-neutral-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.4em] opacity-60 mb-3">
            Admin portal
          </p>
          <h1 className="font-display text-4xl">Sign in</h1>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-black/10 p-6">
          <LoginForm next={searchParams?.next ?? "/admin"} />
        </div>
      </div>
    </main>
  );
}

import Link from "next/link";

export default function EventNotFound() {
  return (
    <main className="min-h-[60vh] flex items-center justify-center text-center px-6">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] opacity-60 mb-3">Not live yet</p>
        <h1 className="font-display text-4xl sm:text-5xl">This event isn&apos;t available.</h1>
        <p className="opacity-70 mt-3 max-w-md mx-auto">
          The link may be wrong, or the site is still being prepared.
        </p>
        <Link href="/" className="inline-block mt-8 px-6 py-2.5 rounded-full border border-black/15 hover:bg-black/5">
          Back to home
        </Link>
      </div>
    </main>
  );
}

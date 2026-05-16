import Link from "next/link";

export default function NotFound() {
  return (
    <div className="fixed inset-0 bg-[#080810] flex items-center justify-center px-6">
      <div className="flex flex-col items-center gap-6 text-center max-w-md">
        <div className="text-7xl">🌑</div>
        <div>
          <h2 className="text-4xl font-black text-white mb-2">404</h2>
          <p className="text-white/45 text-sm leading-relaxed">
            This realm does not exist. Return to your quest.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="px-8 py-3 rounded-full text-sm font-bold text-white"
          style={{
            background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
            boxShadow: "0 0 20px rgba(124,58,237,0.4)",
          }}
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}

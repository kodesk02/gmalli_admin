import { LoginForm } from "@/components/auth/LoginForm";
import Image from "next/image";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex">
      {/* Left — Image Panel */}
      <div className="hidden md:flex relative w-1/2">
        <Image
          src="/images/arabian_tea.jpg"
          alt="Gmalli store"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-brand-red/20" />
      </div>

      {/* Right — Form Panel */}
      <div className="w-full md:w-1/2 bg-brand-cream flex flex-col p-4 min-h-screen">
        <div className="flex justify-end">
          <span className="text-2xl font-bold tracking-[0.2em] text-[#8B0000]">
            GMALLI
          </span>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
          <h1 className="text-2xl font-semibold text-[#8B0000] mb-8 text-center">
            Login
          </h1>
          <LoginForm />
        </div>

        <p className="text-center text-xs text-[#8B0000]/40">
          © {new Date().getFullYear()} Gmalli. Admin access only.
        </p>
      </div>
    </main>
  );
}
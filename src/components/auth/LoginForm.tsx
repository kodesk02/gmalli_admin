"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
// import { toast } from "sonner";
// import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); 
    
    console.log("Login details:", { email, password });
    
    router.push("/dashboard");
  };

  return (
    <form onSubmit={handleLogin} className="space-y-5">
      {/* Email */}
      <div className="space-y-2">
        <Label
          htmlFor="email"
          className="text-sm font-medium text-[#8B0000]/70"
        >
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          className="
            bg-[#F0E4D7] border-brand-red-light/20
            placeholder:text-[#8B0000]/30 text-[#8B0000]
            focus-visible:ring-[#8B0000] focus-visible:ring-1
            focus-visible:border-[#8B0000]/30
            rounded-xl h-12
          "
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label
          htmlFor="password"
          className="text-sm font-medium text-[#8B0000]/70"
        >
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            className="
              bg-[#F0E4D7] border-brand-red-light/20 pr-12
              placeholder:text-[#8B0000]/30 text-[#8B0000]
              focus-visible:ring-[#8B0000] focus-visible:ring-1
              focus-visible:border-[#8B0000]/30
              rounded-xl h-12
            "
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="
              absolute right-4 top-1/2 -translate-y-1/2
              text-[#8B0000]/40 hover:text-[#8B0000]/70
              transition-colors
            "
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="
          w-full h-12 rounded-xl mt-2
          bg-[#8B0000] hover:bg-brand-red-light
          text-white font-semibold tracking-wide
          transition-colors duration-200
        "
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Loader2 size={18} className="animate-spin" />
            Signing in...
          </span>
        ) : (
          "Go to Admin"
        )}
      </Button>
    </form>
  );
}
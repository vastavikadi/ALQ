import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { User } from "lucide-react";
import Image from "next/image";
import MusicPlayer from "@/components/MusicPlayer";

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user]);

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center font-sans text-white overflow-hidden"
      style={{
        backgroundImage: "url('/assets/images/game-home-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* 🎵 Music */}
      <MusicPlayer />

      {/* 👤 Profile Icon */}
      <div
        className="absolute top-5 right-6 z-10 p-2 bg-black/40 hover:bg-indigo-600 transition rounded-full border border-indigo-400/30 cursor-pointer"
        onClick={() => router.push("/profile")}
        title="View Profile"
      >
        <User className="h-6 w-6 text-white" />
      </div>

      {/* 🧭 Main Layout */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full max-w-7xl px-8 py-12 gap-12">

        {/* 📖 Left - Hero Story Section */}
        <div className="max-w-xl text-left space-y-6 p-6 rounded-2xl shadow-lg animate-fade-in">
          <h1 className="text-5xl font-extrabold text-yellow-400 drop-shadow-[0_2px_8px_rgba(234,179,8,0.8)] animate-slide-down">
            Welcome, {user?.username}!
          </h1>
          <p className="text-lg leading-relaxed text-gray-200 animate-fade-in-delay">
            <span className="block">The Shaolin Temple of Code lies in ruins...</span>
            <span className="block mt-2">The Complexity Dragon has awakened.</span>
            <span className="block mt-2">Your quest begins now. Will you become the Legendary Hero of Code?</span>
          </p>
          <Image
            src="/assets/shane-standing.png"
            alt="Shane the Coder"
            width={220}
            height={220}
            className="drop-shadow-[0_5px_15px_rgba(255,255,255,0.4)] mx-auto md:mx-0 animate-bounce-slow"
          />
        </div>

        {/* 🎮 Right - Game Actions */}
        <div className="flex flex-col items-center gap-6 p-8 rounded-2xl shadow-2xl animate-fade-in">
          <button
            onClick={() => router.push("/game/level1")}
            className="w-[220px] text-lg py-3 px-6 rounded-xl font-bold bg-gradient-to-tr from-[#0f0c29] via-[#302b63] to-[#24243e] hover:from-[#1f1c49] hover:to-[#343460] text-white shadow-[0_0_10px_rgba(100,100,255,0.6)] hover:shadow-[0_0_20px_rgba(150,150,255,0.8)] transition transform hover:scale-110 tracking-widest border border-blue-300"
          >
            ▶️ Start Game
          </button>

          <button
            onClick={() => router.push("/codex")}
            className="w-[220px] text-lg py-3 px-6 rounded-xl font-bold bg-gradient-to-tr from-[#1c1c1c] via-[#444] to-[#222] hover:from-[#333] hover:to-[#555] text-white shadow-[0_0_10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] transition transform hover:scale-110 tracking-widest border border-gray-400"
          >
            📜 Codex
          </button>
        </div>
      </div>

      {/* ✨ Particle Overlay or FX */}
      <div className="pointer-events-none fixed top-0 left-0 w-full h-full z-0 bg-[url('/assets/effects/stars-overlay.png')] opacity-10 animate-fade-in" />
    </div>
  );
}

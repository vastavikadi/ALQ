import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
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
      className="relative min-h-screen bg-cover bg-center text-white font-sans"
      style={{
        backgroundImage: "url('/assets/images/game-home-bg.jpg')", // Custom game-style background
      }}
    >
      <MusicPlayer />

      {/* 👤 Clickable User Icon – Top Right */}
      <div
        className="absolute top-4 right-4 z-10 flex items-center gap-2 cursor-pointer"
        onClick={() => router.push("/profile")}
        title="View Profile"
      >
        <Image
          src="/assets/user-icon.png"
          alt="User Icon"
          width={45}
          height={45}
          className="rounded-full border-2 border-yellow-500 hover:scale-105 transition"
        />
      </div>

      {/* 🏯 Left-Aligned Welcome & Story */}
      <div className="absolute top-1/2 left-10 transform -translate-y-1/2 max-w-xl">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-yellow-400 drop-shadow-lg">
          Welcome, {user?.username}!
        </h1>
        <p className="text-lg md:text-xl text-gray-200 bg-black bg-opacity-50 px-5 py-4 rounded-xl leading-relaxed">
          The Shaolin Temple of Code lies in ruins. The Complexity Dragon must be stopped.
          <br />Your quest begins now. Will you become the Legendary Hero of Code?
        </p>

        {/* Shane Image */}
        <div className="mt-6">
          <Image
            src="/assets/shane-standing.png"
            alt="Shane the Coder"
            width={200}
            height={200}
            className="drop-shadow-lg"
          />
        </div>
      </div>

      {/* Game Options */}
      <div className="absolute top-1/2 right-10 transform -translate-y-1/2 flex flex-col items-center gap-6">
        <button
          onClick={() => router.push("/game/level1")}
          className="bg-green-500 hover:bg-green-600 transition px-8 py-3 text-xl rounded-xl shadow-lg font-bold transform hover:scale-105 min-w-[200px] text-center"
        >
          ▶️ Start Game
        </button>

        <button
          onClick={() => router.push("/codex")}
          className="bg-blue-500 hover:bg-blue-600 transition px-8 py-3 text-xl rounded-xl shadow-lg font-bold transform hover:scale-105 min-w-[200px] text-center"
        >
          📜 Codex
        </button>
      </div>
    </div>
  );
}

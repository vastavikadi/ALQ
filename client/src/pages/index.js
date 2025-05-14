// pages/index.js

import Link from "next/link";
import MusicPlayer from "@/components/MusicPlayer";

export default function LandingPage() {
  
  return (
    <div className="min-h-screen text-white font-sans bg-fixed bg-cover bg-center"
      style={{backgroundImage: "url('/assets/images/background-image.png')",}}>
      {/* ✅ Persistent Music Player */}
      <MusicPlayer />
      
      {/* Hero Section */}
      <section className="text-center py-20 px-4 bg-opacity-40">
        <h1 className="text-5xl font-bold mb-4">⚔️ AlgoQuest</h1>
        <p className="text-xl mb-8 italic text-gray-300">
          Embark on a journey to defeat the Complexity Dragon using the power of algorithms!
        </p>
        <Link href="/auth/login">
          <button className="bg-purple-700 hover:bg-purple-600 transition px-6 py-3 rounded-full text-lg shadow-md">
            Start Your Quest
          </button>
        </Link>
      </section>

      {/* About the Game */}
      <section className="max-w-4xl mx-auto px-6 py-12 bg-black opacity-50 rounded-xl mt-10">
        <h2 className="text-3xl font-semibold mb-4">🌄 The Story Begins...</h2>
        <p className="text-gray-300 text-lg">
          In the ancient lands of AlgoRealm, the Shaolin Temple of Code was destroyed by the Complexity Dragon.
          You, Shane, the lone survivor, must master legendary algorithms, unlock the Codex, and bring balance to the world.
        </p>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 opacity-70">
        {[
          { title: "📜 The Codex", desc: "Unlock scrolls of wisdom after every challenge." },
          { title: "🏔️ 4 Epic Levels", desc: "Face minions in Data Town, Greedy Caves & more." },
          { title: "🧠 Learn by Doing", desc: "Each challenge teaches real DSA algorithms." },
        ].map(({ title, desc }, i) => (
          <div key={i} className="bg-gray-800 bg-opacity-80 p-6 rounded-xl shadow-lg hover:scale-105 transition-transform">
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-gray-400">{desc}</p>
          </div>
        ))}
      </section>

      {/* Final CTA */}
      <div className="text-center py-12 bg-opacity-40 rounded-xl mt-10 mx-4">
        <Link href="/auth/signup">
          <button className="bg-green-600 hover:bg-green-500 transition px-6 py-3 rounded-full text-lg">
            Create an Account & Begin!
          </button>
        </Link>
      </div>
    </div>
  );
}

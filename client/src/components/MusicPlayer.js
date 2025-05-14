import { useEffect, useRef, useState } from "react";

export default function MusicPlayer() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio && isPlaying) {
      audio.play().catch(e => {
        console.log("Autoplay blocked:", e);
      });
    }
  }, [isPlaying]);

  useEffect(() => {
    // Ensure music doesn't stop on route change
    const audio = audioRef.current;
    audio.loop = true;
    audio.volume = 0.5;
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <audio ref={audioRef} src="/assets/audio/Echoes_of_Eternity.mp3" autoPlay loop hidden />
      <button
        onClick={togglePlay}
        className="fixed top-4 left-4 z-50 bg-black bg-opacity-50 text-white p-2 rounded-full shadow-md hover:bg-opacity-80 transition"
      >
        {isPlaying ? "🔊" : "🔇"}
      </button>
    </>
  );
}

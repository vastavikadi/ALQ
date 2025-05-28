import dynamic from "next/dynamic";

const PhaserGame = dynamic(() => import("../../components/PhaserGameSecond"), {
  ssr: false,
});

export default function Level1Page() {
  return (
    <div className="w-full h-screen">
      <PhaserGame />
    </div>
  );
}

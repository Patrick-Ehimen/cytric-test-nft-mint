import { CirclePlay, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <div className="items-center justify-center">
      <div className="container pb-4 py-16 pt-1 md:py-24 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 max-w-4xl leading-tight tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]">
          Discover & Collect <span className="block">Extraordinary NFTs</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-2xl">
          Enter the world of digital art and collectibles. Explore unique NFTs
          created by artists worldwide.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white min-w-[180px] h-12 text-lg"
          >
            <div>
              <Rocket className="w-4 h-4 mr-2" />
            </div>
            Start Creating
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-slate-700 text-white hover:bg-slate-800 min-w-[180px] h-12 text-lg"
          >
            <CirclePlay className="w-4 h-4 mr-2" />
            Watch Demo
          </Button>
        </div>
      </div>
    </div>
  );
}

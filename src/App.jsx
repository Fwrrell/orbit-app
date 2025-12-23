import { useState } from "react";
import "./App.css";
import { Network, Zap, ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "./components/ui/button";

function App() {
  return (
    <div className="mesh-gradient min-h-screen selection:bg-[#598392] selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-8 py-6 lg:px-20 flex justify-between items-center backdrop-blur-md pointer-events-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-br from-[#124559] to-[#598392] rounded-xl flex items-center justify-center">
            <Network className="text-[#eff6e0] w-6 h-6" />
          </div>
          <span className="text-xl font-extrabold tracking-widest text-[#eff6e0]">
            ORBIT
          </span>
        </div>
        <div className="hidden md:flex gap-10 items-center">
          {["About", "Member of Group"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-sm font-medium text-[#aec3b0] hover:text-[#eff6e0] transition-colors"
            >
              {item}
            </a>
          ))}
          <Button variant="glass">Rate Experience!</Button>
        </div>
      </nav>
    </div>
  );
}

export default App;

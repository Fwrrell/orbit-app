import { useState } from "react";
// import "./App.css";
import { Network } from "lucide-react";

function App() {
  return (
    <>
      {/* wrapper */}
      <div className="min-h-screen mesh-gradient flex flex-col selection:bg-[#598392] selection:text-white">
        {/* Navbar */}
        <nav className="fixed w-full z-50 px-8 py-8 lg:px-16 flex justify-between items-center bg-transparent pointer-events-auto">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-11 h-11 btn-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <Network className="text-[#eff6e0] w-6 h-6" />
            </div>
            <span className="text-2xl font-extrabold tracking-tighter text-[#eff6e0]">
              ORBIT
            </span>
          </div>
          <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-[#aec3b0]/70">
            <a href="#" className="hover:text-[#eff6e0] transition-colors">
              About
            </a>
            <a href="#" className="hover:text-[#eff6e0] transition-colors">
              Member of Group
            </a>
            <button className="px-6 py-2.5 bg-[#aec3b0]/10 hover:bg-[#aec3b0]/20 text-[#eff6e0] rounded-xl transition-all border border-[#aec3b0]/10 backdrop-blur-xl">
              Rate Experience!
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}

export default App;

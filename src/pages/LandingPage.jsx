import { useEffect, useState } from "react";
import "../App.css";
import { Network, Zap, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "../components/ui/button";
import { MemberList } from "@/components/design-member";
import { useGraphSimulation } from "@/hooks/useGraphSimulation";

const LandingPage = () => {
  const navigate = useNavigate();

  const [navItem, setNavItem] = useState([
    { name: "Theory", directId: "theory-section" },
    { name: "Member of Group", directId: "member-section" },
  ]);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const graphApi = useGraphSimulation({
    containerId: "landing-preview-canvas",
    setRouters: null,
    setSimulationResult: null,
    setIsProcessing: null,
  });

  // untuk generate random graph saat load
  useEffect(() => {
    // tambah delay agar frame ter render lebih dulu
    const timer = setTimeout(() => {
      if (graphApi.current) {
        // Generate 8 node acak
        const width =
          document.getElementById("landing-preview-canvas")?.clientWidth || 600;
        const height =
          document.getElementById("landing-preview-canvas")?.clientHeight ||
          400;

        for (let i = 0; i < 8; i++) {
          const x = Math.random() * width * 0.8 + width * 0.1; // Margin 10%
          const y = Math.random() * height * 0.8 + height * 0.1;
          graphApi.current.addNode(x, y, false);
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen selection:bg-[var(--accent-mid)] selection:text-white">
      {/* Background */}
      <div className="mesh-gradient absolute top-0 left-0 w-full h-[80vh] -z-10 pointer-events-none" />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-8 py-6 lg:px-20 flex justify-between items-center backdrop-blur-md pointer-events-auto border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-br from-[var(--accent-deep)] to-[var(--accent-mid)] rounded-xl flex items-center justify-center">
            <Network className="text-[--text-light] w-6 h-6" />
          </div>
          <span className="text-xl font-extrabold tracking-widest text-[var(--text-light)]">
            ORBIT
          </span>
        </div>
        <div className="hidden md:flex gap-10 items-center uppercase tracking-wider">
          {navItem.map((item) => (
            <a
              key={item.directId}
              href="#"
              className="text-sm font-medium text-[var(--highlight)] hover:text-[var(--text-light)] transition-colors"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(item.directId);
              }}
            >
              {item.name}
            </a>
          ))}
          <Button variant="glass">Rate Experience!</Button>
        </div>
      </nav>

      <main className="pt-32 px-8 lg:px-20 max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh] mb-32">
          {/* TODO: animate fade-in then slide in from left */}
          <div className="space-y-8">
            <div className="inline-block px-4 py-1 rounded-full bg-[var(--highlight)]/10 border border-[var(--highlight)]/20">
              <span className="text-xs font-bold text-[var(--highlight)] uppercase tracking-widest">
                Graph Coloring
              </span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] text-[var(--text-light)] tracking-tight">
              Optimal Router <br />
              <span className="text-[var(--highlight)] italic font-normal">
                Balance & Topology
              </span>
            </h1>

            <p className="text-lg text-[var(--highlight)]/80 max-w-lg leading-relaxed font-medium">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut,
              voluptatem voluptatum quibusdam, officiis deleniti quisquam atque
              dolores neque perferendis temporibus consequatur quasi aliquam
              deserunt.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                variant="orbitPrimary"
                size="regSizeOrbit"
                onClick={() => navigate("/simulation")}
              >
                <Zap size={20} /> Run Simulation
              </Button>
              <Button variant="orbitSecondary" size="regSizeOrbit">
                Learn More <ArrowRight size={20} />
              </Button>
            </div>
          </div>

          {/* TODO: add graph and animate fade in then zoom in */}
          <div className="relative h-125 lg:h-150">
            <div className="absolute -inset-4 bg-[var(--accent-mid)]/5 blur-3xl rounded-full"></div>
            <div className="w-full h-full relative glass-card rounded-[2.5rem] overflow-hidden">
              {/* Frame Preview */}
              <div className="absolute top-6 left-8 z-10 flex items-center gap-2">
                <div className="w-2 h-2 bg-[#aec3b0] rounded-full animate-pulse" />
                <span className="text-[10px] font-mono font-bold text-[#aec3b0] tracking-[0.2em] uppercase">
                  Graph Preview
                </span>
              </div>

              <div
                id="landing-preview-canvas"
                className="absolute inset-0 cursor-grab active:cursor-grabbing"
              ></div>
            </div>
          </div>
        </section>

        {/* Theory Section */}
        <section id="theory-section" className="py-32">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-6xl font-extrabold text-[var(--text-light)] mb-4">
              Theory
            </h2>
          </div>
        </section>

        {/* Member Section */}
        <section id="member-section" className="py-40 border-t border-white/10">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-6xl font-extrabold text-[var(--text-light)] mb-4">
              Member of Group
            </h2>
          </div>
          <MemberList />
        </section>
      </main>
    </div>
  );
};

export default LandingPage;

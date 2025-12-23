import { useState } from "react";
import "../App.css";
import { Network, Zap, ArrowRight, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "../components/ui/button";
import GraphPreview from "../components/GraphPreview";

// dummy data maker
const generateRandomData = () => {
  const nodeCount = 11; // node maker

  const colors = [
    "var(--accent-deep, #124559)",
    "var(--accent-mid, #598392)",
    "var(--highlight, #aec3b0)",
  ];

  // 1. Generate Nodes
  const nodes = Array.from({ length: nodeCount }, (_, i) => ({
    id: `node-${i}`,
    // channel akan ditampilkan di tengah node (d.channel + 1)
    channel: Math.floor(Math.random() * 9),
    color: colors[i % colors.length], // Distribusi warna
  }));

  // 2. Generate Links
  const links = [];
  // Kita hubungkan node pusat (index 0) ke beberapa node lain
  for (let i = 1; i < nodes.length; i++) {
    if (Math.random() > 0.3) {
      links.push({
        source: nodes[0].id,
        target: nodes[i].id,
      });
    }
  }

  // Tambahkan beberapa koneksi acak antar node luar
  for (let i = 1; i < 5; i++) {
    links.push({
      source: nodes[i].id,
      target: nodes[i + 5]?.id || nodes[1].id,
    });
  }

  return { nodes, links };
};

const LandingPage = () => {
  const [graphData, setGraphData] = useState(generateRandomData());
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen selection:bg-[var(--accent-mid)] selection:text-white">
      {/* Background */}
      <div className="mesh-gradient fixed inset-0 -z-10 pointer-events-none" />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-8 py-6 lg:px-20 flex justify-between items-center backdrop-blur-md pointer-events-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-br from-[var(--accent-deep)] to-[var(--accent-mid)] rounded-xl flex items-center justify-center">
            <Network className="text-[--text-light] w-6 h-6" />
          </div>
          <span className="text-xl font-extrabold tracking-widest text-[var(--text-light)]">
            ORBIT
          </span>
        </div>
        <div className="hidden md:flex gap-10 items-center">
          {["About", "Member of Group"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-sm font-medium text-[var(--highlight)] hover:text-[var(--text-light)] transition-colors"
            >
              {item}
            </a>
          ))}
          <Button variant="glass">Rate Experience!</Button>
        </div>
      </nav>

      <main className="pt-24 px-8 lg:px-20 max-w-7xl mx-auto">
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
              {/* Frame Live Preview*/}
              <div className="absolute top-6 left-8 z-10 flex items-center gap-2">
                <div className="w-2 h-2 bg-[#aec3b0] rounded-full animate-pulse" />
                <span className="text-[10px] font-mono font-bold text-[#aec3b0] tracking-[0.2em] uppercase">
                  Live Graph Preview
                </span>
              </div>

              <GraphPreview data={graphData} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;

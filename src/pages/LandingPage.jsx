import { useEffect, useState } from "react";
import "../App.css";
import { Zap, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { MemberSection } from "@/components/MemberSection";
import { useGraphSimulation } from "@/hooks/useGraphSimulation";
import { TheorySection } from "@/components/TheorySection";

// Animasi
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const LandingPage = () => {
  const navigate = useNavigate();

  const [navItem, setNavItem] = useState([
    { name: "Theory", directId: "theory-section" },
    { name: "Member of Group", directId: "member-section" },
  ]);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      const navHeight = 80;
      const sectionPosition = section.offsetTop - navHeight;

      window.scrollTo({
        top: sectionPosition,
        behavior: "smooth",
      });
    }
  };

  // manggil d3 yang ada di hooks
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
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 w-full z-50 px-8 py-4 lg:px-24 flex justify-between items-center backdrop-blur-md pointer-events-auto border-b border-white/10 h-20"
      >
        {/* Container Logo */}
        <div className="flex items-center">
          <a href="/" className="flex items-center">
            <motion.img
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              src="/orbit-logo.png"
              alt="Orbit Logo"
              className="h-24 w-auto object-contain transition-transform"
            />
          </a>
        </div>{" "}
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
              <motion.span whileHover={{ scale: 1.1 }} className="inline-block">
                {item.name}
              </motion.span>
            </a>
          ))}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="glass">Rate Experience!</Button>
          </motion.div>
        </div>
      </motion.nav>

      <main className="pt-32 px-8 lg:px-20 max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh] mb-32">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-block px-4 py-1 rounded-full bg-[var(--highlight)]/10 border border-[var(--highlight)]/20"
            >
              <span className="text-xs font-bold text-[var(--highlight)] uppercase tracking-widest">
                Graph Coloring
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-5xl lg:text-6xl font-extrabold leading-[1.1] text-[var(--text-light)] tracking-tight"
            >
              Optimal <br />
              Router <br />
              <span className="text-[var(--highlight)] italic font-normal">
                Balance <br />
                Interference & <br />
                Topology
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg text-[var(--highlight)]/80 max-w-lg leading-relaxed font-medium text-justify"
            >
              ORBIT (Optimal Router Balanced Interference and Topology) that
              implements Graph Theory to solve channel allocation optimization
              problems for Wi-Fi routers. By utilizing the TSC-DSATUR algorithm,
              the application efficiently minimizes signal interference between
              neighboring routers.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="orbitPrimary"
                  size="regSizeOrbit"
                  onClick={() => navigate("/simulation")}
                >
                  <Zap size={20} /> Run Simulation
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="orbitSecondary"
                  size="regSizeOrbit"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("theory-section");
                  }}
                >
                  Learn More <ArrowRight size={20} />
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.4, type: "spring" }}
            className="relative h-125 lg:h-150"
          >
            <div className="absolute -inset-4 bg-[var(--accent-mid)]/5 blur-3xl rounded-full"></div>
            <div className="w-full h-full relative glass-card rounded-[2.5rem] overflow-hidden">
              {/* Frame Preview */}
              <div className="absolute top-6 left-8 z-10 flex items-center gap-2">
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-2 h-2 bg-[#aec3b0] rounded-full"
                />
                <span className="text-[10px] font-mono font-bold text-[#aec3b0] tracking-[0.2em] uppercase">
                  Graph Preview
                </span>
              </div>

              <div
                id="landing-preview-canvas"
                className="absolute inset-0 cursor-grab active:cursor-grabbing"
              ></div>
            </div>
          </motion.div>
        </section>

        {/* Theory Section */}
        <motion.section
          id="theory-section"
          className="py-32"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="text-center mb-20">
            <h2 className="text-4xl lg:text-6xl font-extrabold text-[var(--text-light)] mb-4">
              Theory
            </h2>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <TheorySection />
          </motion.div>
        </motion.section>

        {/* Member Section */}
        <motion.section
          id="member-section"
          className="py-40 border-t border-white/10 scroll-mt-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="text-center mb-20">
            <h2 className="text-4xl lg:text-6xl font-extrabold text-[var(--text-light)] mb-4">
              Member of Group
            </h2>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <MemberSection />
          </motion.div>
        </motion.section>
      </main>
    </div>
  );
};

export default LandingPage;

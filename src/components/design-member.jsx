import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const members = [
  {
    jobdesk:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore magni nemo hic!",
    name: "Samsul",
    npm: "618241123",
  },
  {
    jobdesk:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore magni nemo hic!",
    name: "Udin",
    npm: "618241123",
  },
  {
    jobdesk:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore magni nemo hic!",
    name: "Anis",
    npm: "618241123",
  },
];

export function MemberList() {
  const [activeIndex, setActiveIndex] = useState(0);

  const goNext = () => setActiveIndex((prev) => (prev + 1) % members.length);
  const goPrev = () =>
    setActiveIndex((prev) => (prev - 1 + members.length) % members.length);

  useEffect(() => {
    const timer = setInterval(goNext, 6000);
    return () => clearInterval(timer);
  }, []);

  const current = members[activeIndex];

  return (
    <div className="relative w-full max-w-6xl mx-auto min-h-[500px] flex items-center justify-center">
      <div className="relative w-full max-w-5xl">
        {/* Oversized index number - positioned to bleed off left edge */}
        <motion.div className="absolute -left-8 top-1/2 -translate-y-1/2 text-[28rem] font-bold text-[var(--highlight)]/[0.03] select-none pointer-events-none leading-none tracking-tighter">
          <AnimatePresence mode="wait">
            <motion.span
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="block"
            >
              {String(activeIndex + 1).padStart(2, "0")}
            </motion.span>
          </AnimatePresence>
        </motion.div>

        {/* Main content - asymmetric layout */}
        <div className="relative flex">
          {/* Center - main content */}
          <div className="flex-1 pl-16 py-12">
            {/* jobdesk with character reveal */}
            <div className="relative mb-12 min-h-[140px]">
              <AnimatePresence mode="wait">
                <motion.blockquote
                  key={activeIndex}
                  className="text-4xl md:text-5xl font-light text-[var(--text-light)] leading-[1.15] tracking-tight"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {current.jobdesk.split(" ").map((word, i) => (
                    <motion.span
                      key={i}
                      className="inline-block mr-[0.3em]"
                      variants={{
                        hidden: { opacity: 0, y: 20, rotateX: 90 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          rotateX: 0,
                          transition: {
                            duration: 0.5,
                            delay: i * 0.05,
                            ease: [0.22, 1, 0.36, 1],
                          },
                        },
                        exit: {
                          opacity: 0,
                          y: -10,
                          transition: { duration: 0.2, delay: i * 0.02 },
                        },
                      }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.blockquote>
              </AnimatePresence>
            </div>

            {/* name row */}
            <div className="flex items-end justify-between">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="flex items-center gap-4"
                >
                  {/* Animated line before name */}
                  <motion.div
                    className="w-8 h-px bg-[var(--text-light)]"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    style={{ originX: 0 }}
                  />
                  <div>
                    <p className="text-lg font-medium text-[var(--text-light)]">
                      {current.name}
                    </p>
                    <p className="text-sm text-[var(--text-light)]/60">
                      {current.npm}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex items-center gap-4">
                <motion.button
                  onClick={goPrev}
                  className="w-12 h-12 rounded-full glass-card flex items-center justify-center text-[var(--highlight)] hover:bg-[var(--highlight)] hover:text-[var(--accent-deep)] transition-all duration-300"
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute inset-0"
                    initial={{ x: "-100%" }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <ChevronLeft size={20} />
                </motion.button>

                <motion.button
                  onClick={goNext}
                  className="w-12 h-12 rounded-full glass-card flex items-center justify-center text-[var(--highlight)] hover:bg-[var(--highlight)] hover:text-[var(--accent-deep)] transition-all duration-300"
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute inset-0"
                    initial={{ x: "100%" }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <ChevronRight size={20} />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

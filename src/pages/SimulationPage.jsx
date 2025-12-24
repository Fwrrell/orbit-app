import "../App.css";
import { useState } from "react";
import { ChevronLeft, Settings, X, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { cn } from "@/lib/utils";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { Button, buttonVariants } from "@/components/ui/button";

const SimulationPage = () => {
  const navigate = useNavigate();
  const [showControls, setShowControls] = useState(false);

  const [routers, setRouters] = useState(["Router 1", "Router 2", "Router 3"]);

  const handleDeleteRouter = (name) => {
    console.log("Delete:", name);
  };

  return (
    <div className="mesh-gradient min-h-screen p-6 lg:p-10">
      {/* Simulation Header */}
      <header className="max-w-[1600px] mx-auto mb-6 flex justify-between items-center">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-[var(--highlight)] hover:text-[var(--text-light)] transition-colors font-bold group cursor-pointer"
        >
          <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />
          Back to Hub
        </button>
        <Button
          variant="glass"
          onClick={() => setShowControls((prev) => !prev)}
        >
          <Settings /> <span className="hidden md:inline">Configuration</span>
        </Button>
      </header>

      {/* Playground Container */}
      <div className="max-w-[1600px] mx-auto md:h-[calc(100vh-160px)]">
        <div
          className={`rounded-2xl h-full transition-all duration-300 ease-in-out
            ${showControls ? "grid grid-cols-10 gap-4" : "flex"}
          `}
        >
          {/* Graph Playground */}
          <div
            className={`relative overflow-hidden rounded-xl bg-black/10 ${
              showControls ? "col-span-8" : "flex-1"
            }`}
          >
            {/* Animated Grid Background */}
            <AnimatedGridPattern
              numSquares={40}
              maxOpacity={0.08}
              duration={3}
              repeatDelay={1}
              className={cn("pointer-events-none absolute inset-0 opacity-5s0")}
            />
            <div className="absolute inset-0 flex items-center justify-center text-[var(--highlight)] font-semibold text-sm">
              Graph Playground (D3.js)
            </div>
          </div>

          {/* Control Panel */}
          {showControls && (
            <div className="col-span-2 grid grid-rows-2 gap-6">
              {/* Control Box 1 */}
              <div className="glass-card rounded-xl p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-[var(--text-light)]">
                    Router List
                  </h3>
                  <X
                    className="cursor-pointer text-[var(--highlight)] hover:text-[var(--text-light)]"
                    onClick={() => setShowControls(false)}
                  />
                </div>

                <div className="relative flex-1">
                  {routers.length === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center text-center text-sm text-[var(--highlight)] opacity-70 px-4">
                      Click on empty area to add a router & drag node to
                      position.
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-2 max-h-80 overflow-y-auto pr-1">
                      {routers.map((item) => (
                        <div
                          key={item}
                          className={cn(
                            buttonVariants({ variant: "glass", size: "sm" }),
                            "cursor-default justify-between [&_svg]:pointer-events-auto"
                          )}
                        >
                          <span>{item}</span>

                          <Trash2
                            className="h-4 w-4 cursor-pointer text-red-400 opacity-70 hover:opacity-100 transition-colors"
                            onClick={() => {
                              alert("clicked");
                              handleDeleteRouter(item);
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Control Box 2 */}
              <div className="glass-card rounded-xl p-5 flex flex-col gap-4">
                <h3 className="font-bold text-[var(--text-light)]">
                  Information
                </h3>

                <div className="text-sm text-[var(--highlight)] opacity-80">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio
                  molestias ratione facere distinctio nobis, deleniti rem!
                </div>

                <Button variant="orbitSecondary" size="sm">
                  Reset View
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimulationPage;

import "../App.css";
import { useState } from "react";
import { ChevronLeft, Settings, X, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { Button } from "@/components/ui/button";
import { useGraphSimulation, channelColors } from "@/hooks/useGraphSimulation";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const SimulationPage = () => {
  const navigate = useNavigate();
  const [showControls, setShowControls] = useState(false);

  // state data untuk graph
  const [routers, setRouters] = useState([]); // data router

  // state running simulation
  const [isProcessing, setIsProcessing] = useState(false);
  const [simulationResult, setSimulationResult] = useState([]);

  // ref: jembatan antara react dan d3.js (di hooks)
  const graphApi = useGraphSimulation({
    containerId: "d3-canvas",
    setRouters,
    setSimulationResult,
    setIsProcessing,
  });

  // handlers
  const handleDeleteRouter = (id) => graphApi.current.removeNode(id);
  const handleClearGraph = () => graphApi.current.clearGraph();
  const handleRunSimulation = () => graphApi.current.runDSATUR();

  return (
    <div className="mesh-gradient min-h-screen p-4 lg:p-10 flex flex-col">
      {/* Simulation Header */}
      <header className="max-w-400 w-full mx-auto mb-6 flex justify-between items-center border-b border-white/10 pb-4 shrink-0">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-[var(--highlight)] hover:text-[var(--text-light)] transition-colors font-bold group cursor-pointer"
        >
          <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>

        {/* Config Button */}
        <div className="relative">
          <Button
            variant="glass"
            onClick={() => setShowControls((prev) => !prev)}
            className={cn(
              "transition-all duration-300",
              showControls && "bg-white/10 border-white/20"
            )}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={showControls ? "close" : "open"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center" // Center icon
              >
                {showControls ? <X /> : <Settings />}
              </motion.div>
            </AnimatePresence>

            <span className="hidden md:inline ml-1">
              {showControls ? "Close" : "Configuration"}
            </span>
          </Button>
        </div>
      </header>

      {/* Playground Container */}
      <div className="max-w-400 w-full mx-auto h-[calc(100vh-160px)] flex gap-4 overflow-hidden relative">
        {/* Canvas Graph */}
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          id="visual-container"
          className="relative overflow-hidden rounded-xl bg-black/10 flex-1 border border-white/5 shadow-inner"
        >
          {/* Background */}
          <AnimatedGridPattern
            numSquares={40}
            maxOpacity={0.08}
            duration={3}
            repeatDelay={1}
            className={cn("pointer-events-none")}
          />

          {/* D3 Layer */}
          <div id="d3-canvas" className="absolute inset-0 z-10"></div>

          {/* Empty State */}
          <AnimatePresence>
            {routers.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="pointer-events-none absolute inset-0 flex items-center justify-center text-[var(--highlight)] font-semibold text-2xl z-10"
              >
                <span className="animate-pulse">Click to add a router</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Control Panel */}
        <AnimatePresence mode="wait">
          {showControls && (
            <motion.div
              initial={{ width: 0, opacity: 0, x: 20 }}
              animate={{ width: 380, opacity: 1, x: 0 }}
              exit={{ width: 0, opacity: 0, x: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex flex-col gap-4 h-full min-h-0 min-w-0 overflow-hidden"
            >
              {/* Control Box 1: Router List */}
              <div className="glass-card rounded-xl p-5 flex flex-col gap-4 flex-[0.6] min-h-0 border-l border-white/10">
                <div className="flex items-center justify-between shrink-0">
                  <h3 className="font-bold text-[var(--text-light)] whitespace-nowrap">
                    Router List
                    <span className="text-[var(--highlight)] ml-1">
                      {routers.length > 0 && `(${routers.length})`}
                    </span>
                  </h3>
                </div>

                {/* List Router */}
                <div className="flex-1 overflow-y-auto min-h-0 hide-scrollbar pr-1">
                  {routers.length > 0 ? (
                    <ul className="flex flex-col gap-2">
                      <AnimatePresence>
                        {routers.map((node) => (
                          <motion.li
                            key={node.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                            className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 transition-colors rounded-lg border border-white/5 text-xs text-white group"
                          >
                            <div className="flex flex-col">
                              <strong className="text-[var(--text-light)] text-sm flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[var(--highlight)]"></span>
                                Router {node.label}
                                <span className="opacity-40 text-[11px] pl-4">
                                  ( X: {Math.round(node.x)}, Y:{" "}
                                  {Math.round(node.y)} )
                                </span>
                              </strong>
                            </div>
                            <Trash2
                              className="w-4 h-4 text-red-400 transition-opacity cursor-pointer"
                              onClick={() => handleDeleteRouter(node.id)}
                            />
                          </motion.li>
                        ))}
                      </AnimatePresence>
                    </ul>
                  ) : (
                    <div className="flex items-center justify-center text-center text-xs text-[var(--highlight)] opacity-50 h-full border-2 border-dashed border-white/10 rounded-lg">
                      List is empty
                    </div>
                  )}
                </div>

                <Button
                  variant="orbitPrimary"
                  size="sm"
                  className="w-full mt-1 shrink-0"
                  onClick={handleClearGraph}
                >
                  Clear Graph
                </Button>
              </div>

              {/* Control Box 2: Result */}
              <div className="glass-card rounded-xl p-5 flex flex-col gap-4 flex-[0.4] min-h-0 border-l border-white/10">
                <h3 className="font-bold text-[var(--text-light)] shrink-0">
                  Optimization Result
                </h3>

                <div className="flex-1 overflow-y-auto hide-scrollbar min-h-0 border border-white/5 bg-black/20 rounded-md">
                  {simulationResult.length > 0 ? (
                    <Table>
                      <TableHeader className="bg-white/5 sticky top-0 z-10 backdrop-blur-sm">
                        <TableRow className="border-b border-white/10 hover:bg-transparent">
                          <TableHead className="w-[80px] text-[var(--text-light)]">
                            Node
                          </TableHead>
                          <TableHead className="text-[var(--text-light)]">
                            Channel
                          </TableHead>
                          <TableHead className="text-[var(--text-light)]">
                            Interferences
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {simulationResult.map((node) => (
                          <TableRow
                            key={node.id}
                            className="border-b border-white/5 hover:bg-white/5"
                          >
                            <TableCell className="font-semibold py-2">
                              {node.label}
                            </TableCell>
                            <TableCell className="py-2">
                              {node.channel ? (
                                <span
                                  className="px-2 py-0.5 rounded text-[10px] font-bold shadow-sm inline-block min-w-[60px] text-center"
                                  style={{
                                    backgroundColor:
                                      channelColors[node.channel],
                                    color:
                                      node.channel === 5 || node.channel === 11
                                        ? "#fff"
                                        : "#000",
                                  }}
                                >
                                  Channel {node.channel}
                                </span>
                              ) : (
                                "-"
                              )}
                            </TableCell>
                            <TableCell className="py-2 font-mono text-xs opacity-70">
                              {node.totalInterference !== undefined
                                ? node.totalInterference.toFixed(1)
                                : "0.0"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="flex items-center justify-center h-full text-xs text-[var(--text-light)]/30 italic px-4 text-center">
                      {isProcessing ? (
                        <span className="animate-pulse">Loading...</span>
                      ) : (
                        "Run calculation to see channel assignment"
                      )}
                    </div>
                  )}
                </div>

                <Button
                  variant="orbitPrimary"
                  size="sm"
                  onClick={handleRunSimulation}
                  disabled={isProcessing || routers.length === 0}
                  className="shrink-0 relative overflow-hidden"
                >
                  Calculate Optimization
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SimulationPage;

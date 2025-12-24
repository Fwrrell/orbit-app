import "../App.css";
import { useRef, useState } from "react";
import { ChevronLeft, Settings, X, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { cn } from "@/lib/utils";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { Button } from "@/components/ui/button";
import { useGraphSimulation, channelColors } from "@/hooks/useGraphSimulation";

import {
  Table,
  TableBody,
  TableCaption,
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
    <div className="mesh-gradient min-h-screen p-4 lg:p-10">
      {/* Simulation Header */}
      <header className="max-w-420 mx-auto mb-6 flex justify-between items-center border-b border-white/10 pb-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-[var(--highlight)] hover:text-[var(--text-light)] transition-colors font-bold group cursor-pointer"
        >
          <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>
        <Button
          variant="glass"
          onClick={() => setShowControls((prev) => !prev)}
        >
          <Settings /> <span className="hidden md:inline">Configuration</span>
        </Button>
      </header>

      {/* Playground Container */}
      <div className="max-w-420 mx-auto md:h-[calc(100vh-160px)]">
        <div
          className={`rounded-2xl h-full transition-all duration-300 ease-in-out
            ${showControls ? "grid grid-cols-10 gap-4" : "flex"}
          `}
        >
          {/* Graph Playground Area*/}
          <div
            id="visual-container"
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
              className={cn("pointer-events-none")}
            />

            {/* layer khusus d3, karena d3 menjalankan clean svg nya (menghindari dupe) */}
            <div id="d3-canvas" className="absolute inset-0 z-10"></div>

            {/* No Node Exist */}
            {routers.length === 0 && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-[var(--highlight)] font-semibold text-2xl z-10 animate-pulse">
                Click to add a router
              </div>
            )}
          </div>

          {/* Control Panel */}
          {showControls && (
            <div className="col-span-2 flex flex-col gap-4 h-full min-h-0">
              {/* Control Box 1 */}
              <div className="glass-card rounded-xl p-5 flex flex-col gap-4 flex-1 min-h-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-[var(--text-light)]">
                    Router List
                    <span>
                      {routers.length === 0 ? "" : " (" + routers.length + ")"}
                    </span>
                  </h3>
                  <X
                    className="cursor-pointer text-[var(--highlight)] hover:text-[var(--text-light)]"
                    onClick={() => setShowControls(false)}
                  />
                </div>

                {/* List Router */}
                <div className="flex-1 overflow-y-auto min-h-0 hide-scrollbar">
                  {routers.length > 0 ? (
                    <ul className="flex flex-col">
                      {routers.map((node) => (
                        <li
                          key={node.id}
                          className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/10 text-xs text-white mb-2"
                        >
                          <div className="flex flex-col">
                            <strong className="text-[var(--text-light)] text-sm">
                              Router {node.label}
                            </strong>
                            <span className="opacity-50 text-[10px]">
                              X: {Math.round(node.x)}, Y: {Math.round(node.y)}
                            </span>
                          </div>
                          <Trash2
                            className="w-5 h-5 text-red-400 opacity-70 hover:opacity-100 cursor-pointer"
                            onClick={() => handleDeleteRouter(node.id)}
                          />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex items-center justify-center text-center text-xs text-[var(--highlight)] opacity-70 px-4 h-full py-4">
                      Click on empty area to add a router.
                    </div>
                  )}
                </div>

                {/* Reset Button */}
                <Button
                  variant="orbitPrimary"
                  size="sm"
                  className="w-full mt-1"
                  onClick={handleClearGraph}
                >
                  Clear Graph
                </Button>
              </div>

              {/* Control Box 2 */}
              <div className="glass-card rounded-xl p-5 flex flex-col gap-4 flex-1 min-h-0">
                <h3 className="font-bold text-[var(--text-light)]">
                  Optimization Result
                </h3>

                <div className="flex-1 overflow-y-auto hide-scrollbar min-h-0 border border-white/10 rounded-md">
                  {simulationResult.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow className={"border-b border-white/10"}>
                          <TableHead className="w-[100px]">Router</TableHead>
                          <TableHead>Channel</TableHead>
                          <TableHead>Interferences</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {simulationResult.map((node) => (
                          <TableRow
                            key={node.id}
                            className={"border-b border-white/10"}
                          >
                            <TableCell className="font-semibold">
                              Router {node.label}
                            </TableCell>
                            <TableCell>
                              {node.channel ? (
                                <span
                                  className="px-2 py-0.5 rounded text-[10px] font-bold shadow-sm whitespace-nowrap"
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
                            <TableCell className={"text-center"}>
                              {node.totalInterference !== undefined
                                ? node.totalInterference.toFixed(1)
                                : "0.0"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="flex items-center justify-center h-full text-xs text-[var(--text-light)]/40 italic">
                      Run calculation to see results
                    </div>
                  )}
                </div>

                <Button
                  variant="orbitPrimary"
                  size="sm"
                  onClick={handleRunSimulation}
                  disabled={isProcessing || routers.length === 0}
                >
                  Calculate
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

import "../App.css";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, Settings, X, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import * as d3 from "d3";

import { cn } from "@/lib/utils";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const channelColors = {
  1: "#EF5350", // Merah (Ch 1)
  2: "#FF7043",
  3: "#FFA726",
  4: "#FFCA28",
  5: "#FFEE58",
  6: "#66BB6A", // Hijau (Ch 6)
  7: "#26A69A",
  8: "#29B6F6",
  9: "#42A5F5",
  10: "#5C6BC0",
  11: "#AB47BC", // ch 11
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const SimulationPage = () => {
  const navigate = useNavigate();
  const [showControls, setShowControls] = useState(false);

  // state data untuk graph
  const [routers, setRouters] = useState([]); // data router

  // state running simulation
  const [isProcessing, setIsProcessing] = useState(false);
  const [simulationResult, setSimulationResult] = useState([]);

  // ref: jembatan antara react dan d3.js nya
  const deleteNodeRef = useRef(null);
  const clearGraphRef = useRef(null);
  const runSimulationRef = useRef(null);

  const handleDeleteRouter = (id) => {
    if (deleteNodeRef.current) {
      deleteNodeRef.current(id);
    }
  };

  const handleClearGraph = () => {
    if (clearGraphRef.current) {
      clearGraphRef.current();
    }
  };

  const handleRunSimulation = () => {
    if (runSimulationRef.current) {
      runSimulationRef.current();
    }
  };

  useEffect(() => {
    let nodes = [];
    let links = [];
    let nodeIdCounter = 0;
    const radius_Interference = 150;

    // svg container untuk graph
    const container = d3.select("#d3-canvas");
    container.select("svg").remove(); // untuk hapus svg d3 yang udah pernah dilakukan sebelumnya

    const svg = container
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .style("position", "absolute")
      .style("top", 0)
      .style("left", 0);

    const gLink = svg.append("g").attr("class", "links");
    const gNode = svg.append("g").attr("class", "nodes");

    // simulation d3
    const simulation = d3
      .forceSimulation(nodes)
      .force("charge", d3.forceManyBody().strength(-100))
      .force("collide", d3.forceCollide().radius(20))
      .on("tick", ticked);

    // CLICK EVENT
    svg.on("click", function (event) {
      if (event.target.tagName === "circle") return;
      const [x, y] = d3.pointer(event);
      addNode(x, y);
    });

    function addNode(x, y) {
      const newNode = {
        id: nodeIdCounter++,
        label: String.fromCharCode(65 + nodeIdCounter - 1),
        x: x,
        y: y,
        fx: x,
        fy: y,
        channel: null,
        totalInterference: 0,
      };
      nodes.push(newNode);
      setRouters([...nodes]);

      recalculateLinks();
      updateGraph();
    }

    function removeNode(id) {
      const index = nodes.findIndex((n) => n.id === id);
      if (index > -1) {
        nodes.splice(index, 1);
      }

      links = links.filter((l) => l.source.id !== id && l.target.id !== id);

      updateGraph();
      simulation.nodes(nodes);
      simulation.alpha(0.3).restart();
      setRouters([...nodes]);
    }

    deleteNodeRef.current = removeNode;

    function recalculateLinks() {
      links = [];
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const nodeA = nodes[i];
          const nodeB = nodes[j];
          const totalDist = Math.hypot(nodeA.x - nodeB.x, nodeA.y - nodeB.y);
          if (totalDist < radius_Interference) {
            links.push({ source: nodeA, target: nodeB, distance: totalDist });
          }
        }
      }
    }

    function ticked() {
      gLink
        .selectAll("line")
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);
      gNode
        .selectAll(".node")
        .attr("transform", (d) => `translate(${d.x},${d.y})`);
    }

    function updateGraph() {
      // Update Links
      const linkSelection = gLink
        .selectAll("line")
        .data(links, (d) => `${d.source.id}-${d.target.id}`);

      linkSelection.exit().remove();
      linkSelection
        .enter()
        .append("line")
        .merge(linkSelection) // gabung data baru & lama
        .attr("class", "link")
        .attr("stroke", "#45A29E")
        .attr("stroke-width", 2);

      // Update Nodes
      const nodeSelection = gNode.selectAll(".node").data(nodes, (d) => d.id);

      nodeSelection
        .exit()
        .transition()
        .duration(300)
        .attr("opacity", 0)
        .remove(); // hapus node

      const nodeEnter = nodeSelection
        .enter()
        .append("g")
        .attr("class", "node")
        .call(
          d3
            .drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
        );

      // node
      nodeEnter
        .append("circle")
        .attr("r", 15)
        .attr("fill", "#1F2833")
        .attr("stroke", "#FF5722")
        .attr("stroke-width", 2);

      // label node
      nodeEnter
        .append("text")
        .attr("dy", -20)
        .attr("text-anchor", "middle")
        .style("fill", "white")
        .text((d) => d.label);

      // update posisi node baru dan lama
      nodeEnter.merge(nodeSelection);

      simulation.nodes(nodes);
      simulation.alpha(0.3).restart();
    }

    function clearGraph() {
      nodes = [];
      links = [];
      nodeIdCounter = 0;

      setRouters([]); // reset state data routers
      setSimulationResult([]); // reset state result

      updateGraph(); // update untuk hapus node/links dari svg (graph)
      simulation.nodes(nodes);
      simulation.alpha(0.3).restart(); // reset simulation
    }

    clearGraphRef.current = clearGraph;

    // DRAG EVENT
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
      recalculateLinks();
      updateGraph();
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = event.x;
      d.fy = event.y;

      setRouters([...nodes]);
    }

    // Logic Algoritma
    function getInterferenceWeight(ch1, ch2) {
      if (!ch1 || !ch2) return 0;
      const diff = Math.abs(ch1 - ch2);
      // weight difference of distance of the channel
      if (diff === 0) return 1.0; //very bad
      if (diff === 1) return 0.8;
      if (diff === 2) return 0.5;
      if (diff === 3) return 0.2;
      if (diff === 4) return 0.1;
      return 0.0; // perfect
    }

    // TSC-DSATUR algorithm for coloring
    async function runDSATUR() {
      // update ke ui react
      setIsProcessing(true);
      setSimulationResult([]);

      // initialize stat for every router
      nodes.forEach((node) => {
        node.channel = null; // channel wifi null
        node.saturation = 0; // number of neighbor node colored
        node.degree = 0; // number of neighbor
      });

      links.forEach((link) => {
        link.source.degree = (link.source.degree || 0) + 1;
        link.target.degree = (link.target.degree || 0) + 1;
      });

      // filter every node that never colored
      const uncolored = () => nodes.filter((n) => n.channel === null);

      while (uncolored().length > 0) {
        // select node with the biggest number of neighbor
        let selectedNode = uncolored().sort((a, b) => {
          if (b.saturation !== a.saturation) return b.saturation - a.saturation;
          return b.degree - a.degree;
        })[0];
        // animation for each coloring
        gNode
          .selectAll("circle")
          .filter((d) => d.id === selectedNode.id)
          .transition()
          .duration(300)
          .attr("stroke", "#FFFF00")
          .attr("stroke-width", 5)
          .attr("r", 20);

        await sleep(500);

        // loop for channel 1 to 11
        let bestChannel = 1;
        let minInterference = Infinity;

        for (let ch = 1; ch <= 11; ch++) {
          let currentInterference = 0;

          // list every neighbor for selected node
          const neighbors = links
            .filter(
              (l) =>
                l.source.id === selectedNode.id ||
                l.target.id === selectedNode.id
            )
            .map((l) =>
              l.source.id === selectedNode.id ? l.target : l.source
            );

          // calculate interference for each neighbor to selected node
          neighbors.forEach((neighbor) => {
            if (neighbor.channel !== null) {
              currentInterference += getInterferenceWeight(
                ch,
                neighbor.channel
              );
            }
          });

          if (currentInterference < minInterference) {
            minInterference = currentInterference;
            bestChannel = ch;
          }
        }

        selectedNode.channel = bestChannel;
        selectedNode.totalInterference = minInterference;

        updateGraphColors();
        await sleep(500);

        // UPDATE SATURATION DEGREE for each neighbor
        const neighbors = links
          .filter(
            (l) =>
              l.source.id === selectedNode.id || l.target.id === selectedNode.id
          )
          .map((l) => (l.source.id === selectedNode.id ? l.target : l.source));

        neighbors.forEach((neighbor) => {
          // calculate unique number of neighbor colored
          const neighborOfNeighbor = links
            .filter(
              (l) => l.source.id === neighbor.id || l.target.id === neighbor.id
            )
            .map((l) => (l.source.id === neighbor.id ? l.target : l.source));

          const uniqueColors = new Set(
            neighborOfNeighbor.map((n) => n.channel).filter((c) => c !== null)
          );
          neighbor.saturation = uniqueColors.size;
        });
      }

      // update ke react state
      setIsProcessing(false);
      setSimulationResult([...nodes]); // kirim result algoritma nya
    }

    runSimulationRef.current = runDSATUR;

    // update color graph
    function updateGraphColors() {
      gNode
        .selectAll("circle")
        .transition()
        .duration(300)
        .attr("fill", (d) => (d.channel ? channelColors[d.channel] : "#1F2833"))
        .attr("r", 15)
        .attr("stroke", "#fff")
        .attr("stroke-width", 2);
    }

    // clean playground
    return () => {
      simulation.stop();
      container.selectAll("svg").remove(); // hapus svg (gambar graph) biar ga dupe
      deleteNodeRef.current = null;
      runSimulationRef.current = null;
    };
  }, []);

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

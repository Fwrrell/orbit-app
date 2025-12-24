import "../App.css";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, Settings, X, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import * as d3 from "d3";

import { cn } from "@/lib/utils";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { Button, buttonVariants } from "@/components/ui/button";

const SimulationPage = () => {
  const navigate = useNavigate();
  const [showControls, setShowControls] = useState(false);
  const [routers, setRouters] = useState([]);
  const deleteNodeRef = useRef(null);

  const handleDeleteRouter = (id) => {
    console.log("Delete:", id);
    if (deleteNodeRef.current) {
      deleteNodeRef.current(id);
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

    // clean playground
    return () => {
      simulation.stop();
      container.selectAll("svg").remove(); // hapus svg (gambar graph) biar ga dupe
      deleteNodeRef.current = null;
    };
  }, []);

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
            <div className="col-span-2 grid grid-rows-2 gap-6">
              {/* Control Box 1 */}
              <div className="glass-card rounded-xl p-5 flex flex-col gap-4">
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

                <div className="relative flex-1">
                  <div
                    className={cn(
                      "h-full",
                      routers.length === 0 ? "hidden" : "block"
                    )}
                  >
                    <ul className="flex flex-col max-h-80 overflow-y-auto pr-1">
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
                  </div>

                  {routers.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-center text-xs text-[var(--highlight)] opacity-70 px-4">
                      Click on empty area to add a router.
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

import { useEffect, useRef } from "react";
import * as d3 from "d3";

export const channelColors = {
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

export const useGraphSimulation = ({
  containerId,
  setRouters,
  setSimulationResult,
  setIsProcessing,
}) => {
  const apiRef = useRef({
    addNode: () => {},
    removeNode: () => {},
    clearGraph: () => {},
    runDSATUR: () => {},
  });

  useEffect(() => {
    let nodes = [];
    let links = [];
    let nodeIdCounter = 0;
    const radius_Interference = 150;

    // svg container untuk graph
    const container = d3.select(`#${containerId}`);
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

    function addNode(x, y, fixed = true) {
      const newNode = {
        id: nodeIdCounter++,
        label: String.fromCharCode(65 + nodeIdCounter - 1),
        x: x,
        y: y,
        fx: fixed ? x : null,
        fy: fixed ? y : null,
        channel: null,
        totalInterference: 0,
      };
      nodes.push(newNode);
      syncState();

      recalculateLinks();
      updateGraph();
    }

    apiRef.current.addNode = addNode;

    // function ini assign ke ref agar bisa dipanggil dari UI
    apiRef.current.removeNode = (id) => {
      const index = nodes.findIndex((n) => n.id === id);
      if (index > -1) nodes.splice(index, 1);
      links = links.filter((l) => l.source.id !== id && l.target.id !== id);

      updateGraph();
      simulation.nodes(nodes);
      simulation.alpha(0.3).restart();
      syncState();
    };

    apiRef.current.clearGraph = () => {
      nodes = [];
      links = [];
      nodeIdCounter = 0;

      if (setRouters) {
        setRouters([]);
      }
      if (setSimulationResult) {
        setSimulationResult([]);
      }

      updateGraph();
      simulation.nodes(nodes);
      simulation.alpha(0.3).restart();
    };

    function syncState() {
      if (setRouters) {
        setRouters([...nodes]);
      }
    }

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

      syncState();
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

    // update color graph
    function updateGraphColors() {
      gNode
        .selectAll("circle")
        .transition()
        .duration(300)
        .attr("fill", (d) => (d.channel ? channelColors[d.channel] : "#1F2833"))
        .attr("r", 15)
        .attr("stroke", "rgba(255,255,255,0.7)")
        .attr("stroke-width", 2);
    }

    // TSC-DSATUR algorithm for coloring
    apiRef.current.runDSATUR = async () => {
      setIsProcessing(true);
      setSimulationResult([]);

      // Reset
      nodes.forEach((node) => {
        node.channel = null;
        node.saturation = 0;
        node.degree = 0;
      });
      links.forEach((link) => {
        link.source.degree = (link.source.degree || 0) + 1;
        link.target.degree = (link.target.degree || 0) + 1;
      });

      const uncolored = () => nodes.filter((n) => n.channel === null);

      while (uncolored().length > 0) {
        let selectedNode = uncolored().sort((a, b) => {
          if (b.saturation !== a.saturation) return b.saturation - a.saturation;
          return b.degree - a.degree;
        })[0];

        // Highlight Animation
        gNode
          .selectAll("circle")
          .filter((d) => d.id === selectedNode.id)
          .transition()
          .duration(300)
          .attr("stroke", "#FFFF00")
          .attr("stroke-width", 5)
          .attr("r", 20);
        await sleep(500);

        // Assign Channel
        let bestChannel = 1;
        let minInterference = Infinity;

        for (let ch = 1; ch <= 11; ch++) {
          let currentInterference = 0;
          const neighbors = links
            .filter(
              (l) =>
                l.source.id === selectedNode.id ||
                l.target.id === selectedNode.id
            )
            .map((l) =>
              l.source.id === selectedNode.id ? l.target : l.source
            );

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

        // Update Neighbors Saturation
        const neighbors = links
          .filter(
            (l) =>
              l.source.id === selectedNode.id || l.target.id === selectedNode.id
          )
          .map((l) => (l.source.id === selectedNode.id ? l.target : l.source));

        neighbors.forEach((neighbor) => {
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

      setIsProcessing(false);
      setSimulationResult([...nodes]);
    };

    // clean playground
    return () => {
      simulation.stop();
      container.selectAll("svg").remove(); // hapus svg (gambar graph) biar ga dupe
    };
  }, []);

  return apiRef;
};

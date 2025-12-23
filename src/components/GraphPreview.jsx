import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const GraphPreview = ({ data }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current) return;
    if (!data || !data.nodes || data.nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    svg.selectAll("*").remove();

    const cx = width / 2;
    const cy = height / 2;
    const r1 = Math.min(width, height) * 0.22;
    const r2 = Math.min(width, height) * 0.4;

    const nodes = data.nodes.map((n, i) => {
      if (i === 0) return { ...n, x: cx, y: cy };

      if (i <= 5) {
        const a = (i / 5) * Math.PI * 2;
        return { ...n, x: cx + r1 * Math.cos(a), y: cy + r1 * Math.sin(a) };
      }

      const a = ((i - 5) / 6) * Math.PI * 2 + Math.PI / 6;
      return { ...n, x: cx + r2 * Math.cos(a), y: cy + r2 * Math.sin(a) };
    });

    const sim = d3
      .forceSimulation(nodes)
      .alphaDecay(0.1)
      .force(
        "link",
        d3
          .forceLink(data.links)
          .id((d) => d.id)
          .distance(80)
          .strength(0.1)
      )
      .force("x", d3.forceX((d) => d.x).strength(1))
      .force("y", d3.forceY((d) => d.y).strength(1))
      .force("collision", d3.forceCollide(25));

    const link = svg
      .append("g")
      .selectAll("line")
      .data(data.links)
      .enter()
      .append("line")
      .attr("stroke", "#598392")
      .attr("stroke-width", 1.5)
      .attr("stroke-opacity", 0.25);

    const node = svg.append("g").selectAll("g").data(nodes).enter().append("g");

    node
      .append("circle")
      .attr("r", 18)
      .attr("fill", (d) => d.color || "#124559")
      .attr("stroke", "#01161e")
      .attr("stroke-width", 2);

    node
      .append("text")
      .attr("dy", 5)
      .attr("text-anchor", "middle")
      .attr("fill", "#ffffff")
      .attr("font-size", 10)
      .attr("font-weight", "bold")
      .style("pointer-events", "none")
      .text((d) => (d.channel != null ? d.channel + 1 : "AP"));

    sim.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    return () => sim.stop();
  }, [data]);

  return <svg ref={svgRef} className="w-full h-full" />;
};

export default GraphPreview;

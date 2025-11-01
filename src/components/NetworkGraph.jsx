import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const NetworkGraph = ({ data, highlightedNodes, onNodeClick }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const g = svg.append('g');

    const zoom = d3.zoom()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });
    
    svg.call(zoom);

    const colorScale = d3.scaleOrdinal()
      .domain(data.nodes.map(n => n.id))
      .range(d3.schemeCategory10);

    const simulation = d3.forceSimulation(data.nodes)
      .force('link', d3.forceLink(data.links).id(d => d.id).distance(120))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(50));

    const link = g.append('g')
      .selectAll('line')
      .data(data.links)
      .join('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', d => Math.sqrt(d.weight) * 2);

    const node = g.append('g')
      .selectAll('g')
      .data(data.nodes)
      .join('g')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    node.append('circle')
      .attr('r', d => 12 + Math.sqrt(d.size) * 3)
      .attr('fill', d => highlightedNodes.includes(d.id) ? '#27ae60' : colorScale(d.id))
      .attr('stroke', d => highlightedNodes.includes(d.id) ? '#1e8449' : '#fff')
      .attr('stroke-width', d => highlightedNodes.includes(d.id) ? 4 : 2.5)
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        event.stopPropagation();
        onNodeClick(d.id);
      })
      .on('mouseover', function() {
        d3.select(this).attr('stroke-width', 4);
      })
      .on('mouseout', function(event, d) {
        d3.select(this).attr('stroke-width', highlightedNodes.includes(d.id) ? 4 : 2.5);
      });

    const labelGroup = node.append('g');
    
    const text = labelGroup.append('text')
      .text(d => d.label.length > 30 ? d.label.slice(0, 30) + '...' : d.label)
      .attr('font-size', '11px')
      .attr('text-anchor', 'middle')
      .attr('dy', d => 22 + Math.sqrt(d.size) * 3)
      .attr('fill', '#2c3e50')
      .attr('font-weight', '500')
      .style('pointer-events', 'none');

    text.each(function() {
      const bbox = this.getBBox();
      d3.select(this.parentNode).insert('rect', 'text')
        .attr('x', bbox.x - 2)
        .attr('y', bbox.y - 1)
        .attr('width', bbox.width + 4)
        .attr('height', bbox.height + 2)
        .attr('fill', 'white')
        .attr('fill-opacity', 0.8)
        .attr('rx', 2);
    });

    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
    };

  }, [data, highlightedNodes, onNodeClick]);

  return (
    <svg
      ref={svgRef}
      style={{
        width: '100%',
        height: '100%',
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
        background: '#fafafa'
      }}
    />
  );
};

export default NetworkGraph;

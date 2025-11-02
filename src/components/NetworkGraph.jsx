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

    // 노드 필터링: 하위 5개 제거
    const sortedNodes = [...data.nodes].sort((a, b) => b.size - a.size);
    const nodesToRemove = sortedNodes.slice(-5).map(n => n.id);
    const filteredNodes = data.nodes.filter(n => !nodesToRemove.includes(n.id));
    const filteredLinks = data.links.filter(l => 
      !nodesToRemove.includes(l.source.id || l.source) && 
      !nodesToRemove.includes(l.target.id || l.target)
    );

    // Link weight 분석
    const weights = filteredLinks.map(l => l.weight);
    const maxWeight = Math.max(...weights);
    const minWeight = Math.min(...weights);
    const weightThreshold = minWeight + (maxWeight - minWeight) * 0.3;  // 하위 30%는 약한 링크

    // Force simulation with adjusted parameters
    const simulation = d3.forceSimulation(filteredNodes)
      .force('link', d3.forceLink(filteredLinks).id(d => d.id).distance(150))
      .force('charge', d3.forceManyBody().strength(-600))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(40));

    // Links - 강도에 따라 차별화
    const link = g.append('g')
      .selectAll('line')
      .data(filteredLinks)
      .join('line')
      .attr('stroke', d => {
        // 강한 링크는 진한 색, 약한 링크는 연한 색
        if (d.weight >= weightThreshold) {
          return '#555';  // 진한 회색
        } else {
          return '#ddd';  // 연한 회색
        }
      })
      .attr('stroke-opacity', d => {
        // 강도에 따라 투명도 조절
        if (d.weight >= weightThreshold) {
          // 강한 링크: 0.4 ~ 0.8
          const normalized = (d.weight - weightThreshold) / (maxWeight - weightThreshold);
          return 0.4 + normalized * 0.4;
        } else {
          // 약한 링크: 매우 연하게
          return 0.1;
        }
      })
      .attr('stroke-width', d => {
        // 강한 링크만 두껍게
        if (d.weight >= weightThreshold) {
          return Math.min(Math.sqrt(d.weight) * 1.5, 4);
        } else {
          return 1;
        }
      });

    const node = g.append('g')
      .selectAll('g')
      .data(filteredNodes)
      .join('g')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    // Nodes - 크기 축소
    node.append('circle')
      .attr('r', d => Math.min(8 + Math.sqrt(d.size) * 1.5, 30))
      .attr('fill', d => highlightedNodes.includes(d.id) ? '#27ae60' : colorScale(d.id))
      .attr('stroke', d => highlightedNodes.includes(d.id) ? '#1e8449' : '#fff')
      .attr('stroke-width', d => highlightedNodes.includes(d.id) ? 3 : 2)
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        event.stopPropagation();
        onNodeClick(d.id);
      })
      .on('mouseover', function(event, d) {
        d3.select(this)
          .attr('stroke-width', 4)
          .attr('r', Math.min(8 + Math.sqrt(d.size) * 1.5, 30) * 1.2);
      })
      .on('mouseout', function(event, d) {
        d3.select(this)
          .attr('stroke-width', highlightedNodes.includes(d.id) ? 3 : 2)
          .attr('r', Math.min(8 + Math.sqrt(d.size) * 1.5, 30));
      });

    // Labels - 전체 텍스트 표시, 줄바꿈 처리
    const labelGroup = node.append('g');
    
    const text = labelGroup.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', d => Math.min(8 + Math.sqrt(d.size) * 1.5, 30) + 16)
      .attr('fill', '#2c3e50')
      .attr('font-weight', '600')
      .style('pointer-events', 'none');

    // 긴 텍스트를 여러 줄로 나누기
    text.each(function(d) {
      const textElement = d3.select(this);
      const words = d.label.split(' ');
      const lineHeight = 1.2;
      const maxCharsPerLine = 20;
      
      let line = [];
      let lineNumber = 0;
      let tspan = textElement.append('tspan')
        .attr('x', 0)
        .attr('dy', 0)
        .attr('font-size', '11px');
      
      words.forEach((word, i) => {
        line.push(word);
        tspan.text(line.join(' '));
        
        if (tspan.node().getComputedTextLength() > maxCharsPerLine * 5.5 && line.length > 1) {
          line.pop();
          tspan.text(line.join(' '));
          line = [word];
          lineNumber++;
          tspan = textElement.append('tspan')
            .attr('x', 0)
            .attr('dy', lineHeight + 'em')
            .attr('font-size', '11px')
            .text(word);
        }
      });
    });

    // Label background - 더 연하게
    text.each(function() {
      const bbox = this.getBBox();
      d3.select(this.parentNode).insert('rect', 'text')
        .attr('x', bbox.x - 4)
        .attr('y', bbox.y - 2)
        .attr('width', bbox.width + 8)
        .attr('height', bbox.height + 4)
        .attr('fill', 'white')
        .attr('fill-opacity', 0.7)  // 0.95 → 0.7 (더 연하게)
        .attr('rx', 3)
        .attr('stroke', '#e0e0e0')
        .attr('stroke-width', 0.5);
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

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const NetworkGraph = ({ data, highlightedNodes, onNodeClick, onLinkClick }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Tooltip 생성
    const tooltip = d3.select('body').append('div')
      .attr('class', 'network-tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background-color', 'rgba(0, 0, 0, 0.85)')
      .style('color', 'white')
      .style('padding', '10px 14px')
      .style('border-radius', '6px')
      .style('font-size', '13px')
      .style('font-weight', '500')
      .style('pointer-events', 'none')
      .style('z-index', '1000')
      .style('box-shadow', '0 4px 12px rgba(0,0,0,0.3)');

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
    const weightThreshold = minWeight + (maxWeight - minWeight) * 0.3;

    // Force simulation with adjusted parameters
    const simulation = d3.forceSimulation(filteredNodes)
      .force('link', d3.forceLink(filteredLinks).id(d => d.id).distance(150))
      .force('charge', d3.forceManyBody().strength(-600))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(40));

    // Links - 강도에 따라 차별화 + 클릭 가능
    const link = g.append('g')
      .selectAll('line')
      .data(filteredLinks)
      .join('line')
      .attr('stroke', d => {
        if (d.weight >= weightThreshold) {
          return '#555';
        } else {
          return '#ddd';
        }
      })
      .attr('stroke-opacity', d => {
        if (d.weight >= weightThreshold) {
          const normalized = (d.weight - weightThreshold) / (maxWeight - weightThreshold);
          return 0.4 + normalized * 0.4;
        } else {
          return 0.1;
        }
      })
      .attr('stroke-width', d => {
        if (d.weight >= weightThreshold) {
          return Math.min(Math.sqrt(d.weight) * 1.5, 4);
        } else {
          return 1;
        }
      })
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        event.stopPropagation();
        const sourceId = d.source.id || d.source;
        const targetId = d.target.id || d.target;
        if (onLinkClick) {
          onLinkClick(sourceId, targetId);
        }
      })
      .on('mouseover', function(event, d) {
        const hoveredLink = d3.select(this);
        const sourceId = d.source.id || d.source;
        const targetId = d.target.id || d.target;
        
        // 툴팁 표시 - 링크의 concept pair 개수
        const pairCount = d.weight || 0;
        tooltip.html(`<strong>Concept Pairs:</strong> ${pairCount}`)
          .style('visibility', 'visible')
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
        
        // 링크 강조 - 약한 링크도 굵게
        hoveredLink
          .attr('stroke', '#2196f3')
          .attr('stroke-width', 6)
          .attr('stroke-opacity', 0.8);
        
        // 연결된 노드 강조
        node.selectAll('circle')
          .attr('stroke-width', function(nodeData) {
            const nodeId = nodeData.id;
            if (nodeId === sourceId || nodeId === targetId) {
              return 4;
            }
            return highlightedNodes.includes(nodeId) ? 3 : 2;
          })
          .attr('opacity', function(nodeData) {
            const nodeId = nodeData.id;
            if (nodeId === sourceId || nodeId === targetId) {
              return 1.0;
            }
            if (highlightedNodes.length > 0) {
              return highlightedNodes.includes(nodeId) ? 1.0 : 0.25;
            }
            return 0.4; // hover 시 다른 노드는 흐리게
          });
      })
      .on('mousemove', function(event) {
        tooltip
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mouseout', function(event, d) {
        const link = d3.select(this);
        
        // 툴팁 숨기기
        tooltip.style('visibility', 'hidden');
        
        // 링크 원상복구
        link
          .attr('stroke', d.weight >= weightThreshold ? '#555' : '#ddd')
          .attr('stroke-width', d.weight >= weightThreshold ? Math.min(Math.sqrt(d.weight) * 1.5, 4) : 1)
          .attr('stroke-opacity', d => {
            if (d.weight >= weightThreshold) {
              const normalized = (d.weight - weightThreshold) / (maxWeight - weightThreshold);
              return 0.4 + normalized * 0.4;
            }
            return 0.1;
          });
        
        // 노드 원상복구
        node.selectAll('circle')
          .attr('stroke-width', d => highlightedNodes.includes(d.id) ? 3 : 2)
          .attr('opacity', d => {
            if (highlightedNodes.length > 0) {
              return highlightedNodes.includes(d.id) ? 1.0 : 0.25;
            }
            return 1.0;
          });
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
      .attr('fill', d => colorScale(d.id))  // 항상 원래 색상 유지
      .attr('stroke', d => {
        // 선택된 노드는 진한 테두리, 나머지는 흰색
        if (highlightedNodes.includes(d.id)) {
          return d3.color(colorScale(d.id)).darker(1.5);  // 원래 색상의 어두운 버전
        }
        return '#fff';
      })
      .attr('stroke-width', d => highlightedNodes.includes(d.id) ? 3 : 2)
      .attr('opacity', d => {
        // 필터링 중일 때: 선택된 노드는 1.0, 나머지는 0.25
        if (highlightedNodes.length > 0) {
          return highlightedNodes.includes(d.id) ? 1.0 : 0.25;
        }
        return 1.0;
      })
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        event.stopPropagation();
        onNodeClick(d.id);
      })
      .on('mouseover', function(event, d) {
        // 툴팁 표시 - 해당 커뮤니티의 concept pair 개수
        const pairCount = d.size || 0;
        tooltip.html(`<strong>Community:</strong> ${d.label}<br/><strong>Concept Pairs:</strong> ${pairCount}`)
          .style('visibility', 'visible')
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
        
        d3.select(this)
          .attr('stroke-width', 4)
          .attr('r', Math.min(8 + Math.sqrt(d.size) * 1.5, 30) * 1.2);
      })
      .on('mousemove', function(event) {
        tooltip
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mouseout', function(event, d) {
        // 툴팁 숨기기
        tooltip.style('visibility', 'hidden');
        
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
      .attr('opacity', d => {
        // 필터링 중일 때: 선택된 노드 레이블은 1.0, 나머지는 0.3
        if (highlightedNodes.length > 0) {
          return highlightedNodes.includes(d.id) ? 1.0 : 0.3;
        }
        return 1.0;
      })
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

    // Label background - 필터링 상태에 따라 투명도 조절
    text.each(function(d) {
      const bbox = this.getBBox();
      const isHighlighted = highlightedNodes.includes(d.id);
      const opacity = highlightedNodes.length > 0 && !isHighlighted ? 0.3 : 0.7;
      
      d3.select(this.parentNode).insert('rect', 'text')
        .attr('x', bbox.x - 4)
        .attr('y', bbox.y - 2)
        .attr('width', bbox.width + 8)
        .attr('height', bbox.height + 4)
        .attr('fill', 'white')
        .attr('fill-opacity', opacity)
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

    // Cleanup function - 컴포넌트 언마운트 시 tooltip 제거
    return () => {
      simulation.stop();
      tooltip.remove();
    };

  }, [data, highlightedNodes, onNodeClick, onLinkClick]);

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
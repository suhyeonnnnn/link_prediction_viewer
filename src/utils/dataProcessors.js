export const getTopPredictedPairs = (data, topN = 10) => {
  const sorted = [...data].sort((a, b) => b.pred - a.pred);
  const topPairs = sorted.slice(0, topN);
  
  return topPairs.map((row, index) => ({
    rank: index + 1,
    concept1: row.concept1,
    concept2: row.concept2,
    prediction_score: parseFloat(row.pred.toFixed(3)),
    concept1_freq: row.concept1_freq,
    concept2_freq: row.concept2_freq,
    concept1_field: row.concept1_top1_field,
    concept1_field_ratio: parseFloat((row.concept1_top1_ratio * 100).toFixed(1)),
    concept2_field: row.concept2_top1_field,
    concept2_field_ratio: parseFloat((row.concept2_top1_ratio * 100).toFixed(1)),
    community1: row.c1_community,
    community2: row.c2_community,
    display_text: `${row.concept1} <-> ${row.concept2}`,
    freq_text: `${row.concept1_freq} <-> ${row.concept2_freq}`,
    field_text: `${row.concept1_top1_field}(${(row.concept1_top1_ratio * 100).toFixed(1)}%) <-> ${row.concept2_top1_field}(${(row.concept2_top1_ratio * 100).toFixed(1)}%)`,
    community_text: `${row.c1_community} <-> ${row.c2_community}`
  }));
};

export const getCommunityPairRanking = (data, topN = 10) => {
  const communityStats = {};
  
  data.forEach(row => {
    const c1 = row.c1_community;
    const c2 = row.c2_community;
    
    if (c1 !== c2) {
      const pairKey = [c1, c2].sort().join('|||');
      
      if (!communityStats[pairKey]) {
        communityStats[pairKey] = {
          community1: c1 < c2 ? c1 : c2,
          community2: c1 < c2 ? c2 : c1,
          pairs: [],
          total_strength: 0
        };
      }
      
      communityStats[pairKey].pairs.push({
        concept1: row.concept1,
        concept2: row.concept2,
        pred_score: row.pred
      });
      communityStats[pairKey].total_strength += row.pred;
    }
  });
  
  const ranking = Object.values(communityStats)
    .filter(stats => stats.pairs.length > 0)
    .map(stats => ({
      community1: stats.community1,
      community2: stats.community2,
      connection_strength: parseFloat((stats.total_strength / stats.pairs.length).toFixed(3)),
      pair_count: stats.pairs.length,
      display_text: `${stats.community1} <-> ${stats.community2}`,
      top_pair: stats.pairs.reduce((max, pair) => 
        pair.pred_score > max.pred_score ? pair : max, stats.pairs[0]
      )
    }))
    .sort((a, b) => b.connection_strength - a.connection_strength)
    .slice(0, topN)
    .map((item, index) => ({ ...item, rank: index + 1 }));
  
  return ranking;
};

export const filterByCommunityPairClick = (data, community1, community2, topN = 20) => {
  const filtered = data.filter(row =>
    (row.c1_community === community1 && row.c2_community === community2) ||
    (row.c1_community === community2 && row.c2_community === community1)
  );
  
  if (filtered.length === 0) return [];
  
  const sorted = [...filtered].sort((a, b) => b.pred - a.pred);
  const topFiltered = sorted.slice(0, topN);
  
  return topFiltered.map((row, index) => ({
    rank: index + 1,
    concept1: row.concept1,
    concept2: row.concept2,
    prediction_score: parseFloat(row.pred.toFixed(3)),
    concept1_freq: row.concept1_freq,
    concept2_freq: row.concept2_freq,
    concept1_field: row.concept1_top1_field,
    concept1_field_ratio: parseFloat((row.concept1_top1_ratio * 100).toFixed(1)),
    concept2_field: row.concept2_top1_field,
    concept2_field_ratio: parseFloat((row.concept2_top1_ratio * 100).toFixed(1)),
    community1: row.c1_community,
    community2: row.c2_community,
    display_text: `${row.concept1} <-> ${row.concept2}`,
    freq_text: `${row.concept1_freq} <-> ${row.concept2_freq}`,
    field_text: `${row.concept1_top1_field}(${(row.concept1_top1_ratio * 100).toFixed(1)}%) <-> ${row.concept2_top1_field}(${(row.concept2_top1_ratio * 100).toFixed(1)}%)`,
    community_text: `${row.c1_community} <-> ${row.c2_community}`
  }));
};

export const getConceptPairChildren = (concept1, concept2, childRelations) => {
  const children1 = childRelations[concept1] || [];
  const children2 = childRelations[concept2] || [];
  
  return {
    concept1: {
      name: concept1,
      children: children1,
      children_count: children1.length
    },
    concept2: {
      name: concept2,
      children: children2,
      children_count: children2.length
    },
    common_children: children1.filter(child => children2.includes(child))
  };
};

export const getConceptCommunitiesNetwork = (data) => {
  const communities = new Set();
  const linkMap = {};
  
  data.forEach(row => {
    communities.add(row.c1_community);
    communities.add(row.c2_community);
    
    if (row.c1_community !== row.c2_community) {
      const key = [row.c1_community, row.c2_community].sort().join('|||');
      linkMap[key] = (linkMap[key] || 0) + row.pred;
    }
  });
  
  const nodes = Array.from(communities).map(comm => {
    const occurrences = data.filter(row => 
      row.c1_community === comm || row.c2_community === comm
    ).length;
    
    return {
      id: comm,
      label: comm,
      size: occurrences
    };
  });
  
  const links = Object.entries(linkMap).map(([key, weight]) => {
    const [source, target] = key.split('|||');
    return {
      source,
      target,
      weight: parseFloat(weight.toFixed(3))
    };
  });
  
  return { nodes, links };
};

export const filterByCommunity = (data, communityId, topN = 20) => {
  const filtered = data.filter(row =>
    row.c1_community === communityId || row.c2_community === communityId
  );
  
  const sorted = [...filtered].sort((a, b) => b.pred - a.pred);
  const topFiltered = sorted.slice(0, topN);
  
  return topFiltered.map((row, index) => ({
    rank: index + 1,
    concept1: row.concept1,
    concept2: row.concept2,
    prediction_score: parseFloat(row.pred.toFixed(3)),
    concept1_freq: row.concept1_freq,
    concept2_freq: row.concept2_freq,
    concept1_field: row.concept1_top1_field,
    concept1_field_ratio: parseFloat((row.concept1_top1_ratio * 100).toFixed(1)),
    concept2_field: row.concept2_top1_field,
    concept2_field_ratio: parseFloat((row.concept2_top1_ratio * 100).toFixed(1)),
    community1: row.c1_community,
    community2: row.c2_community,
    display_text: `${row.concept1} <-> ${row.concept2}`,
    freq_text: `${row.concept1_freq} <-> ${row.concept2_freq}`,
    field_text: `${row.concept1_top1_field}(${(row.concept1_top1_ratio * 100).toFixed(1)}%) <-> ${row.concept2_top1_field}(${(row.concept2_top1_ratio * 100).toFixed(1)}%)`,
    community_text: `${row.c1_community} <-> ${row.c2_community}`
  }));
};

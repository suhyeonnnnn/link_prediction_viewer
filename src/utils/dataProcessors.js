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
    concept1_field_ratio: parseFloat(row.concept1_top1_ratio.toFixed(1)),
    concept2_field: row.concept2_top1_field,
    concept2_field_ratio: parseFloat(row.concept2_top1_ratio.toFixed(1)),
    community1: row.c1_community,
    community2: row.c2_community,
    display_text: `${row.concept1} <-> ${row.concept2}`,
    freq_text: `${row.concept1_freq} <-> ${row.concept2_freq}`,
    field_text: `${row.concept1_top1_field}(${row.concept1_top1_ratio.toFixed(1)}) <-> ${row.concept2_top1_field}(${row.concept2_top1_ratio.toFixed(1)})`,
    community_text: `${row.c1_community} <-> ${row.c2_community}`
  }));
};

export const getCommunityPairRanking = (data, topN = 10, weightMode = 'count') => {
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
      total_pred_sum: parseFloat(stats.total_strength.toFixed(3)),
      display_text: `${stats.community1} <-> ${stats.community2}`,
      top_pair: stats.pairs.reduce((max, pair) => 
        pair.pred_score > max.pred_score ? pair : max, stats.pairs[0]
      )
    }))
    .sort((a, b) => {
      // weightMode에 따라 정렬 기준 변경
      if (weightMode === 'weighted') {
        return b.total_pred_sum - a.total_pred_sum;
      }
      return b.pair_count - a.pair_count;
    })
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
    concept1_field_ratio: parseFloat(row.concept1_top1_ratio.toFixed(1)),
    concept2_field: row.concept2_top1_field,
    concept2_field_ratio: parseFloat(row.concept2_top1_ratio.toFixed(1)),
    community1: row.c1_community,
    community2: row.c2_community,
    display_text: `${row.concept1} <-> ${row.concept2}`,
    freq_text: `${row.concept1_freq} <-> ${row.concept2_freq}`,
    field_text: `${row.concept1_top1_field}(${row.concept1_top1_ratio.toFixed(1)}) <-> ${row.concept2_top1_field}(${row.concept2_top1_ratio.toFixed(1)})`,
    community_text: `${row.c1_community} <-> ${row.c2_community}`
  }));
};

export const getConceptPairChildren = (concept1, concept2, childRelations, data = null) => {
  const children1 = childRelations[concept1] || [];
  const children2 = childRelations[concept2] || [];
  
  const result = {
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
  
  if (data) {
    [
      { key: 'concept1', name: concept1 },
      { key: 'concept2', name: concept2 }
    ].forEach(({ key, name }) => {
      const conceptRows = data.filter(row => row.concept1 === name || row.concept2 === name);
      if (conceptRows.length > 0) {
        const row = conceptRows[0];
        if (row.concept1 === name) {
          result[key] = {
            ...result[key],
            frequency: row.concept1_freq,
            top_field: row.concept1_top1_field,
            field_ratio: row.concept1_top1_ratio,
            community: row.c1_community
          };
        } else {
          result[key] = {
            ...result[key],
            frequency: row.concept2_freq,
            top_field: row.concept2_top1_field,
            field_ratio: row.concept2_top1_ratio,
            community: row.c2_community
          };
        }
      }
    });
  }
  
  return result;
};

export const getConceptCommunitiesNetwork = (data, weightMode = 'count') => {
  const communities = new Set();
  const linkMap = {};
  
  data.forEach(row => {
    communities.add(row.c1_community);
    communities.add(row.c2_community);
    
    if (row.c1_community !== row.c2_community) {
      const key = [row.c1_community, row.c2_community].sort().join('|||');
      
      if (!linkMap[key]) {
        linkMap[key] = {
          count: 0,
          predSum: 0
        };
      }
      
      linkMap[key].count += 1;
      linkMap[key].predSum += row.pred;
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
  
  const links = Object.entries(linkMap).map(([key, value]) => {
    const [source, target] = key.split('|||');
    
    // weightMode에 따라 weight 결정
    const weight = weightMode === 'weighted' 
      ? parseFloat(value.predSum.toFixed(3))
      : value.count;
    
    return {
      source,
      target,
      weight,
      count: value.count,
      predSum: parseFloat(value.predSum.toFixed(3))
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
    concept1_field_ratio: parseFloat(row.concept1_top1_ratio.toFixed(1)),
    concept2_field: row.concept2_top1_field,
    concept2_field_ratio: parseFloat(row.concept2_top1_ratio.toFixed(1)),
    community1: row.c1_community,
    community2: row.c2_community,
    display_text: `${row.concept1} <-> ${row.concept2}`,
    freq_text: `${row.concept1_freq} <-> ${row.concept2_freq}`,
    field_text: `${row.concept1_top1_field}(${row.concept1_top1_ratio.toFixed(1)}) <-> ${row.concept2_top1_field}(${row.concept2_top1_ratio.toFixed(1)})`,
    community_text: `${row.c1_community} <-> ${row.c2_community}`
  }));
};

// ===== NEW FUNCTIONS FOR EFFICIENT FILTERING =====

// Filter already formatted data by community pair
export const filterFormattedByCommunityPair = (formattedData, community1, community2) => {
  const filtered = formattedData.filter(pair =>
    (pair.community1 === community1 && pair.community2 === community2) ||
    (pair.community1 === community2 && pair.community2 === community1)
  );
  
  return filtered.map((pair, index) => ({ ...pair, rank: index + 1 }));
};

// Filter already formatted data by single community
export const filterFormattedByCommunity = (formattedData, communityId) => {
  const filtered = formattedData.filter(pair =>
    pair.community1 === communityId || pair.community2 === communityId
  );
  
  return filtered.map((pair, index) => ({ ...pair, rank: index + 1 }));
};

// Calculate comprehensive community pair rankings with both predicted and previous data
export const getCommunityPairRankingWithComparison = (predictedData, previousData, weightMode = 'count') => {
  const predictedStats = {};
  const previousStats = {};
  
  // Calculate predicted stats
  predictedData.forEach(row => {
    const c1 = row.c1_community;
    const c2 = row.c2_community;
    
    if (c1 !== c2) {
      const pairKey = [c1, c2].sort().join('|||');
      
      if (!predictedStats[pairKey]) {
        predictedStats[pairKey] = {
          community1: c1 < c2 ? c1 : c2,
          community2: c1 < c2 ? c2 : c1,
          count: 0,
          total_strength: 0
        };
      }
      
      predictedStats[pairKey].count += 1;
      predictedStats[pairKey].total_strength += row.pred;
    }
  });
  
  // Calculate previous stats
  previousData.forEach(row => {
    const c1 = row.c1_community;
    const c2 = row.c2_community;
    
    if (c1 !== c2) {
      const pairKey = [c1, c2].sort().join('|||');
      
      if (!previousStats[pairKey]) {
        previousStats[pairKey] = {
          community1: c1 < c2 ? c1 : c2,
          community2: c1 < c2 ? c2 : c1,
          count: 0
        };
      }
      
      previousStats[pairKey].count += 1;
    }
  });
  
  const totalPredicted = predictedData.length;
  const totalPrevious = previousData.length;
  
  // Combine stats
  const allPairKeys = new Set([...Object.keys(predictedStats), ...Object.keys(previousStats)]);
  
  const ranking = Array.from(allPairKeys).map(pairKey => {
    const predicted = predictedStats[pairKey] || { count: 0, total_strength: 0 };
    const previous = previousStats[pairKey] || { count: 0 };
    
    const [comm1, comm2] = pairKey.split('|||');
    
    const predictedConcentration = (predicted.count / totalPredicted) * 100;
    const previousConcentration = (previous.count / totalPrevious) * 100;
    const rise = predictedConcentration - previousConcentration;
    
    return {
      community1: comm1,
      community2: comm2,
      predicted_count: predicted.count,
      previous_count: previous.count,
      predicted_concentration: parseFloat(predictedConcentration.toFixed(2)),
      previous_concentration: parseFloat(previousConcentration.toFixed(2)),
      rise: parseFloat(rise.toFixed(2)),
      total_strength: parseFloat(predicted.total_strength.toFixed(3)),
      avg_strength: predicted.count > 0 ? parseFloat((predicted.total_strength / predicted.count).toFixed(3)) : 0
    };
  });
  
  return ranking;
};
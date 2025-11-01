import React, { useState, useEffect, useMemo } from 'react';
import { loadAllData } from './utils/dataLoader';
import {
  getTopPredictedPairs,
  getCommunityPairRanking,
  filterByCommunityPairClick,
  filterByCommunity,
  getConceptCommunitiesNetwork
} from './utils/dataProcessors';
import NetworkGraph from './components/NetworkGraph';
import ConceptPairsList from './components/ConceptPairsList';
import CommunityRanking from './components/CommunityRanking';

const App = () => {
  const [rawData, setRawData] = useState([]);
  const [childRelations, setChildRelations] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayedPairs, setDisplayedPairs] = useState([]);
  const [expandedPairs, setExpandedPairs] = useState(new Set());
  const [selectedCommunities, setSelectedCommunities] = useState([]);
  const [highlightedNodes, setHighlightedNodes] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const { csvData, childRelations: relations } = await loadAllData();
        
        setRawData(csvData);
        setChildRelations(relations);
        // 전체 데이터 표시 (개수 제한 없음)
        const allPairs = getTopPredictedPairs(csvData, csvData.length);
        setDisplayedPairs(allPairs);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const networkData = useMemo(() => {
    if (!rawData.length) return { nodes: [], links: [] };
    return getConceptCommunitiesNetwork(rawData);
  }, [rawData]);

  const communityRanking = useMemo(() => {
    if (!rawData.length) return [];
    return getCommunityPairRanking(rawData, Infinity);
  }, [rawData]);

  const handleToggleExpand = (pair) => {
    const newExpanded = new Set(expandedPairs);
    if (newExpanded.has(pair.rank)) {
      newExpanded.delete(pair.rank);
    } else {
      newExpanded.add(pair.rank);
    }
    setExpandedPairs(newExpanded);
  };

  const handleCommunityPairClick = (community1, community2) => {
    // 필터링된 전체 데이터 표시 (개수 제한 없음)
    const filtered = filterByCommunityPairClick(rawData, community1, community2, Infinity);
    setDisplayedPairs(filtered);
    setSelectedCommunities([community1, community2]);
    setHighlightedNodes([community1, community2]);
  };

  const handleNodeClick = (communityId) => {
    // 필터링된 전체 데이터 표시 (개수 제한 없음)
    const filtered = filterByCommunity(rawData, communityId, Infinity);
    setDisplayedPairs(filtered);
    setSelectedCommunities([communityId]);
    setHighlightedNodes([communityId]);
  };

  const handleReset = () => {
    // 전체 데이터로 복원 (개수 제한 없음)
    const allPairs = getTopPredictedPairs(rawData, rawData.length);
    setDisplayedPairs(allPairs);
    setSelectedCommunities([]);
    setHighlightedNodes([]);
    setExpandedPairs(new Set());
  };

  if (isLoading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f5f5',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '5px solid #e0e0e0',
            borderTop: '5px solid #27ae60',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <div style={{ fontSize: '18px', color: '#555' }}>Loading data...</div>
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f5f5',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          maxWidth: '500px'
        }}>
          <h2 style={{ color: '#e74c3c', marginTop: 0 }}>Error Loading Data</h2>
          <p style={{ color: '#555' }}>{error}</p>
          <p style={{ fontSize: '14px', color: '#7f8c8d' }}>
            Make sure the following files are in the <code>public/</code> folder:
          </p>
          <ul style={{ fontSize: '14px', color: '#7f8c8d' }}>
            <li>top_predicted_pairs.csv</li>
            <li>child_relationships.json</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#f5f5f5'
    }}>
      <div style={{
        background: '#2c3e50',
        color: 'white',
        padding: '15px 20px',
        fontSize: '24px',
        fontWeight: 'bold',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span>Concept Network Dashboard</span>
        <div style={{ fontSize: '14px', fontWeight: 'normal', opacity: 0.8 }}>
          Total Pairs: {rawData.length} | Communities: {networkData.nodes.length}
        </div>
      </div>

      <div style={{
        flex: 1,
        display: 'flex',
        gap: '15px',
        padding: '15px',
        overflow: 'hidden'
      }}>
        <div style={{ width: '40%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '15px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h2 style={{ margin: 0, fontSize: '18px', color: '#2c3e50' }}>
              Top Predicted Concept Pairs
            </h2>
            <span style={{ color: '#7f8c8d', fontSize: '14px' }}>
              Showing {displayedPairs.length} pairs
            </span>
          </div>

          <ConceptPairsList
            pairs={displayedPairs}
            expandedPairs={expandedPairs}
            onToggleExpand={handleToggleExpand}
            childRelations={childRelations}
          />
        </div>

        <div style={{ width: '60%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{
            flex: 2,
            background: 'white',
            borderRadius: '8px',
            padding: '15px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h2 style={{ margin: '0 0 15px 0', fontSize: '18px', color: '#2c3e50' }}>
              Concept Communities
            </h2>
            <NetworkGraph
              data={networkData}
              highlightedNodes={highlightedNodes}
              onNodeClick={handleNodeClick}
            />
          </div>

          <CommunityRanking
            ranking={communityRanking}
            selectedCommunities={selectedCommunities}
            onItemClick={handleCommunityPairClick}
            onReset={handleReset}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
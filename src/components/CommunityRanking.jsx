import React from 'react';

const CommunityRanking = ({ ranking, selectedCommunities, onItemClick, onReset, rankingMode, onRankingModeChange, onMatrixCategoryClick }) => {
  const [showMatrix, setShowMatrix] = React.useState(false);
  
  // Calculate median for matrix categorization
  const getMatrixCategories = () => {
    const pairsWithBothData = ranking.filter(item => item.previous_count > 0 && item.predicted_count > 0);
    
    if (pairsWithBothData.length === 0) return null;
    
    const predictedConcentrations = pairsWithBothData.map(item => item.predicted_concentration).sort((a, b) => a - b);
    const previousConcentrations = pairsWithBothData.map(item => item.previous_concentration).sort((a, b) => a - b);
    
    const predictedMedian = predictedConcentrations[Math.floor(predictedConcentrations.length / 2)];
    const previousMedian = previousConcentrations[Math.floor(previousConcentrations.length / 2)];
    
    const categories = {
      'High-High': [],
      'Low-High': [],
      'High-Low': [],
      'Low-Low': []
    };
    
    pairsWithBothData.forEach(item => {
      const highPredicted = item.predicted_concentration > predictedMedian;
      const highPrevious = item.previous_concentration > previousMedian;
      
      if (highPredicted && highPrevious) {
        categories['High-High'].push(item);
      } else if (!highPredicted && highPrevious) {
        categories['Low-High'].push(item);
      } else if (highPredicted && !highPrevious) {
        categories['High-Low'].push(item);
      } else {
        categories['Low-Low'].push(item);
      }
    });
    
    // Sort each category
    // High-High: by predicted concentration (descending) - most core first
    categories['High-High'].sort((a, b) => b.predicted_concentration - a.predicted_concentration);
    
    // High-Low (Emerging): by rise (descending) - fastest growing first
    categories['High-Low'].sort((a, b) => b.rise - a.rise);
    
    // Low-High (Declining): by rise (ascending) - fastest declining first
    categories['Low-High'].sort((a, b) => a.rise - b.rise);
    
    // Low-Low: by predicted concentration (descending) - relatively less peripheral first
    categories['Low-Low'].sort((a, b) => b.predicted_concentration - a.predicted_concentration);
    
    return { categories, predictedMedian, previousMedian };
  };
  
  const matrixData = getMatrixCategories();
  
  return (
    <>
      {/* 헤더 - 고정 */}
      <div style={{
        background: 'white',
        borderRadius: '8px',
        padding: '15px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <h2 style={{ margin: 0, fontSize: '18px', color: '#2c3e50' }}>
          Community Pair Ranking
        </h2>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* Matrix Analysis Button */}
          {matrixData && (
            <button
              onClick={() => setShowMatrix(!showMatrix)}
              style={{
                padding: '6px 14px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '12px',
                background: showMatrix ? '#9b59b6' : '#ecf0f1',
                color: showMatrix ? 'white' : '#7f8c8d',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!showMatrix) e.target.style.background = '#bdc3c7';
              }}
              onMouseLeave={(e) => {
                if (!showMatrix) e.target.style.background = '#ecf0f1';
              }}
            >
              {showMatrix ? 'Hide Matrix' : 'Matrix Analysis'}
            </button>
          )}
          {/* Ranking Mode Toggle */}
          <div style={{
            display: 'flex',
            gap: '0',
            border: '2px solid #bdc3c7',
            borderRadius: '6px',
            overflow: 'hidden',
            background: 'white'
          }}>
            <button
              onClick={() => onRankingModeChange('predicted')}
              style={{
                padding: '6px 12px',
                border: 'none',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                background: rankingMode === 'predicted' ? '#3498db' : 'white',
                color: rankingMode === 'predicted' ? 'white' : '#7f8c8d',
                transition: 'all 0.2s ease',
                borderRight: '1px solid #bdc3c7'
              }}
              onMouseEnter={(e) => {
                if (rankingMode !== 'predicted') e.target.style.background = '#ecf0f1';
              }}
              onMouseLeave={(e) => {
                if (rankingMode !== 'predicted') e.target.style.background = 'white';
              }}
            >
              Predicted Strength
            </button>
            <button
              onClick={() => onRankingModeChange('previous')}
              style={{
                padding: '6px 12px',
                border: 'none',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                background: rankingMode === 'previous' ? '#27ae60' : 'white',
                color: rankingMode === 'previous' ? 'white' : '#7f8c8d',
                transition: 'all 0.2s ease',
                borderRight: '1px solid #bdc3c7'
              }}
              onMouseEnter={(e) => {
                if (rankingMode !== 'previous') e.target.style.background = '#ecf0f1';
              }}
              onMouseLeave={(e) => {
                if (rankingMode !== 'previous') e.target.style.background = 'white';
              }}
            >
              Previous Strength
            </button>
            <button
              onClick={() => onRankingModeChange('rising')}
              style={{
                padding: '6px 12px',
                border: 'none',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                background: rankingMode === 'rising' ? '#e67e22' : 'white',
                color: rankingMode === 'rising' ? 'white' : '#7f8c8d',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (rankingMode !== 'rising') e.target.style.background = '#ecf0f1';
              }}
              onMouseLeave={(e) => {
                if (rankingMode !== 'rising') e.target.style.background = 'white';
              }}
            >
              Rising Connections
            </button>
          </div>
        </div>
      </div>

      {/* Matrix View */}
      {showMatrix && matrixData && (
        <div style={{
          background: 'white',
          borderRadius: '8px',
          padding: '15px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginTop: '10px',
          maxHeight: '400px',
          overflowY: 'auto'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
            marginBottom: '10px'
          }}>
            {/* High-High (Top Left) */}
            <div style={{
              border: '2px solid #27ae60',
              borderRadius: '6px',
              padding: '12px',
              background: '#e8f8f5'
            }}>
              <div 
                onClick={() => onMatrixCategoryClick(matrixData.categories['High-High'], 'High-High')}
                style={{
                  fontWeight: '700',
                  fontSize: '13px',
                  color: '#27ae60',
                  marginBottom: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '4px',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(39, 174, 96, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <span>Core & Persistent</span>
                <span style={{ fontSize: '11px', background: '#27ae60', color: 'white', padding: '2px 6px', borderRadius: '3px' }}>
                  {matrixData.categories['High-High'].length}
                </span>
              </div>
              <div style={{ fontSize: '10px', color: '#7f8c8d', marginBottom: '8px' }}>
                High Predicted & High Previous
              </div>
              <div style={{ maxHeight: '120px', overflowY: 'auto' }}>
                {matrixData.categories['High-High'].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => onItemClick(item.community1, item.community2)}
                    style={{
                      fontSize: '11px',
                      padding: '4px 6px',
                      marginBottom: '3px',
                      background: 'white',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      border: '1px solid #d5f4e6'
                    }}
                  >
                    {item.community1} ↔ {item.community2}
                    <div style={{ fontSize: '9px', color: '#95a5a6' }}>
                      P:{item.predicted_concentration}% / Pr:{item.previous_concentration}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* High-Low (Top Right) */}
            <div style={{
              border: '2px solid #3498db',
              borderRadius: '6px',
              padding: '12px',
              background: '#ebf5fb'
            }}>
              <div 
                onClick={() => onMatrixCategoryClick(matrixData.categories['High-Low'], 'High-Low')}
                style={{
                  fontWeight: '700',
                  fontSize: '13px',
                  color: '#3498db',
                  marginBottom: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '4px',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(52, 152, 219, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <span>Emerging/Rising</span>
                <span style={{ fontSize: '11px', background: '#3498db', color: 'white', padding: '2px 6px', borderRadius: '3px' }}>
                  {matrixData.categories['High-Low'].length}
                </span>
              </div>
              <div style={{ fontSize: '10px', color: '#7f8c8d', marginBottom: '8px' }}>
                High Predicted & Low Previous
              </div>
              <div style={{ maxHeight: '120px', overflowY: 'auto' }}>
                {matrixData.categories['High-Low'].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => onItemClick(item.community1, item.community2)}
                    style={{
                      fontSize: '11px',
                      padding: '4px 6px',
                      marginBottom: '3px',
                      background: 'white',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      border: '1px solid #d6eaf8'
                    }}
                  >
                    {item.community1} ↔ {item.community2}
                    <div style={{ fontSize: '9px', color: '#95a5a6' }}>
                      P:{item.predicted_concentration}% / Pr:{item.previous_concentration}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Low-High (Bottom Left) */}
            <div style={{
              border: '2px solid #e67e22',
              borderRadius: '6px',
              padding: '12px',
              background: '#fef5e7'
            }}>
              <div 
                onClick={() => onMatrixCategoryClick(matrixData.categories['Low-High'], 'Low-High')}
                style={{
                  fontWeight: '700',
                  fontSize: '13px',
                  color: '#e67e22',
                  marginBottom: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '4px',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(230, 126, 34, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <span>Declining</span>
                <span style={{ fontSize: '11px', background: '#e67e22', color: 'white', padding: '2px 6px', borderRadius: '3px' }}>
                  {matrixData.categories['Low-High'].length}
                </span>
              </div>
              <div style={{ fontSize: '10px', color: '#7f8c8d', marginBottom: '8px' }}>
                Low Predicted & High Previous
              </div>
              <div style={{ maxHeight: '120px', overflowY: 'auto' }}>
                {matrixData.categories['Low-High'].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => onItemClick(item.community1, item.community2)}
                    style={{
                      fontSize: '11px',
                      padding: '4px 6px',
                      marginBottom: '3px',
                      background: 'white',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      border: '1px solid #fdebd0'
                    }}
                  >
                    {item.community1} ↔ {item.community2}
                    <div style={{ fontSize: '9px', color: '#95a5a6' }}>
                      P:{item.predicted_concentration}% / Pr:{item.previous_concentration}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Low-Low (Bottom Right) */}
            <div style={{
              border: '2px solid #95a5a6',
              borderRadius: '6px',
              padding: '12px',
              background: '#f8f9fa'
            }}>
              <div 
                onClick={() => onMatrixCategoryClick(matrixData.categories['Low-Low'], 'Low-Low')}
                style={{
                  fontWeight: '700',
                  fontSize: '13px',
                  color: '#95a5a6',
                  marginBottom: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '4px',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(149, 165, 166, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <span>Peripheral</span>
                <span style={{ fontSize: '11px', background: '#95a5a6', color: 'white', padding: '2px 6px', borderRadius: '3px' }}>
                  {matrixData.categories['Low-Low'].length}
                </span>
              </div>
              <div style={{ fontSize: '10px', color: '#7f8c8d', marginBottom: '8px' }}>
                Low Predicted & Low Previous
              </div>
              <div style={{ maxHeight: '120px', overflowY: 'auto' }}>
                {matrixData.categories['Low-Low'].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => onItemClick(item.community1, item.community2)}
                    style={{
                      fontSize: '11px',
                      padding: '4px 6px',
                      marginBottom: '3px',
                      background: 'white',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      border: '1px solid #ecf0f1'
                    }}
                  >
                    {item.community1} ↔ {item.community2}
                    <div style={{ fontSize: '9px', color: '#95a5a6' }}>
                      P:{item.predicted_concentration}% / Pr:{item.previous_concentration}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div style={{
            fontSize: '10px',
            color: '#7f8c8d',
            textAlign: 'center',
            paddingTop: '8px',
            borderTop: '1px solid #e0e0e0'
          }}>
            Median Split - Predicted: {matrixData.predictedMedian.toFixed(2)}% | Previous: {matrixData.previousMedian.toFixed(2)}%
          </div>
        </div>
      )}

      {/* 리스트 - 스크롤 가능 */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        background: 'white',
        borderRadius: '8px',
        padding: '10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginTop: '10px'
      }}>
        {ranking.map(item => {
          const isSelected = selectedCommunities.includes(item.community1) && 
                           selectedCommunities.includes(item.community2);
          
          return (
            <div
              key={item.rank}
              onClick={() => onItemClick(item.community1, item.community2)}
              style={{
                padding: '10px',
                borderBottom: '1px solid #e0e0e0',
                cursor: 'pointer',
                background: isSelected ? '#e8f5e9' : 'white',
                transition: 'background 0.2s',
                borderRadius: '4px',
                marginBottom: '2px'
              }}
              onMouseEnter={(e) => {
                if (!isSelected) e.currentTarget.style.background = '#f8f9fa';
              }}
              onMouseLeave={(e) => {
                if (!isSelected) e.currentTarget.style.background = 'white';
              }}
            >
              <div style={{ fontWeight: '600', color: '#2c3e50', fontSize: '14px' }}>
                {item.rank}. {item.community1} ↔ {item.community2}
              </div>
              
              {rankingMode === 'predicted' ? (
                <div style={{ fontSize: '12px', color: '#7f8c8d', marginTop: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                    <span style={{ fontWeight: '600' }}>Rank: #{item.rank}</span>
                    {item.previousRank && (
                      <>
                        {item.rankChange !== null && item.rankChange !== 0 && (
                          <span style={{
                            fontSize: '11px',
                            fontWeight: '700',
                            color: item.rankChange > 0 ? '#27ae60' : '#e74c3c'
                          }}>
                            ({item.rankChange > 0 ? '↑' : '↓'}{Math.abs(item.rankChange)})
                          </span>
                        )}
                        <span>| Previous: #{item.previousRank}</span>
                      </>
                    )}
                    {!item.previousRank && item.previous_count === 0 && (
                      <span style={{ fontSize: '11px', color: '#95a5a6' }}>(New)</span>
                    )}
                  </div>
                  <div>
                    <span style={{ fontWeight: '600' }}>Pred:</span> {item.predicted_count} pairs ({item.predicted_concentration}%)
                    {item.previous_count > 0 && (
                      <span style={{ marginLeft: '8px' }}>
                        | <span style={{ fontWeight: '600' }}>Prev:</span> {item.previous_count} pairs ({item.previous_concentration}%)
                      </span>
                    )}
                  </div>
                </div>
              ) : rankingMode === 'previous' ? (
                <div style={{ fontSize: '12px', color: '#7f8c8d', marginTop: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                    <span style={{ fontWeight: '600' }}>Previous Rank: #{item.rank}</span>
                  </div>
                  <div>
                    <span style={{ fontWeight: '600' }}>Prev:</span> {item.previous_count} pairs ({item.previous_concentration}%)
                    <span style={{ marginLeft: '8px' }}>
                      | <span style={{ fontWeight: '600' }}>Pred:</span> {item.predicted_count} pairs ({item.predicted_concentration}%)
                    </span>
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: '12px', marginTop: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#7f8c8d' }}>
                      Rise: <span style={{ 
                        fontWeight: '700',
                        color: item.rise > 0 ? '#27ae60' : (item.rise < 0 ? '#e74c3c' : '#7f8c8d')
                      }}>
                        {item.rise > 0 ? '+' : ''}{item.rise}%
                      </span>
                    </span>
                  </div>
                  <div style={{ color: '#95a5a6', fontSize: '11px', marginTop: '2px' }}>
                    Pred: {item.predicted_concentration}% ({item.predicted_count}) | Prev: {item.previous_concentration}% ({item.previous_count})
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default CommunityRanking;

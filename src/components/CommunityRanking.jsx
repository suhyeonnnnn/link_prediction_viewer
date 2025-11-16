import React from 'react';

const CommunityRanking = ({ ranking, selectedCommunities, onItemClick, onReset, rankingMode, onRankingModeChange }) => {
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
                  <span style={{ fontWeight: '600' }}>Predicted:</span> {item.predicted_count} pairs ({item.predicted_concentration}%)
                  {item.previous_count > 0 && (
                    <span style={{ marginLeft: '8px' }}>
                      | <span style={{ fontWeight: '600' }}>Previous:</span> {item.previous_count} pairs ({item.previous_concentration}%)
                    </span>
                  )}
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

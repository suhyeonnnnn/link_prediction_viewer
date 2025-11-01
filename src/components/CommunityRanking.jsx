import React from 'react';

const CommunityRanking = ({ ranking, selectedCommunities, onItemClick, onReset }) => {
  return (
    <div style={{
      flex: 1,
      background: 'white',
      borderRadius: '8px',
      padding: '15px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px'
      }}>
        <h2 style={{ margin: 0, fontSize: '18px', color: '#2c3e50' }}>
          Community Pair Ranking
        </h2>
        <button
          onClick={onReset}
          style={{
            background: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            padding: '8px 16px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '13px',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#c0392b'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#e74c3c'}
        >
          Reset
        </button>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto' }}>
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
              <div style={{ fontSize: '12px', color: '#7f8c8d', marginTop: '4px' }}>
                Avg Score: {item.connection_strength} | Pairs: {item.pair_count}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CommunityRanking;

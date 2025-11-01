import React from 'react';

const ConceptPairsList = ({ pairs, expandedPairs, onToggleExpand, childRelations }) => {
  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      background: 'white',
      borderRadius: '8px',
      padding: '10px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      {pairs.map(pair => (
        <div key={`${pair.concept1}-${pair.concept2}-${pair.rank}`}>
          <div
            onClick={() => onToggleExpand(pair)}
            style={{
              border: expandedPairs.has(pair.rank) ? '2px solid #27ae60' : '1px solid #e0e0e0',
              borderRadius: '6px',
              padding: '12px',
              marginBottom: '10px',
              cursor: 'pointer',
              background: expandedPairs.has(pair.rank) ? '#e8f5e9' : 'white',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!expandedPairs.has(pair.rank)) {
                e.currentTarget.style.background = '#f8f9fa';
                e.currentTarget.style.borderColor = '#27ae60';
              }
            }}
            onMouseLeave={(e) => {
              if (!expandedPairs.has(pair.rank)) {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.borderColor = '#e0e0e0';
              }
            }}
          >
            <div style={{
              fontWeight: 'bold',
              color: '#2c3e50',
              marginBottom: '8px',
              fontSize: '15px'
            }}>
              {pair.rank}. {pair.concept1} ↔ {pair.concept2}
            </div>
            
            <div style={{ fontSize: '13px', color: '#555', marginBottom: '4px' }}>
              <span style={{ fontWeight: '600' }}>Prediction Score:</span> {pair.prediction_score} | 
              <span style={{ fontWeight: '600' }}> Freq:</span> {pair.freq_text}
            </div>
            
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
              <span style={{ fontWeight: '600' }}>Field:</span> {pair.field_text}
            </div>
            
            <div style={{ fontSize: '12px', color: '#27ae60', fontWeight: '600' }}>
              <span style={{ color: '#666' }}>Community:</span> {pair.community_text}
            </div>
          </div>

          {expandedPairs.has(pair.rank) && (
            <div style={{
              border: '2px solid #27ae60',
              borderRadius: '6px',
              padding: '15px',
              marginBottom: '10px',
              background: '#f0f9ff'
            }}>
              <div style={{
                fontWeight: 'bold',
                color: '#27ae60',
                marginBottom: '12px',
                fontSize: '14px'
              }}>
                (토글 부여서) Child Concepts
              </div>
              
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontWeight: '600',
                    color: '#2c3e50',
                    marginBottom: '8px',
                    fontSize: '13px',
                    borderBottom: '2px solid #27ae60',
                    paddingBottom: '5px'
                  }}>
                    {pair.concept1}
                  </div>
                  {childRelations[pair.concept1] && childRelations[pair.concept1].length > 0 ? (
                    childRelations[pair.concept1].map((child, idx) => (
                      <div key={idx} style={{
                        fontSize: '12px',
                        color: '#555',
                        marginBottom: '4px',
                        paddingLeft: '8px'
                      }}>
                        • {child}
                      </div>
                    ))
                  ) : (
                    <div style={{ fontSize: '12px', color: '#999', fontStyle: 'italic' }}>
                      No child concepts found
                    </div>
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{
                    fontWeight: '600',
                    color: '#2c3e50',
                    marginBottom: '8px',
                    fontSize: '13px',
                    borderBottom: '2px solid #27ae60',
                    paddingBottom: '5px'
                  }}>
                    {pair.concept2}
                  </div>
                  {childRelations[pair.concept2] && childRelations[pair.concept2].length > 0 ? (
                    childRelations[pair.concept2].map((child, idx) => (
                      <div key={idx} style={{
                        fontSize: '12px',
                        color: '#555',
                        marginBottom: '4px',
                        paddingLeft: '8px'
                      }}>
                        • {child}
                      </div>
                    ))
                  ) : (
                    <div style={{ fontSize: '12px', color: '#999', fontStyle: 'italic' }}>
                      No child concepts found
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ConceptPairsList;

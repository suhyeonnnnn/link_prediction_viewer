import React, { useState } from 'react';

const ConceptPairItem = ({ 
  pair, 
  isExpanded, 
  onToggleExpand, 
  childRelations,
  colorMap = {},
  isFiltered = false
}) => {
  const [showAllChildren1, setShowAllChildren1] = useState(false);
  const [showAllChildren2, setShowAllChildren2] = useState(false);
  
  const INITIAL_CHILD_COUNT = 20;
  
  // Get colors for communities - use black when not filtered
  const color1 = isFiltered ? (colorMap[pair.community1] || '#2c3e50') : '#2c3e50';
  const color2 = isFiltered ? (colorMap[pair.community2] || '#2c3e50') : '#2c3e50';
  
  return (
    <div 
      style={{
        border: isExpanded ? '2px solid #27ae60' : '1px solid #e0e0e0',
        borderRadius: '6px',
        padding: '12px',
        marginBottom: '10px',
        cursor: 'pointer',
        background: isExpanded ? '#e8f5e9' : 'white',
        transition: 'all 0.2s'
      }}
      onClick={() => onToggleExpand(pair)}
      onMouseEnter={(e) => {
        if (!isExpanded) {
          e.currentTarget.style.background = '#f8f9fa';
          e.currentTarget.style.borderColor = '#27ae60';
        }
      }}
      onMouseLeave={(e) => {
        if (!isExpanded) {
          e.currentTarget.style.background = 'white';
          e.currentTarget.style.borderColor = '#e0e0e0';
        }
      }}
    >
      {/* Header with arrow - colored concept names only when filtered */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '6px'
      }}>
        <div style={{
          fontWeight: 'bold',
          fontSize: '15px',
          flex: 1
        }}>
          <span style={{ color: '#7f8c8d' }}>{pair.rank}. </span>
          <span style={{ color: color1, fontWeight: 'bold' }}>{pair.concept1}</span>
          <span style={{ color: '#7f8c8d' }}> ↔ </span>
          <span style={{ color: color2, fontWeight: 'bold' }}>{pair.concept2}</span>
        </div>
        <div style={{
          fontSize: '18px',
          color: '#27ae60',
          transition: 'transform 0.2s',
          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
          marginLeft: '8px'
        }}>
          ▼
        </div>
      </div>
      
      {/* Prediction Score - 항상 표시 */}
      <div style={{ fontSize: '13px', color: '#555', fontWeight: '600' }}>
        Score: {pair.prediction_score}
      </div>

      {/* 확장된 상세 정보 */}
      {isExpanded && (
        <div style={{
          marginTop: '15px',
          paddingTop: '15px',
          borderTop: '2px solid #27ae60'
        }}>
          {/* Concept 메타데이터 - 2컬럼 */}
          <div style={{ 
            display: 'flex', 
            gap: '20px',
            marginBottom: '15px',
            paddingBottom: '15px',
            borderBottom: '1px solid #e0e0e0'
          }}>
            {/* Concept 1 */}
            <div style={{ flex: 1 }}>
              <div style={{
                fontWeight: '700',
                color: color1,
                marginBottom: '8px',
                fontSize: '13px'
              }}>
                {pair.concept1}
              </div>
              <div style={{ fontSize: '12px', color: '#555', marginBottom: '4px' }}>
                <span style={{ marginRight: '4px' }}>📈</span>
                Freq: {pair.concept1_freq}
              </div>
              <div style={{ fontSize: '12px', color: '#555', marginBottom: '4px' }}>
                <span style={{ marginRight: '4px' }}>🏷️</span>
                {pair.concept1_field} ({pair.concept1_field_ratio})
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: isFiltered ? color1 : '#27ae60', 
                fontWeight: '600',
                background: isFiltered ? `${color1}15` : '#e8f5e9',
                padding: '4px 8px',
                borderRadius: '4px',
                display: 'inline-block'
              }}>
                <span style={{ marginRight: '4px' }}>🔗</span>
                {pair.community1}
              </div>
            </div>

            {/* Concept 2 */}
            <div style={{ flex: 1 }}>
              <div style={{
                fontWeight: '700',
                color: color2,
                marginBottom: '8px',
                fontSize: '13px'
              }}>
                {pair.concept2}
              </div>
              <div style={{ fontSize: '12px', color: '#555', marginBottom: '4px' }}>
                <span style={{ marginRight: '4px' }}>📈</span>
                Freq: {pair.concept2_freq}
              </div>
              <div style={{ fontSize: '12px', color: '#555', marginBottom: '4px' }}>
                <span style={{ marginRight: '4px' }}>🏷️</span>
                {pair.concept2_field} ({pair.concept2_field_ratio})
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: isFiltered ? color2 : '#27ae60', 
                fontWeight: '600',
                background: isFiltered ? `${color2}15` : '#e8f5e9',
                padding: '4px 8px',
                borderRadius: '4px',
                display: 'inline-block'
              }}>
                <span style={{ marginRight: '4px' }}>🔗</span>
                {pair.community2}
              </div>
            </div>
          </div>

          {/* Child Concepts */}
          <div style={{
            fontWeight: 'bold',
            color: '#27ae60',
            marginBottom: '12px',
            fontSize: '14px'
          }}>
            Child Concepts
          </div>
          
          <div style={{ display: 'flex', gap: '20px' }}>
            {/* Left Column - Concept 1 */}
            <div style={{ flex: 1 }}>
              {childRelations[pair.concept1] && childRelations[pair.concept1].length > 0 ? (
                <>
                  {childRelations[pair.concept1]
                    .slice(0, showAllChildren1 ? undefined : INITIAL_CHILD_COUNT)
                    .map((child, idx) => (
                      <div key={idx} style={{
                        fontSize: '12px',
                        color: '#555',
                        marginBottom: '4px',
                        paddingLeft: '8px'
                      }}>
                        • {child}
                      </div>
                    ))}
                  {childRelations[pair.concept1].length > INITIAL_CHILD_COUNT && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowAllChildren1(!showAllChildren1);
                      }}
                      style={{
                        fontSize: '11px',
                        color: '#27ae60',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px 8px',
                        fontWeight: '600',
                        textDecoration: 'underline'
                      }}
                    >
                      {showAllChildren1 
                        ? `Show less` 
                        : `Show ${childRelations[pair.concept1].length - INITIAL_CHILD_COUNT} more...`}
                    </button>
                  )}
                </>
              ) : (
                <div style={{ fontSize: '12px', color: '#999', fontStyle: 'italic' }}>
                  No child concepts found
                </div>
              )}
            </div>

            {/* Right Column - Concept 2 */}
            <div style={{ flex: 1 }}>
              {childRelations[pair.concept2] && childRelations[pair.concept2].length > 0 ? (
                <>
                  {childRelations[pair.concept2]
                    .slice(0, showAllChildren2 ? undefined : INITIAL_CHILD_COUNT)
                    .map((child, idx) => (
                      <div key={idx} style={{
                        fontSize: '12px',
                        color: '#555',
                        marginBottom: '4px',
                        paddingLeft: '8px'
                      }}>
                        • {child}
                      </div>
                    ))}
                  {childRelations[pair.concept2].length > INITIAL_CHILD_COUNT && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowAllChildren2(!showAllChildren2);
                      }}
                      style={{
                        fontSize: '11px',
                        color: '#27ae60',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px 8px',
                        fontWeight: '600',
                        textDecoration: 'underline'
                      }}
                    >
                      {showAllChildren2 
                        ? `Show less` 
                        : `Show ${childRelations[pair.concept2].length - INITIAL_CHILD_COUNT} more...`}
                    </button>
                  )}
                </>
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
  );
};

export default ConceptPairItem;
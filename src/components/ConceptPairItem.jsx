import React, { useState } from 'react';

const ConceptPairItem = ({ 
  pair, 
  isExpanded, 
  onToggleExpand, 
  childRelations,
  colorMap = {},
  isFiltered = false,
  selectedCommunities = []
}) => {
  const [showAllChildren1, setShowAllChildren1] = useState(false);
  const [showAllChildren2, setShowAllChildren2] = useState(false);
  
  const INITIAL_CHILD_COUNT = 20;
  
  // Determine if this is a node filter (1 community) or edge filter (2 communities)
  const isNodeFilter = selectedCommunities.length === 1;
  const isEdgeFilter = selectedCommunities.length === 2;
  
  // For node filter: only color the concept that belongs to the selected community
  // For edge filter: color both concepts
  let color1 = '#2c3e50'; // default black
  let color2 = '#2c3e50'; // default black
  
  if (isFiltered) {
    if (isNodeFilter) {
      // Only color the concept if it belongs to the selected community
      if (selectedCommunities.includes(pair.community1)) {
        color1 = colorMap[pair.community1] || '#2c3e50';
      }
      if (selectedCommunities.includes(pair.community2)) {
        color2 = colorMap[pair.community2] || '#2c3e50';
      }
    } else if (isEdgeFilter) {
      // Color both concepts in edge filter
      color1 = colorMap[pair.community1] || '#2c3e50';
      color2 = colorMap[pair.community2] || '#2c3e50';
    }
  }
  
  return (
    <div 
      style={{
        border: isExpanded ? '2px solid #3498db' : '1px solid #e0e0e0',
        borderRadius: '6px',
        padding: '12px',
        marginBottom: '10px',
        cursor: 'pointer',
        background: isExpanded ? '#f8f9fa' : 'white',
        transition: 'all 0.2s'
      }}
      onClick={() => onToggleExpand(pair)}
      onMouseEnter={(e) => {
        if (!isExpanded) {
          e.currentTarget.style.background = '#f8f9fa';
          e.currentTarget.style.borderColor = '#3498db';
        }
      }}
      onMouseLeave={(e) => {
        if (!isExpanded) {
          e.currentTarget.style.background = 'white';
          e.currentTarget.style.borderColor = '#e0e0e0';
        }
      }}
    >
      {/* Header with arrow - colored concept names based on filter type */}
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
          <span style={{ 
            color: '#2c3e50', 
            fontWeight: 'bold',
            borderBottom: isFiltered && (isEdgeFilter || selectedCommunities.includes(pair.community1)) 
              ? `2px solid ${colorMap[pair.community1] || '#95a5a6'}` 
              : 'none',
            paddingBottom: '2px'
          }}>{pair.concept1}</span>
          <span style={{ color: '#7f8c8d' }}> ↔ </span>
          <span style={{ 
            color: '#2c3e50', 
            fontWeight: 'bold',
            borderBottom: isFiltered && (isEdgeFilter || selectedCommunities.includes(pair.community2)) 
              ? `2px solid ${colorMap[pair.community2] || '#95a5a6'}` 
              : 'none',
            paddingBottom: '2px'
          }}>{pair.concept2}</span>
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
        Score: {pair.prediction_score.toFixed(3)}
      </div>

      {/* 확장된 상세 정보 */}
      {isExpanded && (
        <div style={{
          marginTop: '15px',
          paddingTop: '15px',
          borderTop: '2px solid #3498db'
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
              <div style={{ fontSize: '12px', color: '#555', marginBottom: '4px', fontWeight: '600' }}>
                Papers: {pair.concept1_freq}
              </div>
              <div style={{ fontSize: '12px', color: '#555', marginBottom: '4px', fontWeight: '600' }}>
                Main Field: {pair.concept1_field.trim()} ({(pair.concept1_field_ratio * 100).toFixed(0)}%)
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: '#2c3e50',
                fontWeight: '700',
                background: '#f5f5f5',
                padding: '4px 8px',
                borderRadius: '4px',
                borderLeft: `4px solid ${colorMap[pair.community1] || '#95a5a6'}`,
                display: 'inline-block',
                marginTop: '4px'
              }}>
                {pair.community1.trim()}
              </div>
            </div>

            {/* Concept 2 */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '12px', color: '#555', marginBottom: '4px', fontWeight: '600' }}>
                Papers: {pair.concept2_freq}
              </div>
              <div style={{ fontSize: '12px', color: '#555', marginBottom: '4px', fontWeight: '600' }}>
                Main Field: {pair.concept2_field.trim()} ({(pair.concept2_field_ratio * 100).toFixed(0)}%)
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: '#2c3e50',
                fontWeight: '700',
                background: '#f5f5f5',
                padding: '4px 8px',
                borderRadius: '4px',
                borderLeft: `4px solid ${colorMap[pair.community2] || '#95a5a6'}`,
                display: 'inline-block',
                marginTop: '4px'
              }}>
                {pair.community2.trim()}
              </div>
            </div>
          </div>

          {/* Child Concepts */}
          <div style={{
            fontWeight: 'bold',
            color: '#000000ff',
            marginBottom: '12px',
            fontSize: '14px'
          }}>
            Child Concepts
          </div>
          
          <div style={{ display: 'flex', gap: '20px' }}>
            {/* Left Column - Concept 1 */}
            <div style={{ 
              flex: 1,
              border: '1px solid #e0e0e0',
              borderRadius: '6px',
              padding: '12px',
              background: 'white'
            }}>
              <div style={{
                fontWeight: '700',
                color: '#2c3e50',
                marginBottom: '10px',
                fontSize: '13px',
                paddingBottom: '8px',
                borderBottom: '2px solid #e0e0e0'
              }}>
                {pair.concept1}
              </div>
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
            <div style={{ 
              flex: 1,
              border: '1px solid #e0e0e0',
              borderRadius: '6px',
              padding: '12px',
              background: 'white'
            }}>
              <div style={{
                fontWeight: '700',
                color: '#2c3e50',
                marginBottom: '10px',
                fontSize: '13px',
                paddingBottom: '8px',
                borderBottom: '2px solid #e8f5e9'
              }}>
                {pair.concept2}
              </div>
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
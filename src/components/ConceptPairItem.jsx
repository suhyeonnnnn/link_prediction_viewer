import React, { memo, useState } from 'react';

const ConceptPairItem = memo(({ 
  pair, 
  isExpanded, 
  onToggleExpand, 
  childRelations 
}) => {
  const [showAllChildren1, setShowAllChildren1] = useState(false);
  const [showAllChildren2, setShowAllChildren2] = useState(false);
  
  const INITIAL_CHILD_COUNT = 20;
  
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
      {/* Header with arrow */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '6px'
      }}>
        <div style={{
          fontWeight: 'bold',
          color: '#2c3e50',
          fontSize: '15px',
          flex: 1
        }}>
          {pair.rank}. {pair.concept1} ↔ {pair.concept2}
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
                color: '#2c3e50',
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
              <div style={{ fontSize: '12px', color: '#27ae60', fontWeight: '600' }}>
                <span style={{ marginRight: '4px' }}>🔗</span>
                {pair.community1}
              </div>
            </div>

            {/* Concept 2 */}
            <div style={{ flex: 1 }}>
              <div style={{
                fontWeight: '700',
                color: '#2c3e50',
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
              <div style={{ fontSize: '12px', color: '#27ae60', fontWeight: '600' }}>
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
}, (prevProps, nextProps) => {
  // 성능 최적화: isExpanded와 pair.rank가 같으면 리렌더링하지 않음
  return prevProps.isExpanded === nextProps.isExpanded &&
         prevProps.pair.rank === nextProps.pair.rank;
});

ConceptPairItem.displayName = 'ConceptPairItem';

export default ConceptPairItem;

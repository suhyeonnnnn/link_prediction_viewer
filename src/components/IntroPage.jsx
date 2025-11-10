import React, { useState } from 'react';

// Mini Preview Components
const ConceptPairsPreview = () => (
  <div style={{
    width: '100%',
    height: '180px',
    background: 'rgba(255, 255, 255, 0.08)',
    borderRadius: '4px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '8px'
  }}>
    {[1, 2, 3].map(i => (
      <div key={i} style={{
        background: 'rgba(39, 174, 96, 0.2)',
        border: '1px solid rgba(39, 174, 96, 0.4)',
        borderRadius: '4px',
        padding: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          flex: 1
        }}>
          <div style={{
            width: '28px',
            height: '28px',
            background: 'rgba(39, 174, 96, 0.4)',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            color: '#27ae60',
            fontWeight: 'bold'
          }}>
            #{i}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              height: '8px',
              background: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '2px',
              marginBottom: '4px',
              width: '85%'
            }}></div>
            <div style={{
              height: '6px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '2px',
              width: '65%'
            }}></div>
          </div>
        </div>
        <div style={{
          fontSize: '10px',
          color: 'rgba(255, 255, 255, 0.5)',
          fontWeight: '600'
        }}>
          0.{90 - i * 5}
        </div>
      </div>
    ))}
  </div>
);

const NetworkGraphPreview = () => (
  <svg width="100%" height="180" style={{
    background: 'rgba(255, 255, 255, 0.08)',
    borderRadius: '4px',
    display: 'block'
  }} viewBox="0 0 350 180" preserveAspectRatio="xMidYMid meet">
    <line x1="110" y1="90" x2="190" y2="60" stroke="rgba(52, 152, 219, 0.3)" strokeWidth="2"/>
    <line x1="110" y1="90" x2="190" y2="120" stroke="rgba(52, 152, 219, 0.3)" strokeWidth="2"/>
    <line x1="190" y1="60" x2="270" y2="90" stroke="rgba(52, 152, 219, 0.3)" strokeWidth="2"/>
    <line x1="190" y1="120" x2="270" y2="90" stroke="rgba(52, 152, 219, 0.3)" strokeWidth="2"/>
    <line x1="190" y1="60" x2="190" y2="120" stroke="rgba(52, 152, 219, 0.2)" strokeWidth="1.5"/>
    {[
      { x: 110, y: 90, r: 25, color: '#3498db' },
      { x: 190, y: 60, r: 20, color: '#27ae60' },
      { x: 190, y: 120, r: 20, color: '#e67e22' },
      { x: 270, y: 90, r: 23, color: '#9b59b6' }
    ].map((node, i) => (
      <g key={i}>
        <circle cx={node.x} cy={node.y} r={node.r} fill={node.color} opacity="0.3" stroke={node.color} strokeWidth="2"/>
        <circle cx={node.x} cy={node.y} r={node.r * 0.4} fill={node.color} opacity="0.6"/>
      </g>
    ))}
  </svg>
);

const CommunityRankingPreview = () => (
  <div style={{
    width: '100%',
    height: '180px',
    background: 'rgba(255, 255, 255, 0.08)',
    borderRadius: '4px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '14px'
  }}>
    {[
      { width: '90%', color: '#e67e22', label: 'Tech × Business', score: '90' },
      { width: '75%', color: '#e67e22', label: 'AI × Marketing', score: '75' },
      { width: '60%', color: '#e67e22', label: 'Data × Strategy', score: '60' }
    ].map((item, i) => (
      <div key={i}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
          <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', fontWeight: '500' }}>{item.label}</div>
          <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)', fontWeight: '600' }}>{item.score}</div>
        </div>
        <div style={{ width: '100%', height: '12px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '6px', overflow: 'hidden' }}>
          <div style={{ width: item.width, height: '100%', background: `linear-gradient(90deg, ${item.color}, ${item.color}aa)`, borderRadius: '6px', transition: 'width 0.5s ease' }}></div>
        </div>
      </div>
    ))}
  </div>
);

const IntroPage = ({ onEnter }) => {
  const [showGuide, setShowGuide] = useState(false);

  React.useEffect(() => {
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  return (
    <>
      <style>{`
        html, body { margin: 0; padding: 0; overflow-x: hidden; overflow-y: auto !important; height: auto !important; }
        #root { height: auto !important; min-height: 100vh; }
        
        @keyframes slideInLeft { from { opacity: 0; transform: translateX(-50px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(50px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        
        .preview-card { 
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          will-change: transform, box-shadow;
          backface-visibility: hidden;
          transform: translateZ(0);
        }
        
        .preview-card:hover { 
          transform: translateY(-8px) translateZ(0);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
        }
        
        .title-main { animation: slideInLeft 0.8s ease-out; color: #ffffff; }
        .description-text { animation: slideInLeft 1s ease-out 0.2s backwards; }
        .card-animate-1 { animation: scaleIn 0.6s ease-out 0.4s backwards; }
        .card-animate-2 { animation: scaleIn 0.6s ease-out 0.5s backwards; }
        .card-animate-3 { animation: scaleIn 0.6s ease-out 0.6s backwards; }
        .button-animate { animation: slideInRight 0.8s ease-out 0.7s backwards; }
        .guide-section { animation: fadeIn 0.5s ease-out; }
      `}</style>
      
      <div style={{ minHeight: '100vh', width: '100%', background: '#2c3e50', fontFamily: 'Arial, sans-serif', color: '#ffffff', position: 'relative' }}>
        <div style={{ padding: '100px 40px 60px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ width: '100%' }}>
            <h1 className="title-main" style={{ fontSize: '56px', fontWeight: '700', margin: '0 0 30px 0', letterSpacing: '-1px', lineHeight: '1.2', textShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 2px 10px rgba(0, 0, 0, 0.2)', textAlign: 'left' }}>
              Link Prediction Viewer:<br />Service Research Forecast
            </h1>
            <p className="description-text" style={{ fontSize: '17px', color: '#95a5a6', margin: '0 0 70px 0', fontWeight: '300', lineHeight: '1.7', maxWidth: '800px', textAlign: 'left' }}>
              An interactive dashboard for exploring predicted concept pairs and their relationships in service research. Visualize community networks, analyze connection strengths, and discover emerging research trends through AI-powered link prediction.
            </p>

            {/* Main Feature Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px', marginBottom: '50px', alignItems: 'stretch', isolation: 'isolate' }}>
              <div className="preview-card card-animate-1" style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', padding: '30px', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)', display: 'flex', flexDirection: 'column', minHeight: '340px' }}>
                <div style={{ marginBottom: '18px', flexShrink: 0 }}><ConceptPairsPreview /></div>
                <div style={{ fontSize: '22px', fontWeight: '600', color: '#27ae60', marginBottom: '10px', flexShrink: 0 }}>1. Explore Pairs</div>
                <div style={{ fontSize: '15px', color: '#bdc3c7', lineHeight: '1.5', flex: 1 }}>Browse predicted concept pairs ranked by prediction score and frequency</div>
              </div>
              <div className="preview-card card-animate-2" style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', padding: '30px', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)', display: 'flex', flexDirection: 'column', minHeight: '340px' }}>
                <div style={{ marginBottom: '18px', flexShrink: 0 }}><NetworkGraphPreview /></div>
                <div style={{ fontSize: '22px', fontWeight: '600', color: '#3498db', marginBottom: '10px', flexShrink: 0 }}>2. Visualize Network</div>
                <div style={{ fontSize: '15px', color: '#bdc3c7', lineHeight: '1.5', flex: 1 }}>Interact with the community network graph to see connections and relationships</div>
              </div>
              <div className="preview-card card-animate-3" style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', padding: '30px', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)', display: 'flex', flexDirection: 'column', minHeight: '340px' }}>
                <div style={{ marginBottom: '18px', flexShrink: 0 }}><CommunityRankingPreview /></div>
                <div style={{ fontSize: '22px', fontWeight: '600', color: '#e67e22', marginBottom: '10px', flexShrink: 0 }}>3. Filter & Analyze</div>
                <div style={{ fontSize: '15px', color: '#bdc3c7', lineHeight: '1.5', flex: 1 }}>Click rankings or nodes to filter by specific communities and discover insights</div>
              </div>
            </div>

            {/* Usage Guide Section */}
            <div style={{ marginBottom: '50px' }}>
              <button
                onClick={() => setShowGuide(!showGuide)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  padding: '15px 30px',
                  fontSize: '16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'all 0.3s ease',
                  marginBottom: '20px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                <span>{showGuide ? '▼' : '▶'}</span>
                <span>Detailed Usage Guide</span>
              </button>

              {showGuide && (
                <div className="guide-section" style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  padding: '40px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  {/* Interface Overview */}
                  <div style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: '600', color: '#3498db', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span>📊</span> Interface Overview
                    </h2>
                    <div style={{ fontSize: '15px', color: '#bdc3c7', lineHeight: '1.8' }}>
                      The dashboard is divided into two main panels:
                      <ul style={{ marginTop: '10px', paddingLeft: '25px' }}>
                        <li style={{ marginBottom: '8px' }}><strong style={{ color: '#ffffff' }}>Left Panel:</strong> Top Predicted Concept Pairs - Browse and expand concept pairs with detailed metadata</li>
                        <li style={{ marginBottom: '8px' }}><strong style={{ color: '#ffffff' }}>Right Panel:</strong> Concept Communities Network (top) and Community Pair Ranking (bottom)</li>
                      </ul>
                    </div>
                  </div>

                  {/* Network Controls */}
                  <div style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: '600', color: '#27ae60', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span>🎛️</span> Network Controls
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                      <div style={{ background: 'rgba(39, 174, 96, 0.1)', padding: '20px', borderRadius: '6px', border: '1px solid rgba(39, 174, 96, 0.2)' }}>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#27ae60', marginBottom: '10px' }}>📈 Predicted / 📊 Previous Toggle</div>
                        <div style={{ fontSize: '14px', color: '#bdc3c7', lineHeight: '1.6' }}>
                          Switch between predicted future concept pairs and historical pairs from publications
                        </div>
                      </div>
                      <div style={{ background: 'rgba(52, 152, 219, 0.1)', padding: '20px', borderRadius: '6px', border: '1px solid rgba(52, 152, 219, 0.2)' }}>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#3498db', marginBottom: '10px' }}>Top N Selector</div>
                        <div style={{ fontSize: '14px', color: '#bdc3c7', lineHeight: '1.6' }}>
                          Choose Top 1000/5000/10000/All or enter a custom number to control how many pairs are shown in the network
                        </div>
                      </div>
                      <div style={{ background: 'rgba(155, 89, 182, 0.1)', padding: '20px', borderRadius: '6px', border: '1px solid rgba(155, 89, 182, 0.2)' }}>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#9b59b6', marginBottom: '10px' }}>Hide Bottom Nodes</div>
                        <div style={{ fontSize: '14px', color: '#bdc3c7', lineHeight: '1.6' }}>
                          Simplify the network by hiding communities with the fewest concept pairs
                        </div>
                      </div>
                      <div style={{ background: 'rgba(230, 126, 34, 0.1)', padding: '20px', borderRadius: '6px', border: '1px solid rgba(230, 126, 34, 0.2)' }}>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#e67e22', marginBottom: '10px' }}>Count / Weighted Mode</div>
                        <div style={{ fontSize: '14px', color: '#bdc3c7', lineHeight: '1.6' }}>
                          <strong>Count:</strong> Edge thickness by pair count<br/>
                          <strong>Weighted:</strong> Edge thickness by sum of prediction scores
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Features */}
                  <div style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: '600', color: '#e67e22', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span>🖱️</span> Interactive Features
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
                      <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '20px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff', marginBottom: '10px' }}>
                          🔵 Click Network Node (Community Filter)
                        </div>
                        <div style={{ fontSize: '14px', color: '#bdc3c7', lineHeight: '1.6' }}>
                          Filter pairs to show only those involving the selected community. The filtered community's concepts will be <strong style={{ color: '#27ae60' }}>highlighted in color</strong> while others remain black.
                        </div>
                      </div>
                      <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '20px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff', marginBottom: '10px' }}>
                          ↔️ Click Network Edge (Community Pair Filter)
                        </div>
                        <div style={{ fontSize: '14px', color: '#bdc3c7', lineHeight: '1.6' }}>
                          Filter pairs to show only those connecting two specific communities. <strong style={{ color: '#27ae60' }}>Both concepts will be highlighted</strong> in their respective community colors.
                        </div>
                      </div>
                      <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '20px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff', marginBottom: '10px' }}>
                          📊 Click Community Ranking Item
                        </div>
                        <div style={{ fontSize: '14px', color: '#bdc3c7', lineHeight: '1.6' }}>
                          Same as clicking an edge - filters to show pairs between the two communities in the ranking
                        </div>
                      </div>
                      <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '20px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff', marginBottom: '10px' }}>
                          📝 Click Concept Pair
                        </div>
                        <div style={{ fontSize: '14px', color: '#bdc3c7', lineHeight: '1.6' }}>
                          Expand to see detailed information: frequency, field distribution, community membership, and child concepts (narrower terms)
                        </div>
                      </div>
                      <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '20px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff', marginBottom: '10px' }}>
                          ✕ Clear Filter
                        </div>
                        <div style={{ fontSize: '14px', color: '#bdc3c7', lineHeight: '1.6' }}>
                          Click the ✕ button in the filter badge (appears when filtering is active) to return to the full list
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Network Visualization */}
                  <div style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: '600', color: '#9b59b6', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span>🌐</span> Network Visualization Guide
                    </h2>
                    <div style={{ fontSize: '15px', color: '#bdc3c7', lineHeight: '1.8' }}>
                      <ul style={{ paddingLeft: '25px', marginTop: '10px' }}>
                        <li style={{ marginBottom: '10px' }}><strong style={{ color: '#ffffff' }}>Node Size:</strong> Larger nodes = more concept pairs in that community</li>
                        <li style={{ marginBottom: '10px' }}><strong style={{ color: '#ffffff' }}>Node Color:</strong> Each community has a unique, fixed color for easy identification</li>
                        <li style={{ marginBottom: '10px' }}><strong style={{ color: '#ffffff' }}>Edge Thickness:</strong> Thicker edges = stronger connection (more pairs or higher prediction scores)</li>
                        <li style={{ marginBottom: '10px' }}><strong style={{ color: '#ffffff' }}>Edge Opacity:</strong> More opaque edges indicate stronger connections</li>
                        <li style={{ marginBottom: '10px' }}><strong style={{ color: '#ffffff' }}>Zoom & Pan:</strong> Use mouse wheel to zoom and drag to pan the network</li>
                        <li style={{ marginBottom: '10px' }}><strong style={{ color: '#ffffff' }}>Drag Nodes:</strong> Click and drag individual nodes to rearrange the layout</li>
                      </ul>
                    </div>
                  </div>

                  {/* Tips */}
                  <div>
                    <h2 style={{ fontSize: '28px', fontWeight: '600', color: '#e74c3c', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span>💡</span> Tips & Best Practices
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                      {[
                        'Start with the network view to get an overview of community relationships',
                        'Use community ranking to identify the strongest community pairs',
                        'Filter by specific communities to focus your analysis on relevant concept pairs',
                        'Expand concept pairs to see child concepts and understand the hierarchy',
                        'Compare Predicted and Previous networks to identify emerging trends',
                        'Experiment with Count vs Weighted modes to see different perspectives on connection strength',
                        'Adjust Top N to balance between comprehensive view and performance'
                      ].map((tip, i) => (
                        <div key={i} style={{ 
                          background: 'rgba(231, 76, 60, 0.1)', 
                          padding: '15px 20px', 
                          borderRadius: '6px', 
                          border: '1px solid rgba(231, 76, 60, 0.2)',
                          fontSize: '14px',
                          color: '#ecf0f1',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px'
                        }}>
                          <span style={{ fontSize: '18px' }}>✓</span>
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Enter Button */}
            <div style={{ textAlign: 'left' }}>
              <button 
                className="button-animate" 
                onClick={onEnter} 
                style={{ 
                  background: '#27ae60', 
                  color: 'white', 
                  border: 'none', 
                  padding: '18px 56px', 
                  fontSize: '18px', 
                  borderRadius: '4px', 
                  cursor: 'pointer', 
                  transition: 'all 0.2s ease', 
                  fontWeight: '400', 
                  letterSpacing: '0.5px', 
                  boxShadow: '0 4px 15px rgba(39, 174, 96, 0.3)' 
                }} 
                onMouseEnter={(e) => { 
                  e.target.style.background = '#229954'; 
                  e.target.style.transform = 'translateY(-2px)'; 
                  e.target.style.boxShadow = '0 6px 20px rgba(39, 174, 96, 0.4)'; 
                }} 
                onMouseLeave={(e) => { 
                  e.target.style.background = '#27ae60'; 
                  e.target.style.transform = 'translateY(0)'; 
                  e.target.style.boxShadow = '0 4px 15px rgba(39, 174, 96, 0.3)'; 
                }}
              >
                Enter Dashboard →
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '40px 20px', textAlign: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div style={{ fontSize: '13px', color: '#7f8c8d', marginBottom: '8px' }}>KAIST College of Business · ASU W. P. Carey School of Business</div>
          <div style={{ fontSize: '12px', color: '#7f8c8d' }}>© 2025 All Rights Reserved</div>
        </div>
      </div>
    </>
  );
};

export default IntroPage;
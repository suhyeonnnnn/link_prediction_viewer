import React, { useState } from 'react';

const Tooltip = ({ text, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const tooltipStyles = {
    container: {
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: '6px'
    },
    icon: {
      width: '16px',
      height: '16px',
      borderRadius: '50%',
      background: '#95a5a6',
      color: 'white',
      fontSize: '11px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'help',
      transition: 'all 0.2s',
      userSelect: 'none'
    },
    iconHover: {
      background: '#7f8c8d'
    },
    tooltip: {
      position: 'absolute',
      background: '#2c3e50',
      color: 'white',
      padding: '10px 14px',
      borderRadius: '6px',
      fontSize: '13px',
      lineHeight: '1.5',
      whiteSpace: 'normal',
      maxWidth: '500px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 1000,
      pointerEvents: 'none',
      opacity: isVisible ? 1 : 0,
      visibility: isVisible ? 'visible' : 'hidden',
      transition: 'opacity 0.2s, visibility 0.2s',
      ...(position === 'top' ? {
        bottom: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        marginBottom: '8px'
      } : position === 'bottom' ? {
        top: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        marginTop: '8px'
      } : position === 'left' ? {
        right: '100%',
        top: '50%',
        transform: 'translateY(-50%)',
        marginRight: '8px'
      } : {
        left: '100%',
        top: '50%',
        transform: 'translateY(-50%)',
        marginLeft: '8px'
      })
    },
    arrow: {
      position: 'absolute',
      width: '0',
      height: '0',
      borderStyle: 'solid',
      ...(position === 'top' ? {
        top: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        borderWidth: '6px 6px 0 6px',
        borderColor: '#2c3e50 transparent transparent transparent'
      } : position === 'bottom' ? {
        bottom: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        borderWidth: '0 6px 6px 6px',
        borderColor: 'transparent transparent #2c3e50 transparent'
      } : position === 'left' ? {
        left: '100%',
        top: '50%',
        transform: 'translateY(-50%)',
        borderWidth: '6px 0 6px 6px',
        borderColor: 'transparent transparent transparent #2c3e50'
      } : {
        right: '100%',
        top: '50%',
        transform: 'translateY(-50%)',
        borderWidth: '6px 6px 6px 0',
        borderColor: 'transparent #2c3e50 transparent transparent'
      })
    }
  };

  return (
    <div 
      style={tooltipStyles.container}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <div style={{
        ...tooltipStyles.icon,
        ...(isVisible ? tooltipStyles.iconHover : {})
      }}>
        ?
      </div>
      <div style={tooltipStyles.tooltip}>
        {text}
        <div style={tooltipStyles.arrow} />
      </div>
    </div>
  );
};

export default Tooltip;

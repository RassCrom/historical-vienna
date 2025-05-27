
import { X, Info, MapPin, Calendar } from 'lucide-react';

const Popup = ({
    selectedBuilding, showInfoCard, currentPalette, 
    setSelectedBuilding, getArchitecturalPeriod, handleLearnMore
}) => {
  return (
    <>
      {/* Enhanced Simple Popup */}
      {selectedBuilding && !showInfoCard && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          background: currentPalette.colors.cardBgGlass,
          backdropFilter: 'blur(20px)',
          padding: '20px 24px',
          borderRadius: '20px',
          boxShadow: `0 16px 64px ${currentPalette.colors.shadow}`,
          border: `1px solid ${currentPalette.colors.border}`,
          zIndex: 2000,
          minWidth: '320px',
          maxWidth: '380px',
          animation: 'slideInFromBottom 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            marginBottom: '16px'
          }}>
            <div style={{ flex: 1 }}>
              <h4 style={{ 
                margin: '0 0 8px 0', 
                color: currentPalette.colors.text,
                fontSize: '18px',
                fontWeight: '700',
                lineHeight: '1.2'
              }}>
                {selectedBuilding.name || 'Historic Building'}
              </h4>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                color: currentPalette.colors.textLight,
                fontSize: '14px',
                fontWeight: '500'
              }}>
                <MapPin size={14} style={{ marginRight: '6px' }} />
                {selectedBuilding.district || 'Vienna, Austria'}
              </div>
            </div>
            <button
              onClick={() => setSelectedBuilding(null)}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                color: currentPalette.colors.textLight,
                padding: '6px',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(255, 0, 0, 0.1)';
                e.target.style.color = '#ef4444';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                e.target.style.color = currentPalette.colors.textLight;
              }}
            >
              <X size={18} />
            </button>
          </div>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: '20px',
            color: currentPalette.colors.textLight,
            fontSize: '14px',
            background: 'rgba(255, 255, 255, 0.3)',
            padding: '12px',
            borderRadius: '12px',
            paddingLeft: '0'
          }}>
            <Calendar size={16} style={{ marginRight: '8px', color: currentPalette.colors.primary }} />
            <span style={{ fontWeight: '600' }}>
              Built in {selectedBuilding.year_i} • {getArchitecturalPeriod(selectedBuilding.year_i)} Period
            </span>
          </div>

          <button
            onClick={handleLearnMore}
            style={{
              background: `linear-gradient(135deg, ${currentPalette.colors.primary}, ${currentPalette.colors.secondary})`,
              color: 'white',
              border: 'none',
              padding: '14px 20px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              width: '100%',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: `0 4px 16px ${currentPalette.colors.primary}40`
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = `0 8px 24px ${currentPalette.colors.primary}60`;
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = `0 4px 16px ${currentPalette.colors.primary}40`;
            }}
          >
            <Info size={16} />
            Learn More
          </button>
        </div>
      )}
    </>
  );
};

export default Popup;
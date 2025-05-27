import { useEffect, useRef, useState } from 'react';
import { X, Info, Clock, MapPin, Home, Calendar, Filter, Eye, EyeOff, Layers } from 'lucide-react';
import MapView from './MapView';
import ButtonsCard from './ButtonsCard';
import Popup from './Popup';

const iconSize = 20;

function App() {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [showInfoCard, setShowInfoCard] = useState(false);
  const [mapStyle, setMapStyle] = useState('historical');
  const [isLegendCollapsed, setIsLegendCollapsed] = useState(false);
  const [filterYear, setFilterYear] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const colorPalettes = {
    historical: {
      name: 'Imperial Vienna',
      description: 'Inspired by Habsburg era architecture',
      colors: {
        background: 'linear-gradient(135deg, #1a1611 0%, #2c251a 100%)',
        cardBg: 'rgba(255, 250, 245, 0.95)',
        cardBgGlass: 'rgba(255, 250, 245, 0.85)',
        primary: '#8B4513',
        secondary: '#DAA520',
        accent: '#CD853F',
        text: '#2F1B14',
        textLight: '#5D4E37',
        border: 'rgba(210, 180, 140, 0.3)',
        shadow: 'rgba(139, 69, 19, 0.15)'
      },
      buildingColors: [
        { year: 800, color: '#8B4513' },
        { year: 1200, color: '#A0522D' },
        { year: 1500, color: '#CD853F' },
        { year: 1700, color: '#DAA520' },
        { year: 1800, color: '#B8860B' },
        { year: 1900, color: '#D2691E' },
        { year: 2000, color: '#FF6347' }
      ]
    },
    baroque: {
      name: 'Baroque Elegance',
      description: 'Rich colors of Austrian baroque',
      colors: {
        background: 'linear-gradient(135deg, #0f0f1a 0%, #1a0f1a 100%)',
        cardBg: 'rgba(255, 248, 240, 0.95)',
        cardBgGlass: 'rgba(255, 248, 240, 0.85)',
        primary: '#800020',
        secondary: '#FFD700',
        accent: '#4B0082',
        text: '#1a1a1a',
        textLight: '#4a4a4a',
        border: 'rgba(221, 221, 221, 0.3)',
        shadow: 'rgba(128, 0, 32, 0.15)'
      },
      buildingColors: [
        { year: 800, color: '#800020' },
        { year: 1200, color: '#8B0000' },
        { year: 1500, color: '#A52A2A' },
        { year: 1700, color: '#DC143C' },
        { year: 1800, color: '#FFD700' },
        { year: 1900, color: '#FF8C00' },
        { year: 2000, color: '#FF1493' }
      ]
    },
    modern: {
      name: 'Contemporary',
      description: 'Clean modern aesthetic',
      colors: {
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
        cardBg: 'rgba(255, 255, 255, 0.95)',
        cardBgGlass: 'rgba(255, 255, 255, 0.85)',
        primary: '#2563eb',
        secondary: '#10b981',
        accent: '#f59e0b',
        text: '#111827',
        textLight: '#6b7280',
        border: 'rgba(229, 231, 235, 0.3)',
        shadow: 'rgba(37, 99, 235, 0.15)'
      },
      buildingColors: [
        { year: 800, color: '#1f2937' },
        { year: 1200, color: '#374151' },
        { year: 1500, color: '#4b5563' },
        { year: 1700, color: '#6b7280' },
        { year: 1800, color: '#9ca3af' },
        { year: 1900, color: '#2563eb' },
        { year: 2000, color: '#10b981' }
      ]
    }
  };

  const currentPalette = colorPalettes[mapStyle];

  const handleLearnMore = () => {
    setShowInfoCard(true);
  };

  const getBuildingAge = (year) => {
    const currentYear = new Date().getFullYear();
    return currentYear - year;
  };

  const getArchitecturalPeriod = (year) => {
    if (year < 1000) return 'Early Medieval';
    if (year < 1200) return 'Romanesque';
    if (year < 1500) return 'Gothic';
    if (year < 1600) return 'Renaissance';
    if (year < 1750) return 'Baroque';
    if (year < 1850) return 'Classical';
    if (year < 1900) return 'Historicism';
    if (year < 1950) return 'Modern';
    return 'Contemporary';
  };

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      position: 'relative',
      background: currentPalette.colors.background,
      fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
      overflow: 'hidden'
    }}>
      <MapView
        mapRef={mapRef}
        mapContainer={mapContainer}
        currentPalette={currentPalette}
        setSelectedBuilding={setSelectedBuilding}
        filterYear={filterYear}
      />

      {/* Filters Panel */}
      {showFilters && (
        <div style={{
          position: 'absolute',
          top: '140px',
          right: '20px',
          width: '280px',
          background: currentPalette.colors.cardBgGlass,
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: `0 16px 64px ${currentPalette.colors.shadow}`,
          border: `1px solid ${currentPalette.colors.border}`,
          zIndex: 1000,
          animation: 'slideInFromRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <Filter size={18} style={{ color: currentPalette.colors.primary, marginRight: '8px' }} />
            <h3 style={{ 
              margin: 0, 
              fontSize: '16px', 
              fontWeight: '600',
              color: currentPalette.colors.text 
            }}>
              Filter by Era
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { value: 'all', label: 'All Periods' },
              { value: 'medieval', label: 'Medieval (< 1500)' },
              { value: 'baroque', label: 'Baroque (1600-1750)' },
              { value: 'modern', label: 'Modern (1850+)' }
            ].map(option => (
              <label
                key={option.value}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: filterYear === option.value ? `${currentPalette.colors.primary}20` : 'transparent'
                }}
                onMouseOver={(e) => {
                  if (filterYear !== option.value) {
                    e.target.style.background = `${currentPalette.colors.primary}10`;
                  }
                }}
                onMouseOut={(e) => {
                  if (filterYear !== option.value) {
                    e.target.style.background = 'transparent';
                  }
                }}
              >
                <input
                  type="radio"
                  name="yearFilter"
                  value={option.value}
                  checked={filterYear === option.value}
                  onChange={(e) => {
                    setFilterYear(e.target.value)
                    console.log(e.target.value)
                  }}
                  style={{ marginRight: '12px', accentColor: currentPalette.colors.primary }}
                />
                <span style={{ 
                  fontSize: '14px', 
                  color: currentPalette.colors.text,
                  fontWeight: filterYear === option.value ? '600' : '400'
                }}>
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Legend */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          background: currentPalette.colors.cardBgGlass,
          backdropFilter: 'blur(20px)',
          padding: '24px',
          borderRadius: '20px',
          fontSize: '14px',
          maxWidth: '360px',
          width: '100%',
          zIndex: 1000,
          boxShadow: `0 16px 64px ${currentPalette.colors.shadow}`,
          border: `1px solid ${currentPalette.colors.border}`,
          animation: 'slideInFromLeft 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: '16px',
            justifyContent: 'space-between'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: `linear-gradient(135deg, ${currentPalette.colors.primary}, ${currentPalette.colors.secondary})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px'
            }}>
              <Home size={iconSize} style={{ color: 'white' }} />
            </div>
            <div>
              <h3 style={{ 
                margin: 0, 
                color: currentPalette.colors.text,
                fontSize: '20px',
                fontWeight: '700'
              }}>
                Historic Vienna
              </h3>
              <p style={{ 
                margin: 0, 
                fontSize: '13px',
                color: currentPalette.colors.textLight,
                fontWeight: '500'
              }}>
                Architectural Heritage
              </p>
            </div>
            <ButtonsCard 
              setShowFilters={setShowFilters} currentPalette={currentPalette}
              showFilters={showFilters} iconSize={iconSize}
              setIsLegendCollapsed={setIsLegendCollapsed}
              isLegendCollapsed={isLegendCollapsed}
            />
          </div>
          {!isLegendCollapsed && (  <>
            <p style={{ 
              margin: '0 0 20px 0', 
              fontSize: '14px',
              color: currentPalette.colors.textLight,
              lineHeight: '1.5'
            }}>
              Explore Vienna's architectural evolution through interactive building data spanning over a millennium.
            </p>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                fontSize: '13px', 
                fontWeight: '600',
                color: currentPalette.colors.text,
                display: 'flex',
                alignItems: 'center',
                marginBottom: '12px'
              }}>
                <Layers size={16} style={{ marginRight: '6px' }} />
                Visual Theme
              </label>
              <select 
                value={mapStyle}
                onChange={(e) => setMapStyle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: `2px solid ${currentPalette.colors.border}`,
                  background: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '14px',
                  color: currentPalette.colors.text,
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = currentPalette.colors.primary;
                  e.target.style.boxShadow = `0 0 0 3px ${currentPalette.colors.primary}20`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = currentPalette.colors.border;
                  e.target.style.boxShadow = 'none';
                }}
              >
                {Object.entries(colorPalettes).map(([key, palette]) => (
                  <option key={key} value={key}>{palette.name}</option>
                ))}
              </select>
            </div>

            {/* Age Legend */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ 
                fontSize: '13px', 
                fontWeight: '600',
                color: currentPalette.colors.text,
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Clock size={16} style={{ marginRight: '6px' }} />
                Building Age Scale
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {currentPalette.buildingColors.map((item, index) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    fontSize: '12px',
                    color: currentPalette.colors.textLight,
                    padding: '6px 8px',
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.3)'
                  }}>
                    <div style={{
                      width: '20px',
                      height: '16px',
                      background: `linear-gradient(90deg, ${item.color}, ${item.color}cc)`,
                      marginRight: '12px',
                      borderRadius: '4px',
                      border: '1px solid rgba(0,0,0,0.1)',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }} />
                    <span style={{ fontWeight: '500' }}>
                      {item.year}+ years • {getArchitecturalPeriod(item.year)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ 
              fontSize: '12px', 
              color: currentPalette.colors.textLight,
              borderTop: `1px solid ${currentPalette.colors.border}`,
              paddingTop: '12px',
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '12px',
              borderRadius: '8px',
              marginTop: '8px'
            }}>
              <Info size={14} style={{ marginRight: '6px', flexShrink: 0 }} />
              <span>Click any building to explore its history and architectural details</span>
            </div>
            </>)}
          </div>

      <Popup 
        selectedBuilding={selectedBuilding} showInfoCard={showInfoCard}
        currentPalette={currentPalette} setSelectedBuilding={setSelectedBuilding}
        getArchitecturalPeriod={getArchitecturalPeriod} handleLearnMore={handleLearnMore}
      />

      {/* Enhanced Detailed Info Card */}
      {showInfoCard && selectedBuilding && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3000,
          padding: '20px',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            background: currentPalette.colors.cardBg,
            padding: '32px',
            borderRadius: '24px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: `0 24px 96px ${currentPalette.colors.shadow}`,
            border: `1px solid ${currentPalette.colors.border}`,
            animation: 'slideInFromCenter 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              marginBottom: '24px'
            }}>
              <div>
                <h2 style={{ 
                  margin: '0 0 8px 0', 
                  color: currentPalette.colors.text,
                  fontSize: '28px',
                  fontWeight: '800',
                  lineHeight: '1.2'
                }}>
                  {selectedBuilding.name}
                </h2>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  color: currentPalette.colors.textLight,
                  fontSize: '16px',
                  fontWeight: '500'
                }}>
                  <MapPin size={16} style={{ marginRight: '8px' }} />
                  Innere Stadt, Vienna
                </div>
              </div>
              <button
                onClick={() => setShowInfoCard(false)}
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  color: '#ef4444',
                  padding: '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'rgba(239, 68, 68, 0.15)';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'rgba(239, 68, 68, 0.1)';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                <X size={iconSize} />
              </button>
            </div>

            {/* Building Stats Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div style={{
                background: `linear-gradient(135deg, ${currentPalette.colors.primary}15, ${currentPalette.colors.secondary}10)`,
                padding: '16px',
                borderRadius: '16px',
                border: `1px solid ${currentPalette.colors.border}`,
                textAlign: 'center'
              }}>
                <div style={{ 
                  fontSize: '24px', 
                  fontWeight: '800',
                  color: currentPalette.colors.primary,
                  marginBottom: '4px'
                }}>
                  {selectedBuilding.year_i}
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  color: currentPalette.colors.textLight,
                  fontWeight: '600'
                }}>
                  Year Built
                </div>
              </div>

              <div style={{
                background: `linear-gradient(135deg, ${currentPalette.colors.secondary}15, ${currentPalette.colors.accent}10)`,
                padding: '16px',
                borderRadius: '16px',
                border: `1px solid ${currentPalette.colors.border}`,
                textAlign: 'center'
              }}>
                <div style={{ 
                  fontSize: '24px', 
                  fontWeight: '800',
                  color: currentPalette.colors.secondary,
                  marginBottom: '4px'
                }}>
                  {getBuildingAge(selectedBuilding.year_i)}
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  color: currentPalette.colors.textLight,
                  fontWeight: '600'
                }}>
                  Years Old
                </div>
              </div>

              <div style={{
                background: `linear-gradient(135deg, ${currentPalette.colors.accent}15, ${currentPalette.colors.primary}10)`,
                padding: '16px',
                borderRadius: '16px',
                border: `1px solid ${currentPalette.colors.border}`,
                textAlign: 'center'
              }}>
                <div style={{ 
                  fontSize: '24px', 
                  fontWeight: '800',
                  color: currentPalette.colors.accent,
                  marginBottom: '4px'
                }}>
                  {selectedBuilding.height}m
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  color: currentPalette.colors.textLight,
                  fontWeight: '600'
                }}>
                  Height
                </div>
              </div>
            </div>

            {/* Architectural Period */}
            <div style={{
              background: `linear-gradient(135deg, ${currentPalette.colors.primary}08, transparent)`,
              padding: '20px',
              borderRadius: '16px',
              marginBottom: '24px',
              border: `1px solid ${currentPalette.colors.border}`
            }}>
              <h3 style={{ 
                margin: '0 0 12px 0', 
                color: currentPalette.colors.text,
                fontSize: '18px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Calendar size={18} style={{ marginRight: '8px', color: currentPalette.colors.primary }} />
                Architectural Period
              </h3>
              <p style={{ 
                margin: 0, 
                color: currentPalette.colors.textLight,
                fontSize: '16px',
                lineHeight: '1.5'
              }}>
                <strong style={{ color: currentPalette.colors.text }}>
                  {getArchitecturalPeriod(selectedBuilding.year_i)}
                </strong> • 
                This building represents the {selectedBuilding.style || getArchitecturalPeriod(selectedBuilding.year_i)} 
                architectural style characteristic of {getArchitecturalPeriod(selectedBuilding.year_i).toLowerCase()} 
                Vienna, showcasing the design principles and construction techniques of its era.
              </p>
            </div>

            {/* Historical Context */}
            <div style={{
              background: `linear-gradient(135deg, ${currentPalette.colors.secondary}08, transparent)`,
              padding: '20px',
              borderRadius: '16px',
              marginBottom: '24px',
              border: `1px solid ${currentPalette.colors.border}`
            }}>
              <h3 style={{ 
                margin: '0 0 12px 0', 
                color: currentPalette.colors.text,
                fontSize: '18px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Clock size={18} style={{ marginRight: '8px', color: currentPalette.colors.secondary }} />
                Historical Significance
              </h3>
              <p style={{ 
                margin: 0, 
                color: currentPalette.colors.textLight,
                fontSize: '16px',
                lineHeight: '1.6'
              }}>
                Constructed during the {getArchitecturalPeriod(selectedBuilding.year_i)} period, this landmark 
                has witnessed over {getBuildingAge(selectedBuilding.year_i)} years of Vienna's rich history. 
                Located in the Innere Stadt district, it stands as a testament to the 
                architectural mastery and cultural heritage of imperial Austria.
              </p>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '12px',
              marginTop: '24px'
            }}>
              <button
                onClick={() => setShowInfoCard(false)}
                style={{
                  flex: 1,
                  background: `linear-gradient(135deg, ${currentPalette.colors.primary}, ${currentPalette.colors.secondary})`,
                  color: 'white',
                  border: 'none',
                  padding: '16px 24px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
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
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
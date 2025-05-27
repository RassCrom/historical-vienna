import { Filter, Eye, EyeOff } from 'lucide-react';

const ButtonsCard = ({
    setShowFilters, showFilters, currentPalette,
    iconSize, setIsLegendCollapsed, isLegendCollapsed,

}) => {
  return (
    <>
      {/* Floating Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '12px',
              zIndex: 1000
            }}>
              <button
                onClick={() => setShowFilters(!showFilters)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: currentPalette.colors.cardBgGlass,
                  border: `1px solid ${currentPalette.colors.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  backdropFilter: 'blur(12px)',
                  boxShadow: `0 8px 32px ${currentPalette.colors.shadow}`,
                  color: currentPalette.colors.primary,
                  padding: `0.3rem 0.6rem`
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px) scale(1.05)';
                  e.target.style.boxShadow = `0 12px 48px ${currentPalette.colors.shadow}`;
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = `0 8px 32px ${currentPalette.colors.shadow}`;
                }}
              >
                <Filter size={iconSize} />
              </button>

              <button
                onClick={() => setIsLegendCollapsed(!isLegendCollapsed)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: currentPalette.colors.cardBgGlass,
                  border: `1px solid ${currentPalette.colors.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  backdropFilter: 'blur(12px)',
                  boxShadow: `0 8px 32px ${currentPalette.colors.shadow}`,
                  color: currentPalette.colors.primary,
                  padding: `0.3rem 0.6rem`
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px) scale(1.05)';
                  e.target.style.boxShadow = `0 12px 48px ${currentPalette.colors.shadow}`;
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = `0 8px 32px ${currentPalette.colors.shadow}`;
                }}
              >
                {isLegendCollapsed ? <Eye size={iconSize} /> : <EyeOff size={iconSize} />}
              </button>
            </div>
    </>
  );
};

export default ButtonsCard;
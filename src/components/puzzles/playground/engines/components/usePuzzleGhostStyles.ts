
export function getPuzzleGhostStyles(imageUrl: string) {
  return {
    wrapper: {
      position: 'relative',
      width: '100%',
      maxWidth: '700px',
      aspectRatio: '1 / 1',
      margin: '0 auto',
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      borderRadius: '0.5rem',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    } as React.CSSProperties,
    ghost: {
      position: 'absolute',
      inset: 0,
      zIndex: 1,
      backgroundImage: `url(${imageUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      opacity: 0.18,
      pointerEvents: 'none' as React.CSSProperties['pointerEvents'],
      transition: 'opacity 0.2s'
    } as React.CSSProperties,
    puzzle: {
      position: 'relative',
      zIndex: 2,
    } as React.CSSProperties,
  };
}

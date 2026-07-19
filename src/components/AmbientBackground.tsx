export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Top-left mint blob */}
      <div
        className="absolute animate-drift"
        style={{
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 168, 150, 0.15) 0%, transparent 70%)',
          top: '-10%',
          left: '-10%',
          filter: 'blur(80px)',
        }}
      />
      {/* Right blue blob */}
      <div
        className="absolute animate-drift-slow"
        style={{
          width: '800px',
          height: '800px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 136, 204, 0.12) 0%, transparent 70%)',
          top: '20%',
          right: '-20%',
          filter: 'blur(100px)',
        }}
      />
      {/* Bottom-center teal blob */}
      <div
        className="absolute animate-drift-medium"
        style={{
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 168, 150, 0.08) 0%, transparent 70%)',
          bottom: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          filter: 'blur(80px)',
        }}
      />
    </div>
  );
}

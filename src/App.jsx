import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import katex from 'katex';

// Helper component to render KaTeX string
function Latex({ math }) {
  const html = katex.renderToString(math, { 
    throwOnError: false,
    displayMode: true // Enforces display math layout with proper vertical spacing
  });
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function App() {
  const [pL, setPL] = useState(65);
  const [pNotL, setPNotL] = useState(20);
  const [a, setA] = useState(2);
  const [mu, setMu] = useState(1.2);
  const [showFormula, setShowFormula] = useState(false);

  // Math conversions
  const plVal = Number(pL) / 100;
  const pNotLVal = Number(pNotL) / 100;
  const aVal = Number(a);
  const muVal = Number(mu);

  const denominatorNotL = 1 + 0.5 * aVal;
  const effectiveLikability = plVal - (pNotLVal / denominatorNotL);
  const exponentTerm = (effectiveLikability * muVal * Math.pow(1.25, aVal)) - 1;

  const pSuccess = 1 / (1 + Math.exp(-exponentTerm));
  const successPercentage = (pSuccess * 100).toFixed(1);

  // Trigger celebratory confetti on high probability
  useEffect(() => {
    if (pSuccess >= 0.85) {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
    }
  }, [pSuccess]);

  const getStatus = (val) => {
    if (val >= 75) return { label: '🔥 Locked In', color: '#10B981' };
    if (val >= 45) return { label: '⚡ Promising', color: '#F59E0B' };
    return { label: '⚠️ It\'s So Over', color: '#EF4444' };
  };

  const status = getStatus(successPercentage);

  // LaTeX string representation with live variables inserted
const rawLatex = `
\\begin{aligned}
P(\\text{Success}) &= \\frac{1}{1 + e^{-y}} \\[8pt]
y &= \\left[ \\left( P(L) - \\frac{\\varnothing}{1 + 0.5a} \\right) \\cdot \\mu \\cdot (1.25)^a - 1 \\right]
\\end{aligned}
`; 

const liveLatex = `
\\begin{aligned}
P(\\text{Success}) &= \\frac{1}{1 + e^{-y}} \\[8pt]
y &= \\left[ \\left( ${plVal} - \\frac{${pNotLVal}}{1 + 0.5(${aVal})} \\right) \\cdot ${muVal} \\cdot (1.25)^{${aVal}} - 1 \\right] = ${exponentTerm.toFixed(2)}
\\end{aligned}
`;

  return (
    <div style={styles.container}>
      {/* Dynamic Background Glow */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }} 
        transition={{ duration: 6, repeat: Infinity }}
        style={{ ...styles.glow, backgroundColor: status.color }}
      />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={styles.card}
      >
        <header style={styles.header}>
          <span style={{ fontSize: '0.85rem', letterSpacing: '2px', color: '#9CA3AF', textTransform: 'uppercase' }}>
            Quantum Dating Protocol
          </span>
          <h1 style={styles.title}>Probability Engine</h1>
        </header>

        {/* Display Badge & Output */}
        <div style={styles.outputContainer}>
          <motion.span 
            key={status.label}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ ...styles.badge, backgroundColor: `${status.color}22`, color: status.color, borderColor: `${status.color}44` }}
          >
            {status.label}
          </motion.span>

          <div style={styles.scoreRow}>
            <AnimatePresence mode="popLayout">
              <motion.span
                key={successPercentage}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                style={{ ...styles.score, color: status.color }}
              >
                {successPercentage}%
              </motion.span>
            </AnimatePresence>
          </div>

          <p style={styles.subtext}>Raw Value: {pSuccess.toFixed(4)}</p>
        </div>

        {/* Formula Toggle Drawer */}
        <div style={{ marginBottom: '1.5rem' }}>
          <button 
            onClick={() => setShowFormula(!showFormula)}
            style={styles.drawerToggle}
          >
            {showFormula ? 'Hide Formula Breakdown ▲' : 'View Formula Breakdown ▼'}
          </button>

          <AnimatePresence>
            {showFormula && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={styles.drawerContent}
              >
                <div style={{ fontSize: '0.9rem', overflowX: 'auto', padding: '8px 0', textAlign: 'center' }}>
                  <Latex math={rawLatex} />
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '8px', paddingTop: '8px', fontSize: '0.8rem', color: '#9CA3AF', overflowX: 'auto', textAlign: 'center' }}>
                  <strong>Evaluated State:</strong><br />
                  <Latex math={liveLatex} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div style={styles.controls}>
          <ControlSlider label="P(L) — Chance They Like You" value={pL} setValue={setPL} min={0} max={100} unit="%" />
          <ControlSlider label="Ø — Chance They Don't Like You" value={pNotL} setValue={setPNotL} min={0} max={100} unit="%" />
          <ControlSlider label="a — Number of Good Dates" value={a} setValue={setA} min={0} max={10} unit=" dates" />
          <ControlSlider label="μ — Rizz Factor" value={mu} setValue={setMu} min={0.1} max={10.0} step={0.1} unit="x" />
        </div>
      </motion.div>
    </div>
  );
}

function ControlSlider({ label, value, setValue, min, max, step = 1, unit }) {
  return (
    <div style={styles.sliderGroup}>
      <div style={styles.sliderHeader}>
        <span style={styles.sliderLabel}>{label}</span>
        <motion.span key={value} initial={{ scale: 1.2 }} animate={{ scale: 1 }} style={styles.sliderVal}>
          {value}{unit}
        </motion.span>
      </div>
      <input 
        type="range" min={min} max={max} step={step} value={value} 
        onChange={(e) => setValue(e.target.value)} style={styles.slider}
      />
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#090D16',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: '#F9FAFB'
  },
  glow: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    filter: 'blur(100px)',
    pointerEvents: 'none',
    top: '20%',
    left: 'calc(50% - 200px)',
  },
  card: {
    width: '100%',
    maxWidth: '440px',
    backgroundColor: 'rgba(17, 24, 39, 0.75)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '2rem',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  header: { textAlign: 'center', marginBottom: '1.5rem' },
  title: { margin: '4px 0 0', fontSize: '1.5rem', fontWeight: '700', color: '#FFFFFF' },
  outputContainer: {
    textAlign: 'center',
    padding: '1.25rem',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    marginBottom: '1rem',
  },
  badge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '600',
    border: '1px solid',
    marginBottom: '0.5rem',
  },
  scoreRow: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60px' },
  score: { fontSize: '3.25rem', fontWeight: '800', letterSpacing: '-1px' },
  subtext: { margin: '4px 0 0', fontSize: '0.75rem', color: '#6B7280' },
  drawerToggle: {
    width: '100%',
    background: 'none',
    border: 'none',
    color: '#60A5FA',
    fontSize: '0.8rem',
    cursor: 'pointer',
    textAlign: 'center',
    padding: '4px',
  },
  drawerContent: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: '12px',
    padding: '16px 8px',
    marginTop: '8px',
    overflowX: 'auto', // Adds smooth horizontal scroll if screen is very narrow
    border: '1px solid rgba(255, 255, 255, 0.08)',
    lineHeight: '1.8'
  },
  controls: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  sliderGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  sliderHeader: { display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' },
  sliderLabel: { color: '#D1D5DB' },
  sliderVal: { fontWeight: '600', color: '#60A5FA' },
  slider: { width: '100%', accentColor: '#3B82F6', cursor: 'pointer' }
};
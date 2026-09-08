import { useState } from 'react';
import './App.css';

function App() {
  // Input state values
  const [pL, setPL] = useState(50);     // P(L): Chance they like you (%)
  const [pNotL, setPNotL] = useState(50); // Ø: Chance they don't like you (%)
  const [a, setA] = useState(1);       // a: Number of good dates
  const [mu, setMu] = useState(1);     // μ: Rizz factor

  // Convert inputs to numbers
  const plVal = Number(pL) / 100;       // Percentage to decimal
  const pNotLVal = Number(pNotL) / 100; // Percentage to decimal
  const aVal = Number(a);
  const muVal = Number(mu);

  // Math components
  const denominatorNotL = 1 + 0.5 * aVal;
  const effectiveLikability = plVal - (pNotLVal / denominatorNotL);
  const exponentTerm = (effectiveLikability * muVal * Math.pow(1.25, aVal)) - 1;

  // Final P(Success) using standard sigmoid logistic function
  const pSuccess = 1 / (1 + Math.exp(-exponentTerm));
  const successPercentage = (pSuccess * 100).toFixed(2);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '450px', margin: 'auto' }}>
      <h2>Success Probability Calculator</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
        <label>
          <strong>P(L)</strong> - Chance they like you (%):
          <input 
            type="number" 
            min="0"
            max="100"
            value={pL} 
            onChange={(e) => setPL(e.target.value)} 
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </label>

        <label>
          <strong>Ø</strong> - Chance they don't like you (%):
          <input 
            type="number" 
            min="0"
            max="100"
            value={pNotL} 
            onChange={(e) => setPNotL(e.target.value)} 
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </label>

        <label>
          <strong>a</strong> - Number of good dates:
          <input 
            type="number" 
            min="0"
            value={a} 
            onChange={(e) => setA(e.target.value)} 
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </label>

        <label>
          <strong>μ</strong> - Rizz factor:
          <input 
            type="number" 
            step="0.1"
            value={mu} 
            onChange={(e) => setMu(e.target.value)} 
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </label>
      </div>

      {/* Output Display */}
      <div style={{ marginTop: '2rem', padding: '1.2rem', backgroundColor: '#f4f4f5', borderRadius: '8px', textAlign: 'center' }}>
        <h3 style={{ margin: 0, color: '#111827' }}>
          P(Success): {successPercentage}%
        </h3>
        <p style={{ margin: '8px 0 0', color: '#6b7280', fontSize: '0.9rem' }}>
          Raw Probability: {pSuccess.toFixed(4)}
        </p>
      </div>
    </div>
  );
}

export default App;
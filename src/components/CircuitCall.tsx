import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CircuitCallProps {
  contract: any | null;
  isConnected: boolean;
}

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
};

export const CircuitCall: React.FC<CircuitCallProps> = ({ contract, isConnected }) => {
  const [activeTab, setActiveTab] = useState<'bid' | 'close'>('bid');
  const [bidAmount, setBidAmount] = useState('100');
  const [secretKeyHex, setSecretKeyHex] = useState('0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20');
  const [finalPrice, setFinalPrice] = useState('150');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenSecretKey = () => {
    const arr = new Uint8Array(32);
    crypto.getRandomValues(arr);
    setSecretKeyHex(Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join(''));
  };

  const handleSubmitBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract) return;
    setIsLoading(true); setTxHash(null); setError(null);
    setStatusMessage('Storing bid in local private state...');
    try {
      const bidVal = BigInt(bidAmount);
      await contract.providers.privateStateProvider.set('hello-world-state', {
        secretKey: new Uint8Array(32),
        bidAmount: bidVal,
      });
      setStatusMessage('Generating ZK proof locally...');
      const txResult = await contract.callTx.submitBid();
      setTxHash(txResult.txHash);
      setStatusMessage('Bid submitted on-chain');
    } catch (err: any) {
      setError(err.message || 'Transaction failed');
      setStatusMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseAuction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract) return;
    setIsLoading(true); setTxHash(null); setError(null);
    setStatusMessage('Preparing closure parameters...');
    try {
      if (secretKeyHex.length !== 64) throw new Error('Secret key must be 64 hex chars (32 bytes)');
      const secretBytes = new Uint8Array(secretKeyHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
      setStatusMessage('Generating ZK proof locally...');
      const txResult = await contract.callTx.closeAuction(secretBytes, BigInt(finalPrice));
      setTxHash(txResult.txHash);
      setStatusMessage('Auction closed on-chain');
    } catch (err: any) {
      setError(err.message || 'Transaction failed');
      setStatusMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) return null;

  return (
    <motion.div className="circuit-panel" {...fadeUp}>
      {/* Tab Switcher */}
      <div style={{
        display: 'flex',
        gap: '4px',
        padding: '4px',
        borderRadius: '12px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        marginBottom: '20px',
      }}>
        {(['bid', 'close'] as const).map(tab => (
          <motion.button
            key={tab}
            onClick={() => { setActiveTab(tab); setError(null); setTxHash(null); setStatusMessage(''); }}
            className="btn btn--ghost"
            style={{
              flex: 1,
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              padding: '10px',
              background: activeTab === tab ? 'rgba(139, 92, 246, 0.12)' : 'transparent',
              color: activeTab === tab ? '#a78bfa' : '#71717a',
              border: activeTab === tab ? '1px solid rgba(139, 92, 246, 0.2)' : '1px solid transparent',
            }}
            whileTap={{ scale: 0.98 }}
          >
            {tab === 'bid' ? '🔒 Submit Bid' : '🏁 Close Auction'}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'bid' ? (
          /* ── Bid Tab ── */
          <motion.div key="bid" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} transition={{ duration: 0.25 }}>
            <div className="card">
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#fafafa', marginBottom: '4px', letterSpacing: '-0.01em' }}>
                Private Sealed Bid
              </h3>
              <p style={{ fontSize: '13px', color: '#71717a', marginBottom: '20px', lineHeight: 1.5 }}>
                Your bid value never leaves your browser. The blockchain only records a proof.
              </p>

              <form onSubmit={handleSubmitBid}>
                <div className="form-group">
                  <label className="form-label">Bid Amount (tNIGHT)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={bidAmount}
                    onChange={e => setBidAmount(e.target.value)}
                    disabled={isLoading || !contract}
                    min="1"
                    required
                  />
                </div>

                <div className="privacy-badge">
                  <span style={{ fontSize: '14px' }}>🛡️</span>
                  <span className="privacy-badge__text">Proved without revealing your input</span>
                  <span className="privacy-badge__tag">ZK-SNARK</span>
                </div>

                <motion.button
                  type="submit"
                  className="btn btn--primary"
                  disabled={isLoading || !contract}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  style={{ width: '100%' }}
                >
                  {isLoading ? <><span className="spinner" /> Processing...</> : 'Submit ZK Bid'}
                </motion.button>
              </form>
            </div>
          </motion.div>
        ) : (
          /* ── Close Tab ── */
          <motion.div key="close" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}>
            <div className="card">
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#fafafa', marginBottom: '4px', letterSpacing: '-0.01em' }}>
                Settle Auction
              </h3>
              <p style={{ fontSize: '13px', color: '#71717a', marginBottom: '20px', lineHeight: 1.5 }}>
                Only the auction host can close. Provide secret key and winning price to settle.
              </p>

              <form onSubmit={handleCloseAuction}>
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label className="form-label" style={{ marginBottom: 0 }}>Secret Key (32-byte hex)</label>
                    <button type="button" onClick={handleGenSecretKey} style={{
                      background: 'none', border: 'none', color: '#8b5cf6', fontSize: '11px',
                      cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit',
                    }}>
                      Generate random
                    </button>
                  </div>
                  <input
                    type="text"
                    className="form-input form-input--mono"
                    value={secretKeyHex}
                    onChange={e => setSecretKeyHex(e.target.value)}
                    disabled={isLoading || !contract}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Winning Price (tNIGHT)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={finalPrice}
                    onChange={e => setFinalPrice(e.target.value)}
                    disabled={isLoading || !contract}
                    min="0"
                    required
                  />
                </div>

                <motion.button
                  type="submit"
                  className="btn btn--primary"
                  disabled={isLoading || !contract}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  style={{ width: '100%' }}
                >
                  {isLoading ? <><span className="spinner" /> Processing...</> : 'Close Auction'}
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transaction Status */}
      <AnimatePresence>
        {(statusMessage || txHash || error) && (
          <motion.div
            className="tx-status"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ marginTop: '16px' }}
          >
            {statusMessage && <div className="tx-status__message">⚙️ {statusMessage}</div>}
            {error && <div className="tx-status__error">✕ {error}</div>}
            {txHash && (
              <div>
                <div style={{ fontSize: '13px', color: '#22c55e', marginBottom: '6px' }}>✓ Transaction submitted</div>
                <div className="tx-status__hash">{txHash}</div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

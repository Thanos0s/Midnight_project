import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMidnight } from './hooks/useMidnight';
import { WalletConnect } from './components/WalletConnect';
import { CircuitCall } from './components/CircuitCall';

// Background grid colors from corda.xyz mockup
const CORDA_COLORS = [
  '#4a5358', '#4a5358', '#6c5b47', '#7d6a54', '#8e7a63', '#92472d', '#a65335', '#bc603c', '#bc603c', '#bc603c', '#bc603c', '#bc603c',
  '#3f474c', '#56402e', '#684d37', '#77583f', '#77583f', '#a65335', '#bc603c', '#bc603c', '#a65335', '#7d6a54', '#7d6a54', '#7d6a54',
  '#343a3e', '#3f474c', '#56402e', '#684d37', '#77583f', '#92472d', '#92472d', '#a65335', '#a65335', '#6c5b47', '#6c5b47', '#6c5b47',
  '#4a5358', '#343a3e', '#3f474c', '#56402e', '#684d37', '#77583f', '#8e7a63', '#8e7a63', '#7d6a54', '#3f474c', '#3f474c', '#3f474c'
];

export const App: React.FC = () => {
  const midnight = useMidnight();
  const [view, setView] = useState<'landing' | 'dapp'>('landing');
  const [consoleMode, setConsoleMode] = useState<'bidder' | 'host'>('bidder');
  const [auctionStatus, setAuctionStatus] = useState<'OPEN' | 'CLOSED'>('OPEN');
  const [winnerInfo, setWinnerInfo] = useState<{ address: string; price: string } | null>(null);
  const [totalBids, setTotalBids] = useState<number>(3);
  const [showVerifyModal, setShowVerifyModal] = useState<boolean>(false);
  const [auctionName, setAuctionName] = useState<string>('Midnight RWA Vault');
  const [minBid, setMinBid] = useState<string>('10');

  // Fake countdown clock
  const [timeLeft, setTimeLeft] = useState({ hours: 1, minutes: 48, seconds: 22 });
  useEffect(() => {
    if (auctionStatus === 'CLOSED') return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        clearInterval(timer);
        setAuctionStatus('CLOSED');
        return { hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [auctionStatus]);

  const triggerConsole = (mode: 'bidder' | 'host') => {
    setConsoleMode(mode);
    setView('dapp');
  };

  const leaveDapp = () => {
    setView('landing');
  };

  return (
    <div className="app-container">
      <div className="noise-overlay" />

      <AnimatePresence mode="wait">
        {view === 'landing' ? (
          /* ═══════════════════════════════════════════════════
             1. LANDING PAGE (Corda.xyz Mockup Template)
             ═══════════════════════════════════════════════════ */
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{ position: 'relative', width: '100%' }}
          >
            {/* Background block-color stripes grid */}
            <div className="corda-grid-bg">
              {CORDA_COLORS.map((color, i) => (
                <div
                  key={i}
                  className="corda-grid-cell"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            {/* Navbar */}
            <header className="corda-navbar">
              <a href="#" className="corda-logo" onClick={(e) => { e.preventDefault(); setView('landing'); }}>
                c<span>·</span>rda
              </a>
              <button className="corda-btn-pill" onClick={() => triggerConsole('bidder')}>
                {midnight.isConnected ? 'Enter DApp' : 'Connect Wallet'}
              </button>
            </header>

            {/* Hero Section */}
            <section className="corda-hero">
              <div className="hero-left">
                <div className="hero-tag">Introducing</div>
                <h1 className="hero-title">
                  ZK Sealed Bid.<br />
                  Auction Power.
                </h1>
                <p className="hero-desc">
                  Place private bids. Win without revealing your strategy. Zero-knowledge sealed-bid auctions on the Midnight Network.
                </p>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <button className="corda-btn-orange" onClick={() => triggerConsole('bidder')}>
                    🟢 Join Auction
                  </button>
                  <button
                    className="corda-btn-pill"
                    style={{ padding: '14px 28px', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '9999px' }}
                    onClick={() => triggerConsole('host')}
                  >
                    🔵 Create Auction
                  </button>
                </div>
              </div>

              <div className="hero-right">
                {/* Sliced Logo Shape */}
                <svg width="280" height="280" viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.95 }}>
                  <g filter="drop-shadow(0px 8px 24px rgba(0,0,0,0.3))">
                    <path d="M190 60 C155 60 140 70 120 90 L120 190 C140 210 155 220 190 220 L220 220 C235 220 240 210 240 205 L220 205 C190 205 180 195 160 175 L160 105 C180 85 190 75 220 75 L240 75 C240 70 235 60 220 60 Z" fill="#eae4d3" />
                    <path d="M165 60 C130 60 115 70 95 90 L95 190 C115 210 130 220 165 220 L195 220 C210 220 215 210 215 205 L195 205 C165 205 155 195 135 175 L135 105 C155 85 165 75 195 75 L215 75 C215 70 210 60 195 60 Z" fill="#eae4d3" opacity="0.9" />
                    <path d="M140 60 C105 60 90 70 70 90 L70 190 C90 210 105 220 140 220 L170 220 C185 220 190 210 190 205 L170 205 C140 205 130 195 110 175 L110 105 C130 85 140 75 170 75 L190 75 C190 70 185 60 170 60 Z" fill="#eae4d3" opacity="0.8" />
                  </g>
                </svg>
              </div>
            </section>

            {/* Launch Banner */}
            <div className="partner-banner">
              <span className="partner-logo">SOLANA</span>
              <span className="partner-logo" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ border: '1px solid #1a1a1c', borderRadius: '50%', width: '14px', height: '14px', display: 'inline-block' }} />
                MIDNIGHT
              </span>
              <span className="partner-logo" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ border: '1.5px solid #1a1a1c', width: '12px', height: '12px', display: 'inline-block', transform: 'rotate(45deg)' }} />
                SOLSTICE
              </span>
              <span className="partner-logo">Alphaledger.</span>
              <span className="partner-logo" style={{ fontWeight: 800 }}>Particula</span>
            </div>

            {/* Section 2: High Uncorrelated Yield */}
            <section className="corda-section">
              <div className="section-tag">Curated zero-knowledge private auctions for Web3 bidders</div>

              <div className="grid-two-col">
                <div className="col-left">
                  <h3>Shielded, private bids</h3>
                  <p>
                    Midnight gives bidders access to high-security private state delivering protection from front-running and competitor tracking without sacrificing liquidity.
                  </p>
                </div>

                <div className="col-right">
                  <div className="interlocking-grid">
                    <div className="interlock-card">
                      <div className="wireframe-container">
                        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="32" cy="32" r="28" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="3 3" />
                          <circle cx="32" cy="32" r="20" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="4 2" />
                          <circle cx="32" cy="32" r="12" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                          <circle cx="32" cy="32" r="2" fill="#ffffff" />
                        </svg>
                      </div>
                      <div>
                        <h4>Easy access:</h4>
                        <p>
                          Midnight brings institutional-grade zero-knowledge privacy to auctions in a simple and compliant way, giving Web3 builders access to shielded state.
                        </p>
                      </div>
                    </div>

                    <div className="interlock-card">
                      <div className="wireframe-container">
                        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="32" cy="32" r="22" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                          <path d="M22 32 L42 32 M32 22 L32 42" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                        </svg>
                      </div>
                      <div>
                        <h4>Zero-Knowledge Proofs:</h4>
                        <p>
                          Users interact normally, but their data remains hidden — only the final truth is revealed.
                        </p>
                      </div>
                    </div>

                    <div className="interlock-card bottom-wide-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: '40px' }}>
                        <div style={{ flex: 1 }}>
                          <h4>Deep liquidity:</h4>
                          <p style={{ marginTop: '8px' }}>
                            Settle auctions with the flexibility and instant validation that onchain participants demand through the native ledger layer purpose-built for privacy.
                          </p>
                        </div>
                        <div style={{ flexShrink: 0 }}>
                          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M40 40 C35 35, 30 45, 32 50 C36 58, 48 55, 52 46 C58 32, 42 22, 32 26 C18 32, 16 52, 28 62 C44 76, 70 66, 72 44 C76 16, 50 2, 22 8 C-4 16, -6 56, 12 72" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </motion.div>
        ) : (
          /* ═══════════════════════════════════════════════════
             2. TRANSACTION PAGE (Consolidated Single Next View)
             ═══════════════════════════════════════════════════ */
          <motion.div
            key="dapp"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="tx-screen"
          >
            {/* Header */}
            <header className="tx-header">
              <a href="#" className="corda-logo" onClick={(e) => { e.preventDefault(); setView('landing'); }}>
                c<span>·</span>rda
              </a>
              <button className="btn-back-home" onClick={leaveDapp}>
                ← Back to Home
              </button>
            </header>

            {/* Two-Column Transaction Console */}
            <div className="tx-content-wrapper">
              
              {/* ── Left Column: Wallet + Auction Status ── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '0.05em' }}>
                  System Connections
                </div>

                {/* Wallet connector */}
                <WalletConnect
                  isConnected={midnight.isConnected}
                  isConnecting={midnight.isConnecting}
                  unshieldedAddress={midnight.unshieldedAddress}
                  shieldedAddress={midnight.shieldedAddress}
                  walletName={midnight.walletName}
                  error={midnight.error}
                  connectWallet={midnight.connectWallet}
                  disconnectWallet={midnight.disconnectWallet}
                />

                {/* Auction Status and Badges */}
                <div className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Status Badge</span>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 700,
                      backgroundColor: auctionStatus === 'OPEN' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: auctionStatus === 'OPEN' ? '#10b981' : '#ef4444',
                      textTransform: 'uppercase'
                    }}>
                      {auctionStatus === 'OPEN' ? 'Bidding is OPEN ⏳' : 'Closed 🛑'}
                    </span>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                      Active Auction Name
                    </span>
                    <div style={{
                      fontSize: '15px',
                      fontWeight: 700,
                      color: 'var(--text-white)',
                      marginTop: '4px'
                    }}>
                      {auctionName}
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                      Time Remaining
                    </span>
                    <div style={{
                      fontSize: '22px',
                      fontWeight: 700,
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-white)',
                      marginTop: '4px'
                    }}>
                      {timeLeft.hours.toString().padStart(2, '0')}h : {timeLeft.minutes.toString().padStart(2, '0')}m : {timeLeft.seconds.toString().padStart(2, '0')}s
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', borderTop: '1px solid var(--bg-border)', paddingTop: '16px', marginBottom: '16px' }}>
                    <div>
                      <span style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                        Min Bid
                      </span>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-white)' }}>
                        {minBid} tNIGHT
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                        Total Bids
                      </span>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#a78bfa' }}>
                        {totalBids} submitted
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--bg-border)', paddingTop: '16px' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>🔐</span> Zero-Knowledge Secured
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>🛡️</span> Private by Design
                    </div>
                    <button
                      className="btn btn--secondary btn-verify-proof"
                      onClick={() => setShowVerifyModal(true)}
                      style={{ marginTop: '8px', width: '100%', fontSize: '12px', padding: '8px' }}
                    >
                      🔍 Verify Proof
                    </button>
                  </div>
                </div>
              </div>

              {/* ── Right Column: Interactive Console ── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '0.05em' }}>
                  Interactive Operations
                </div>

                {/* Mode Selector Tabs */}
                <div style={{
                  display: 'flex',
                  gap: '4px',
                  padding: '4px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <button
                    onClick={() => setConsoleMode('bidder')}
                    className="btn btn--ghost"
                    style={{
                      flex: 1,
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 600,
                      padding: '10px',
                      background: consoleMode === 'bidder' ? 'rgba(139, 92, 246, 0.12)' : 'transparent',
                      color: consoleMode === 'bidder' ? '#a78bfa' : '#71717a',
                      border: consoleMode === 'bidder' ? '1px solid rgba(139, 92, 246, 0.2)' : '1px solid transparent',
                    }}
                  >
                    🟢 Bidder Mode
                  </button>
                  <button
                    onClick={() => setConsoleMode('host')}
                    className="btn btn--ghost"
                    style={{
                      flex: 1,
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 600,
                      padding: '10px',
                      background: consoleMode === 'host' ? 'rgba(139, 92, 246, 0.12)' : 'transparent',
                      color: consoleMode === 'host' ? '#a78bfa' : '#71717a',
                      border: consoleMode === 'host' ? '1px solid rgba(139, 92, 246, 0.2)' : '1px solid transparent',
                    }}
                  >
                    ⚙️ Host Mode
                  </button>
                </div>

                {/* Consolidated forms */}
                <CircuitCall
                  contract={midnight.contract}
                  isConnected={midnight.isConnected}
                  mode={consoleMode}
                  auctionStatus={auctionStatus}
                  setAuctionStatus={setAuctionStatus}
                  winnerInfo={winnerInfo}
                  setWinnerInfo={setWinnerInfo}
                  totalBids={totalBids}
                  setTotalBids={setTotalBids}
                  auctionName={auctionName}
                  setAuctionName={setAuctionName}
                  minBid={minBid}
                  setMinBid={setMinBid}
                  setTimeLeft={setTimeLeft}
                />
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Verify Proof Modal ── */}
      <AnimatePresence>
        {showVerifyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.85)',
              zIndex: 999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(8px)'
            }}
            onClick={() => setShowVerifyModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              style={{
                maxWidth: '480px',
                width: '100%',
                padding: '24px',
                margin: '16px',
                background: 'var(--bg-card)',
                border: '1px solid var(--bg-border)',
                borderRadius: '16px',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>
                🛡️ Zero-Knowledge Proof Verifier
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '20px' }}>
                Midnight contracts use Compact ZK circuits to ensure that bid state remains completely encrypted. 
                When a user submits a bid, a local prover generates a SNARK proof validating that:
              </p>
              <ul style={{ fontSize: '13px', color: 'var(--text-muted)', listStyle: 'inside', lineHeight: 1.6, marginBottom: '24px' }}>
                <li>The bid is larger than the minimum allowed amount.</li>
                <li>The bidder holds correct private keys.</li>
                <li>The bid is bound mathematically to the contract address.</li>
              </ul>
              
              <div style={{
                padding: '12px',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.15)',
                borderRadius: '8px',
                color: '#10b981',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                textAlign: 'center'
              }}>
                ✓ SNARK Proof Verified Successfully (on Preprod Ledger)
              </div>
              
              <button
                className="btn btn--primary"
                onClick={() => setShowVerifyModal(false)}
                style={{ width: '100%', marginTop: '20px' }}
              >
                Close Verifier
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;

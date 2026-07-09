import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMidnight } from './hooks/useMidnight';
import { WalletConnect } from './components/WalletConnect';
import { CircuitCall } from './components/CircuitCall';

// Corda background color blocks to map the screenshot exactly
const CORDA_COLORS = [
  '#4a5358', '#4a5358', '#6c5b47', '#7d6a54', '#8e7a63', '#92472d', '#a65335', '#bc603c', '#bc603c', '#bc603c', '#bc603c', '#bc603c',
  '#3f474c', '#56402e', '#684d37', '#77583f', '#77583f', '#a65335', '#bc603c', '#bc603c', '#a65335', '#7d6a54', '#7d6a54', '#7d6a54',
  '#343a3e', '#3f474c', '#56402e', '#684d37', '#77583f', '#92472d', '#92472d', '#a65335', '#a65335', '#6c5b47', '#6c5b47', '#6c5b47',
  '#4a5358', '#343a3e', '#3f474c', '#56402e', '#684d37', '#77583f', '#8e7a63', '#8e7a63', '#7d6a54', '#3f474c', '#3f474c', '#3f474c'
];

export const App: React.FC = () => {
  const midnight = useMidnight();
  const [view, setView] = useState<'landing' | 'dapp'>('landing');

  const enterDapp = () => {
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
             LANDING PAGE (Corda.xyz Home Replica)
             ═══════════════════════════════════════════════════ */
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{ position: 'relative', width: '100%' }}
          >
            {/* Background color blocks */}
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
              <a href="#" className="corda-logo" onClick={(e) => { e.preventDefault(); leaveDapp(); }}>
                c<span>·</span>rda
              </a>
              <button className="corda-btn-pill" onClick={enterDapp}>
                {midnight.isConnected ? 'Enter DApp' : 'Get early access'}
              </button>
            </header>

            {/* Hero Section */}
            <section className="corda-hero">
              <div className="hero-left">
                <div className="hero-tag">Introducing</div>
                <h1 className="hero-title">
                  Wall Street yield.<br />
                  Defi Power.
                </h1>
                <p className="hero-desc">
                  Institutional-grade RWA yield vaults, fully composable and integrated into Solana DeFi.
                </p>
                <div>
                  <button className="corda-btn-orange" onClick={enterDapp}>
                    Get early access
                  </button>
                </div>
              </div>

              <div className="hero-right">
                {/* Sliced C Logo shape replica */}
                <svg width="280" height="280" viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.95 }}>
                  <g filter="drop-shadow(0px 8px 24px rgba(0,0,0,0.3))">
                    {/* Repeated vertical overlapping path slices forming the C logo */}
                    <path d="M190 60 C155 60 140 70 120 90 L120 190 C140 210 155 220 190 220 L220 220 C235 220 240 210 240 205 L220 205 C190 205 180 195 160 175 L160 105 C180 85 190 75 220 75 L240 75 C240 70 235 60 220 60 Z" fill="#eae4d3" />
                    <path d="M165 60 C130 60 115 70 95 90 L95 190 C115 210 130 220 165 220 L195 220 C210 220 215 210 215 205 L195 205 C165 205 155 195 135 175 L135 105 C155 85 165 75 195 75 L215 75 C215 70 210 60 195 60 Z" fill="#eae4d3" opacity="0.9" />
                    <path d="M140 60 C105 60 90 70 70 90 L70 190 C90 210 105 220 140 220 L170 220 C185 220 190 210 190 205 L170 205 C140 205 130 195 110 175 L110 105 C130 85 140 75 170 75 L190 75 C190 70 185 60 170 60 Z" fill="#eae4d3" opacity="0.8" />
                    <path d="M115 60 C80 60 65 70 45 90 L45 190 C65 210 80 220 115 220 L145 220 C160 220 165 210 165 205 L145 205 C115 205 105 195 85 175 L85 105 C105 85 115 75 145 75 L165 75 C165 70 160 60 145 60 Z" fill="#eae4d3" opacity="0.7" />
                  </g>
                </svg>
              </div>
            </section>

            {/* Partner Logo Banner */}
            <div className="partner-banner">
              <span className="partner-logo">SOLANA</span>
              <span className="partner-logo" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ border: '1px solid #1a1a1c', borderRadius: '50%', width: '14px', height: '14px', display: 'inline-block' }} />
                KAMINO
              </span>
              <span className="partner-logo" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ border: '1.5px solid #1a1a1c', width: '12px', height: '12px', display: 'inline-block', transform: 'rotate(45deg)' }} />
                SOLSTICE
              </span>
              <span className="partner-logo">Alphaledger.</span>
              <span className="partner-logo" style={{ fontWeight: 800 }}>Particula</span>
            </div>

            {/* Curated Real World Yield Section */}
            <section className="corda-section">
              <div className="section-tag">Curated-real world yield for DeFi investors</div>

              <div className="grid-two-col">
                <div className="col-left">
                  <h3>High, uncorrelated yield</h3>
                  <p>
                    Corda gives DeFi investors access to high-quality yield delivering diversification from pure crypto assets without sacrificing returns.
                  </p>
                </div>

                <div className="col-right">
                  <div className="interlocking-grid">
                    {/* Card 1: circular wireframe */}
                    <div className="interlock-card">
                      <div className="wireframe-container">
                        {/* Animated concentric circle dots */}
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
                          Corda brings Wall Street-level yield strategies to Solana in a simple and compliant way, giving DeFi investors access to assets.
                        </p>
                      </div>
                    </div>

                    {/* Card 2: text */}
                    <div className="interlock-card">
                      <div className="wireframe-container">
                        {/* Static particles */}
                        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="32" cy="32" r="22" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                          <path d="M22 32 L42 32 M32 22 L32 42" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                        </svg>
                      </div>
                      <div>
                        <h4>Institutional standard:</h4>
                        <p>
                          Built with institutional compliance and asset safety guidelines at the forefront of development.
                        </p>
                      </div>
                    </div>

                    {/* Card 3: spiral wireframe bottom wide */}
                    <div className="interlock-card bottom-wide-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: '40px' }}>
                        <div style={{ flex: 1 }}>
                          <h4>Deep liquidity:</h4>
                          <p style={{ marginTop: '8px' }}>
                            Corda brings the flexibility and instant liquidity that onchain investors demand through the native liquidity layer purpose-built to unlock traditionally less liquid assets.
                          </p>
                        </div>
                        <div style={{ flexShrink: 0 }}>
                          {/* Animated Spiral */}
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
             DAPP TRANSACTION PAGE (Next Window Console)
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
              <a href="#" className="corda-logo" onClick={(e) => { e.preventDefault(); leaveDapp(); }}>
                c<span>·</span>rda
              </a>
              <button className="btn-back-home" onClick={leaveDapp}>
                ← Back to Home
              </button>
            </header>

            {/* DApp Console Grid */}
            <div className="tx-content-wrapper">
              {/* Left Column: Wallet Connect panel */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                  Wallet Connection
                </div>
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
              </div>

              {/* Right Column: Transaction Dashboard panel */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                  Interactive Operations
                </div>

                {!midnight.isConnected ? (
                  <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>Wallet Not Connected</h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                      Connect your 1AM wallet in the connection panel to access bidding and winner settlement operations.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Contract Loading notification */}
                    {!midnight.contract && !midnight.error && (
                      <div className="card" style={{ textAlign: 'center', padding: '24px' }}>
                        <span className="spinner" style={{ marginRight: '8px', color: 'var(--accent-purple)' }} />
                        <span style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
                          Locating deployed contract on Preprod indexer...
                        </span>
                      </div>
                    )}

                    {midnight.contract && (
                      <CircuitCall
                        contract={midnight.contract}
                        isConnected={midnight.isConnected}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMidnight } from './hooks/useMidnight';
import { WalletConnect } from './components/WalletConnect';
import { CircuitCall } from './components/CircuitCall';

export const App: React.FC = () => {
  const midnight = useMidnight();
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleNext = () => {
    if (currentPage < 5) setCurrentPage(currentPage + 1);
  };

  const handleBack = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Slide animation variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: 'easeOut' as const }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
      transition: { duration: 0.25, ease: 'easeIn' as const }
    })
  };

  return (
    <div className="app-container">
      {/* ── Top Header ── */}
      <header className="top-header">
        <div className="brand-title">
          <span className="brand-dot" />
          Midnight Auction DApp
        </div>
        {currentPage > 1 && (
          <div className="guide-step-indicator">
            Setup Guide Page {currentPage} of 5
          </div>
        )}
      </header>

      {/* ── main content slide ── */}
      <main className="slide-frame">
        <AnimatePresence mode="wait" custom={currentPage}>
          <motion.div
            key={currentPage}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            style={{ width: '100%' }}
          >
            {/* ── Page 1: Welcome ── */}
            {currentPage === 1 && (
              <div>
                <div className="terminal-block">
                  <div className="terminal-header">
                    <span>Terminal</span>
                    <span>Status</span>
                  </div>
                  <div className="terminal-content" style={{ color: '#a78bfa' }}>
                    &gt; Building your professional website...<br />
                    &gt; Installing zero-knowledge proofs &amp; components...<br />
                    &gt; Website ready!
                  </div>
                </div>
                
                <h1 className="title-primary" style={{ marginTop: '32px' }}>
                  Created by <br />
                  <span style={{ color: '#a78bfa' }}>Thanos0s</span>
                </h1>
                
                <p className="subtitle-primary">
                  Follow along. Connect and transact in minutes. No cryptography experience required.
                </p>

                <div className="protip-box">
                  <span className="protip-tag">PRO TIP</span>
                  <span>Click the Next button below to begin setting up your wallet and submitting private bids.</span>
                </div>
              </div>
            )}

            {/* ── Page 2: What You Build & Need ── */}
            {currentPage === 2 && (
              <div>
                <h2 className="title-primary">What You're Building</h2>
                <p className="subtitle-primary" style={{ marginBottom: '24px' }}>
                  A professional, animated auction website using AI and the Midnight SDK.
                </p>

                <div className="info-row">
                  <div className="info-card">
                    <h4>What You'll Need</h4>
                    <ul>
                      <li>A browser with 1AM Wallet extension</li>
                      <li>Midnight Preprod testnet active</li>
                      <li>tNIGHT test tokens</li>
                    </ul>
                  </div>

                  <div className="info-card">
                    <h4>What You'll Get</h4>
                    <ul>
                      <li>Private bids shielded locally</li>
                      <li>Framer Motion transitions</li>
                      <li>1AM Wallet v4 integration</li>
                      <li>Clean, modern Corda design</li>
                    </ul>
                  </div>
                </div>

                <div className="protip-box">
                  <span className="protip-tag">TIME</span>
                  <span>Total setup time is less than 5 minutes.</span>
                </div>
              </div>
            )}

            {/* ── Page 3: Wallet Connection ── */}
            {currentPage === 3 && (
              <div>
                <h2 className="title-primary">Connect Wallet</h2>
                <p className="subtitle-primary">
                  Verify the 1AM Wallet extension is active and set to Preprod network.
                </p>

                <div style={{ margin: '32px 0' }}>
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

                <div className="protip-box" style={{ marginTop: '24px' }}>
                  <span className="protip-tag">PRO TIP</span>
                  <span>Once connected, your public (unshielded) and private (shielded) addresses will be fetched automatically.</span>
                </div>
              </div>
            )}

            {/* ── Page 4: Interactive Transactions (Bid / Winner) ── */}
            {currentPage === 4 && (
              <div>
                <h2 className="title-primary">Interact &amp; Transact</h2>
                <p className="subtitle-primary" style={{ marginBottom: '24px' }}>
                  Submit private bids or close the auction. Zero-knowledge proofs are generated locally in your browser.
                </p>

                {!midnight.isConnected ? (
                  <div className="info-card" style={{ textAlign: 'center', padding: '40px 24px' }}>
                    <h4 style={{ color: '#ef4444' }}>⚠️ Wallet Required</h4>
                    <p style={{ marginTop: '8px' }}>
                      Please go back to Page 3 and connect your 1AM wallet before attempting to transact.
                    </p>
                  </div>
                ) : (
                  <div className="bid-panel-layout">
                    {/* Contract status */}
                    {midnight.isConnected && !midnight.contract && !midnight.error && (
                      <div className="terminal-block">
                        <div className="terminal-content" style={{ color: '#a78bfa', textAlign: 'center' }}>
                          <span className="spinner-corda" style={{ marginRight: '8px' }} />
                          Locating deployed contract on Preprod indexer...
                        </div>
                      </div>
                    )}
                    
                    {midnight.contract && (
                      <CircuitCall
                        contract={midnight.contract}
                        isConnected={midnight.isConnected}
                      />
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ── Page 5: Quick Reference ── */}
            {currentPage === 5 && (
              <div>
                <h2 className="title-primary">Quick Reference</h2>
                <p className="subtitle-primary">
                  Review the contract parameters and technical specifications of this project.
                </p>

                <div className="terminal-block">
                  <div className="terminal-header">
                    <span>Technical Reference</span>
                    <span>Preprod</span>
                  </div>
                  <div className="terminal-content" style={{ fontSize: '12px' }}>
                    <strong>Contract Address:</strong><br />
                    <span style={{ color: '#a78bfa', fontFamily: 'monospace' }}>
                      b20f8f836047ce33353b13e1e85d8dc95a55f306e876cb7b822bbaad4bb1acf6
                    </span><br /><br />
                    
                    <strong>Repository:</strong><br />
                    <a href="https://github.com/Thanos0s/Midnight_project" target="_blank" rel="noreferrer" style={{ color: '#a78bfa' }}>
                      github.com/Thanos0s/Midnight_project
                    </a><br /><br />

                    <strong>Technology Stack:</strong><br />
                    - Midnight.js SDK v4.0.4<br />
                    - Compact Privacy Contracts<br />
                    - React 18 / Vite 5 / TypeScript<br />
                    - Framer Motion Animations
                  </div>
                </div>

                <div className="protip-box">
                  <span className="protip-tag">COMPLETE</span>
                  <span>Your setup and transactions are complete. You can now publish and host this application.</span>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── Navigation Footer ── */}
      <footer className="btn-nav-container">
        <button
          className="btn-corda btn-corda--secondary"
          onClick={handleBack}
          disabled={currentPage === 1}
        >
          &lt; Back
        </button>

        <div style={{ fontSize: '13px', color: '#545459', fontFamily: 'monospace' }}>
          PAGE {currentPage} OF 5
        </div>

        <button
          className="btn-corda"
          onClick={handleNext}
          disabled={currentPage === 5}
        >
          Next &gt;
        </button>
      </footer>
    </div>
  );
};

export default App;

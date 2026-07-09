import React from 'react';
import { motion } from 'framer-motion';
import { useMidnight } from './hooks/useMidnight';
import { WalletConnect } from './components/WalletConnect';
import { CircuitCall } from './components/CircuitCall';

// ── Animation Variants ──
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as const },
});

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.8, delay },
});

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } },
};

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

const FEATURES = [
  {
    icon: '🔐',
    title: 'Zero-Knowledge Proofs',
    desc: 'Bid amounts are proven valid without ever revealing the number. Your financial intent stays private.',
  },
  {
    icon: '🌙',
    title: 'Midnight Network',
    desc: 'Built on Midnight — a privacy-focused blockchain with programmable data protection at the protocol level.',
  },
  {
    icon: '⚡',
    title: 'Browser-Side Proving',
    desc: 'ZK proofs are generated locally in your browser. No intermediary ever sees your private inputs.',
  },
  {
    icon: '🔗',
    title: '1AM Wallet',
    desc: 'Connect seamlessly with the 1AM wallet extension. Supports shielded and unshielded addresses on Preprod.',
  },
  {
    icon: '📜',
    title: 'Compact Smart Contract',
    desc: 'Auction logic written in Compact — Midnight\'s privacy-preserving smart contract language with built-in ZK circuits.',
  },
  {
    icon: '🛡️',
    title: 'Observable Privacy',
    desc: 'Others see that a bid was placed. They never see the amount. Privacy you can observe and verify.',
  },
];

export const App: React.FC = () => {
  const midnight = useMidnight();

  return (
    <>
      {/* ── Animated Background ── */}
      <div className="gradient-bg">
        <div className="gradient-orb gradient-orb--purple" />
        <div className="gradient-orb gradient-orb--blue" />
        <div className="gradient-orb gradient-orb--teal" />
      </div>
      <div className="grid-pattern" />

      {/* ── Navigation ── */}
      <motion.nav className="nav" {...fadeIn(0.1)}>
        <div className="nav__logo">
          <div className="nav__logo-icon">M</div>
          <span className="nav__logo-text">Midnight Auction</span>
          <span className="nav__logo-badge">Preprod</span>
        </div>
        <div className="nav__actions">
          {midnight.isConnected ? (
            <motion.button
              className="btn btn--secondary btn--sm"
              onClick={midnight.disconnectWallet}
              whileTap={{ scale: 0.97 }}
            >
              {midnight.walletName || '1AM'} · Disconnect
            </motion.button>
          ) : (
            <motion.button
              className="btn btn--primary btn--sm"
              onClick={() => midnight.connectWallet()}
              disabled={midnight.isConnecting}
              whileTap={{ scale: 0.97 }}
            >
              {midnight.isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </motion.button>
          )}
        </div>
      </motion.nav>

      {/* ── Hero ── */}
      <section className="hero">
        <motion.div className="hero__badge" {...fadeUp(0.2)}>
          <span className="hero__badge-dot" />
          Live on Preprod
        </motion.div>

        <motion.h1 className="hero__title" {...fadeUp(0.3)}>
          <span className="hero__title-gradient">Private Auctions</span>
          <br />
          <span className="hero__title-accent">Powered by ZK</span>
        </motion.h1>

        <motion.p className="hero__subtitle" {...fadeUp(0.4)}>
          Submit sealed bids with zero-knowledge proofs. Your bid amount stays 
          private — only the proof reaches the chain. Built on the Midnight Network.
        </motion.p>

        <motion.div className="hero__actions" {...fadeUp(0.5)}>
          {!midnight.isConnected ? (
            <motion.button
              className="btn btn--primary btn--lg"
              onClick={() => midnight.connectWallet()}
              disabled={midnight.isConnecting}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {midnight.isConnecting ? (
                <><span className="spinner" /> Connecting...</>
              ) : (
                'Connect 1AM Wallet →'
              )}
            </motion.button>
          ) : (
            <motion.button
              className="btn btn--primary btn--lg"
              onClick={() => {
                document.getElementById('interact')?.scrollIntoView({ behavior: 'smooth' });
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Start Bidding →
            </motion.button>
          )}
          <motion.a
            className="btn btn--secondary btn--lg"
            href="https://github.com/Thanos0s/Midnight_project"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            View Source
          </motion.a>
        </motion.div>

        {/* Stats */}
        <motion.div className="stats" {...fadeUp(0.65)}>
          <div className="stat">
            <div className="stat__value">ZK-SNARK</div>
            <div className="stat__label">Proof System</div>
          </div>
          <div className="stat">
            <div className="stat__value">Preprod</div>
            <div className="stat__label">Network</div>
          </div>
          <div className="stat">
            <div className="stat__value">100%</div>
            <div className="stat__label">Bid Privacy</div>
          </div>
        </motion.div>
      </section>

      {/* ── Features Section ── */}
      <section className="section">
        <motion.div
          className="section__header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
        >
          <div className="section__label">Why Private Bidding</div>
          <h2 className="section__title">Standard auctions expose your strategy.<br />This one doesn't.</h2>
        </motion.div>

        <motion.div
          className="features-grid"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-80px' }}
        >
          {FEATURES.map((f, i) => (
            <motion.div key={i} className="card feature-card" variants={staggerItem}>
              <div className="feature-card__icon">{f.icon}</div>
              <div className="feature-card__title">{f.title}</div>
              <div className="feature-card__desc">{f.desc}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Wallet + Interact Section ── */}
      <section className="section" id="interact">
        <motion.div
          className="section__header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
        >
          <div className="section__label">DApp Interface</div>
          <h2 className="section__title">
            {midnight.isConnected ? 'Connected — Ready to Bid' : 'Connect your wallet to begin'}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
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
        </motion.div>

        {/* Contract Loading */}
        {midnight.isConnected && !midnight.contract && !midnight.error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '16px',
              marginTop: '16px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              fontSize: '13px',
              color: '#a78bfa',
              maxWidth: '560px',
              margin: '16px auto 0',
            }}
          >
            <span className="spinner" />
            Locating contract on Preprod...
          </motion.div>
        )}

        {midnight.isConnected && midnight.contract && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ marginTop: '24px' }}
          >
            <CircuitCall contract={midnight.contract} isConnected={midnight.isConnected} />
          </motion.div>
        )}
      </section>

      {/* ── Contract Info Section ── */}
      <section className="section">
        <motion.div
          className="card"
          style={{ maxWidth: '560px', margin: '0 auto' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#8b5cf6', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: '12px' }}>
            Contract Details
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#52525b', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: '4px' }}>Network</div>
              <div style={{ fontSize: '14px', color: '#fafafa', fontWeight: 500 }}>Midnight Preprod</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#52525b', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: '4px' }}>Contract Address</div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
                color: '#a1a1aa',
                padding: '8px 12px',
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '6px',
                wordBreak: 'break-all' as const,
              }}>
                b20f8f836047ce33353b13e1e85d8dc95a55f306e876cb7b822bbaad4bb1acf6
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#52525b', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: '4px' }}>Language</div>
              <div style={{ fontSize: '14px', color: '#fafafa', fontWeight: 500 }}>Compact</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <p className="footer__text">
          Midnight Builder Challenge — Level 2 Submission · Built by{' '}
          <a className="footer__link" href="https://github.com/Thanos0s" target="_blank" rel="noopener noreferrer">
            Thanos0s
          </a>
        </p>
      </footer>
    </>
  );
};

export default App;

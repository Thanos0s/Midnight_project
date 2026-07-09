import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WalletConnectProps {
  isConnected: boolean;
  isConnecting: boolean;
  unshieldedAddress: string | null;
  shieldedAddress: string | null;
  walletName: string | null;
  error: string | null;
  connectWallet: (walletId?: string) => Promise<void>;
  disconnectWallet: () => Promise<void>;
}

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

export const WalletConnect: React.FC<WalletConnectProps> = ({
  isConnected,
  isConnecting,
  unshieldedAddress,
  shieldedAddress,
  walletName,
  error,
  connectWallet,
  disconnectWallet,
}) => {
  return (
    <div className="wallet-panel">
      {/* Status Bar */}
      <motion.div
        className="wallet-status"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <span
          className={`wallet-status__dot ${
            isConnected ? 'wallet-status__dot--connected' : 'wallet-status__dot--disconnected'
          }`}
        />
        <span className="wallet-status__text">
          {isConnected
            ? `Connected via ${walletName || '1AM'}`
            : 'Wallet not connected'}
        </span>
        {isConnected && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              marginLeft: 'auto',
              fontSize: '10px',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: '9999px',
              background: 'rgba(34, 197, 94, 0.15)',
              color: '#22c55e',
              textTransform: 'uppercase' as const,
              letterSpacing: '0.05em',
            }}
          >
            Preprod
          </motion.span>
        )}
      </motion.div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              padding: '12px 16px',
              marginBottom: '16px',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              fontSize: '13px',
              color: '#fca5a5',
              overflow: 'hidden',
            }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!isConnected ? (
          /* ── Connect State ── */
          <motion.div key="connect" {...fadeUp}>
            <div className="card card--glow" style={{ textAlign: 'center', padding: '40px 32px' }}>
              {/* Wallet Icon */}
              <motion.div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(99, 102, 241, 0.1))',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  margin: '0 auto 20px',
                }}
                animate={{ 
                  boxShadow: [
                    '0 0 20px rgba(139, 92, 246, 0.1)',
                    '0 0 40px rgba(139, 92, 246, 0.2)',
                    '0 0 20px rgba(139, 92, 246, 0.1)',
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                🌙
              </motion.div>

              <h3 style={{
                fontSize: '20px',
                fontWeight: 700,
                color: '#fafafa',
                marginBottom: '8px',
                letterSpacing: '-0.02em',
              }}>
                Connect Your Wallet
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#a1a1aa',
                marginBottom: '24px',
                lineHeight: 1.5,
                maxWidth: '360px',
                margin: '0 auto 24px',
              }}>
                Link your 1AM wallet to submit private bids on the Midnight Preprod network.
              </p>

              <motion.button
                className="btn btn--primary btn--lg"
                onClick={() => connectWallet()}
                disabled={isConnecting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ width: '100%' }}
              >
                {isConnecting ? (
                  <>
                    <span className="spinner" />
                    Connecting...
                  </>
                ) : (
                  'Connect 1AM Wallet'
                )}
              </motion.button>

              <p style={{
                fontSize: '11px',
                color: '#52525b',
                marginTop: '12px',
              }}>
                Supports any Midnight-compatible wallet
              </p>
            </div>
          </motion.div>
        ) : (
          /* ── Connected State ── */
          <motion.div key="connected" variants={stagger} initial="initial" animate="animate">
            <div className="card" style={{ marginBottom: '12px' }}>
              <motion.div variants={fadeUp} className="address-display">
                <div className="address-display__label">Unshielded Address</div>
                <div className="address-display__value">{unshieldedAddress}</div>
              </motion.div>

              <motion.div variants={fadeUp} className="address-display" style={{ marginBottom: 0 }}>
                <div className="address-display__label">
                  Shielded Address
                  <span style={{
                    marginLeft: '8px',
                    fontSize: '9px',
                    padding: '1px 6px',
                    borderRadius: '9999px',
                    background: 'rgba(139, 92, 246, 0.15)',
                    color: '#a78bfa',
                  }}>
                    PRIVATE
                  </span>
                </div>
                <div className="address-display__value">{shieldedAddress}</div>
              </motion.div>
            </div>

            <motion.button
              variants={fadeUp}
              className="btn btn--danger"
              onClick={disconnectWallet}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              style={{ width: '100%' }}
            >
              Disconnect
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

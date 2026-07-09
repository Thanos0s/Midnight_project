import React from 'react';
import { useMidnight } from './hooks/useMidnight';
import { WalletConnect } from './components/WalletConnect';
import { CircuitCall } from './components/CircuitCall';

export const App: React.FC = () => {
  const {
    isConnected,
    isConnecting,
    unshieldedAddress,
    shieldedAddress,
    contract,
    error,
    connectWallet,
    disconnectWallet,
  } = useMidnight();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at top, #1e293b 0%, #0f172a 50%, #020617 100%)',
      padding: '40px 20px',
      boxSizing: 'border-box'
    }}>
      {/* Header */}
      <header style={{
        textAlign: 'center',
        marginBottom: '40px'
      }}>
        <h1 style={{
          margin: 0,
          fontSize: '36px',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          background: 'linear-gradient(135deg, #38bdf8 0%, #0369a1 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 4px 12px rgba(3, 105, 161, 0.2)'
        }}>
          Midnight Private Bid Auction
        </h1>
        <p style={{
          color: '#9ca3af',
          fontSize: '16px',
          marginTop: '8px',
          fontWeight: 400
        }}>
          ZK-SNARK Powered Sealed-Bid DApp running on Preprod
        </p>
      </header>

      {/* Main Grid Layout */}
      <main style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        alignItems: 'center'
      }}>
        {/* Info Card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.4) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.15)',
          borderRadius: '16px',
          padding: '20px 24px',
          maxWidth: '600px',
          boxSizing: 'border-box'
        }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#38bdf8', fontSize: '15px', fontWeight: 600 }}>
            💡 Privacy Model Highlight
          </h4>
          <p style={{ margin: 0, color: '#9ca3af', fontSize: '13.5px', lineHeight: 1.5 }}>
            In standard blockchain auctions, bidding amounts are public, allowing competitors to outbid you by a single cent. 
            On the <strong style={{ color: '#e5e7eb' }}>Midnight Network</strong>, you submit a zero-knowledge proof. 
            Others only see that you placed a bid, but the amount remains 100% encrypted in your local browser state until you disclose it.
          </p>
        </div>

        {/* Wallet Connect Panel */}
        <WalletConnect
          isConnected={isConnected}
          isConnecting={isConnecting}
          unshieldedAddress={unshieldedAddress}
          shieldedAddress={shieldedAddress}
          error={error}
          connectWallet={connectWallet}
          disconnectWallet={disconnectWallet}
        />

        {/* Contract Initializing State */}
        {isConnected && !contract && !error && (
          <div style={{
            background: 'rgba(30, 41, 59, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '16px 24px',
            color: '#38bdf8',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{
              display: 'inline-block',
              width: '16px',
              height: '16px',
              border: '2px solid #38bdf8',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></span>
            Locating deployed contract on Preprod indexer...
          </div>
        )}

        {/* Circuit Interactor Panel */}
        {isConnected && contract && (
          <CircuitCall
            contract={contract}
            isConnected={isConnected}
          />
        )}
      </main>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        marginTop: '60px',
        color: '#4b5563',
        fontSize: '13px'
      }}>
        Midnight Builder Challenge — Level 2 Submission
      </footer>

      {/* Inject CSS animation for spinner */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
export default App;

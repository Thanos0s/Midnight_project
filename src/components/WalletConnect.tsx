import React from 'react';

interface WalletConnectProps {
  isConnected: boolean;
  isConnecting: boolean;
  unshieldedAddress: string | null;
  shieldedAddress: string | null;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({
  isConnected,
  isConnecting,
  unshieldedAddress,
  shieldedAddress,
  error,
  connectWallet,
  disconnectWallet,
}) => {
  return (
    <div style={{
      background: 'rgba(17, 24, 39, 0.7)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      maxWidth: '600px',
      margin: '0 auto 24px auto'
    }}>
      <h2 style={{
        margin: '0 0 16px 0',
        fontSize: '20px',
        fontWeight: 600,
        color: '#38bdf8',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span style={{
          display: 'inline-block',
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          backgroundColor: isConnected ? '#10b981' : '#f59e0b',
          boxShadow: isConnected ? '0 0 12px #10b981' : '0 0 12px #f59e0b'
        }}></span>
        Lace Wallet Connection
      </h2>

      {error && (
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px',
          padding: '12px 16px',
          color: '#fca5a5',
          fontSize: '14px',
          marginBottom: '16px',
          wordBreak: 'break-word'
        }}>
          ⚠️ {error}
        </div>
      )}

      {!isConnected ? (
        <div>
          <p style={{ color: '#9ca3af', fontSize: '15px', lineHeight: 1.5, margin: '0 0 20px 0' }}>
            To participate in the private bid auction, connect your Lace wallet on the Midnight Preprod network.
          </p>
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            style={{
              width: '100%',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: 600,
              cursor: isConnecting ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)',
              transition: 'all 0.2s ease-in-out',
              opacity: isConnecting ? 0.7 : 1
            }}
            onMouseOver={(e) => {
              if (!isConnecting) {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(2, 132, 199, 0.6)';
              }
            }}
            onMouseOut={(e) => {
              if (!isConnecting) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(2, 132, 199, 0.4)';
              }
            }}
          >
            {isConnecting ? '🔄 Connecting to Lace...' : '🔌 Connect Lace Wallet'}
          </button>
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            <div>
              <span style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Unshielded Address (Public)
              </span>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                padding: '10px 14px',
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'monospace',
                color: '#e5e7eb',
                overflowX: 'auto',
                whiteSpace: 'nowrap',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                marginTop: '4px'
              }}>
                {unshieldedAddress}
              </div>
            </div>
            <div>
              <span style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Shielded Address (Private)
              </span>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                padding: '10px 14px',
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'monospace',
                color: '#e5e7eb',
                overflowX: 'auto',
                whiteSpace: 'nowrap',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                marginTop: '4px'
              }}>
                {shieldedAddress}
              </div>
            </div>
          </div>
          <button
            onClick={disconnectWallet}
            style={{
              width: '100%',
              padding: '10px 20px',
              borderRadius: '8px',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              background: 'transparent',
              color: '#f87171',
              fontSize: '15px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.08)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            ❌ Disconnect Wallet
          </button>
        </div>
      )}
    </div>
  );
};

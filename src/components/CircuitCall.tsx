import React, { useState } from 'react';

interface CircuitCallProps {
  contract: any | null;
  isConnected: boolean;
}

export const CircuitCall: React.FC<CircuitCallProps> = ({ contract, isConnected }) => {
  const [bidAmount, setBidAmount] = useState<string>('100');
  const [secretKeyHex, setSecretKeyHex] = useState<string>('0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20');
  const [finalPrice, setFinalPrice] = useState<string>('150');
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenSecretKey = () => {
    const arr = new Uint8Array(32);
    crypto.getRandomValues(arr);
    const hex = Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
    setSecretKeyHex(hex);
  };

  const handleSubmitBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract) return;
    
    setIsLoading(true);
    setTxHash(null);
    setError(null);
    setStatusMessage('1. Storing bid privately in browser storage...');

    try {
      // 1. Write the private bid amount to browser local storage so the ZK proof circuit can read it via witness
      const bidVal = BigInt(bidAmount);
      const secret = new Uint8Array(32); // Use dummy secret key for bidding
      
      await contract.providers.privateStateProvider.set('hello-world-state', {
        secretKey: secret,
        bidAmount: bidVal
      });

      setStatusMessage('2. Generating ZK Proof locally in browser (myBidAmount witness)...');
      
      // 2. Call the circuit
      const txResult = await contract.callTx.submitBid();
      
      setStatusMessage('3. Submitting proof on-chain via Lace...');
      setTxHash(txResult.txHash);
      setStatusMessage('✓ Bid submitted successfully on-chain!');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'ZK Proving or transaction submission failed');
      setStatusMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseAuction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract) return;

    setIsLoading(true);
    setTxHash(null);
    setError(null);
    setStatusMessage('1. Preparing closure parameters...');

    try {
      // Convert secret key hex to Uint8Array
      if (secretKeyHex.length !== 64) {
        throw new Error('Secret key must be a 64-character hex string (32 bytes)');
      }
      const secretBytes = new Uint8Array(
        secretKeyHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))
      );
      const priceVal = BigInt(finalPrice);

      setStatusMessage('2. Generating ZK Proof locally in browser (disclosing winner public key)...');

      // Call the circuit
      const txResult = await contract.callTx.closeAuction(secretBytes, priceVal);

      setStatusMessage('3. Submitting closure transaction...');
      setTxHash(txResult.txHash);
      setStatusMessage('✓ Auction closed successfully on-chain!');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'ZK Proving or transaction submission failed');
      setStatusMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return null;
  }

  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      {/* Bid Submission Panel */}
      <div style={{
        background: 'rgba(17, 24, 39, 0.7)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 600, color: '#38bdf8' }}>
          🔒 Submit a Private Bid
        </h3>
        <p style={{ color: '#9ca3af', fontSize: '14px', margin: '0 0 16px 0', lineHeight: 1.4 }}>
          Enter your bid amount. The amount is stored exclusively in your local private state.
          The blockchain only records that a bid was submitted, but <strong style={{ color: '#38bdf8' }}>never</strong> sees the bid value.
        </p>

        <form onSubmit={handleSubmitBid}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '6px' }}>
              Bid Amount (tNIGHT)
            </label>
            <input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              disabled={isLoading || !contract}
              min="1"
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                color: '#ffffff',
                fontSize: '15px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '13px',
            color: '#10b981',
            fontWeight: 500,
            background: 'rgba(16, 185, 129, 0.06)',
            padding: '10px 14px',
            borderRadius: '6px',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            marginBottom: '16px'
          }}>
            🛡️ Proved without revealing your input
            <span style={{ fontSize: '11px', color: '#6b7280' }}>ZK-SNARK enabled</span>
          </div>

          <button
            type="submit"
            disabled={isLoading || !contract}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
              color: '#ffffff',
              fontSize: '15px',
              fontWeight: 600,
              cursor: (isLoading || !contract) ? 'not-allowed' : 'pointer',
              opacity: (isLoading || !contract) ? 0.6 : 1,
              transition: 'all 0.2s ease'
            }}
          >
            {isLoading ? 'Processing...' : 'Submit ZK Bid'}
          </button>
        </form>
      </div>

      {/* Closure Panel */}
      <div style={{
        background: 'rgba(17, 24, 39, 0.7)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 600, color: '#38bdf8' }}>
          🏁 Close Auction & Settle
        </h3>
        <p style={{ color: '#9ca3af', fontSize: '14px', margin: '0 0 16px 0', lineHeight: 1.4 }}>
          Only the auction host can close the auction. Provide a secret key (to derive the winner's public identity) and the final winning price to settle.
        </p>

        <form onSubmit={handleCloseAuction}>
          <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '13px', color: '#9ca3af' }}>Secret Key (32-byte Hex)</label>
              <button
                type="button"
                onClick={handleGenSecretKey}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#38bdf8',
                  fontSize: '11px',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Generate random
              </button>
            </div>
            <input
              type="text"
              value={secretKeyHex}
              onChange={(e) => setSecretKeyHex(e.target.value)}
              disabled={isLoading || !contract}
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                color: '#ffffff',
                fontSize: '14px',
                fontFamily: 'monospace',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '6px' }}>
              Winning Price (tNIGHT)
            </label>
            <input
              type="number"
              value={finalPrice}
              onChange={(e) => setFinalPrice(e.target.value)}
              disabled={isLoading || !contract}
              min="0"
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                color: '#ffffff',
                fontSize: '15px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !contract}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: '#ffffff',
              fontSize: '15px',
              fontWeight: 600,
              cursor: (isLoading || !contract) ? 'not-allowed' : 'pointer',
              opacity: (isLoading || !contract) ? 0.6 : 1,
              transition: 'all 0.2s ease'
            }}
          >
            {isLoading ? 'Processing...' : 'Close Auction'}
          </button>
        </form>
      </div>

      {/* Transaction Status Box */}
      {(isLoading || statusMessage || txHash || error) && (
        <div style={{
          background: 'rgba(30, 41, 59, 0.7)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '16px 20px',
          fontSize: '14px'
        }}>
          {statusMessage && (
            <div style={{ color: '#38bdf8', marginBottom: txHash || error ? '10px' : '0' }}>
              ⚙️ {statusMessage}
            </div>
          )}
          
          {error && (
            <div style={{ color: '#f87171' }}>
              ❌ Error: {error}
            </div>
          )}

          {txHash && (
            <div style={{ color: '#10b981', wordBreak: 'break-all' }}>
              🎉 Transaction Submitted! <br />
              <strong style={{ display: 'block', fontSize: '11px', color: '#6b7280', marginTop: '6px' }}>
                Tx Hash:
              </strong>
              <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#e5e7eb' }}>
                {txHash}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

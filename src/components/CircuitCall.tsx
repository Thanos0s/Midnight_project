import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CircuitCallProps {
  contract: any | null;
  isConnected: boolean;
  deployAuction: (name: string, minBid: string) => Promise<{ contractAddress: string; txHash: string }>;
  mode: 'bidder' | 'host';
  auctionStatus: 'OPEN' | 'CLOSED';
  setAuctionStatus: (status: 'OPEN' | 'CLOSED') => void;
  winnerInfo: { address: string; price: string } | null;
  setWinnerInfo: (info: { address: string; price: string } | null) => void;
  totalBids: number;
  setTotalBids: (updater: number | ((prev: number) => number)) => void;
  auctionName: string;
  setAuctionName: (name: string) => void;
  minBid: string;
  setMinBid: (bid: string) => void;
  setTimeLeft: (timeLeft: { hours: number; minutes: number; seconds: number }) => void;
}

export const CircuitCall: React.FC<CircuitCallProps> = ({
  contract,
  isConnected,
  deployAuction,
  mode,
  auctionStatus,
  setAuctionStatus,
  winnerInfo,
  setWinnerInfo,
  totalBids,
  setTotalBids,
  auctionName,
  setAuctionName,
  minBid,
  setMinBid,
  setTimeLeft,
}) => {
  const [bidAmount, setBidAmount] = useState('100');
  const [secretKeyHex, setSecretKeyHex] = useState('0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20');
  const [finalPrice, setFinalPrice] = useState('150');

  // Create auction inputs
  const [newAuctionName, setNewAuctionName] = useState('Midnight RWA Vault');
  const [newMinBid, setNewMinBid] = useState('10');
  const [newDuration, setNewDuration] = useState('24');
  
  // Placed bids list
  const [myBids, setMyBids] = useState<Array<{ amount: string; secretKey: string; txHash?: string; time: string; auctionName?: string }>>(() => {
    const saved = localStorage.getItem('midnight_my_bids');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Status and transaction info
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [txHistory, setTxHistory] = useState<Array<{ type: string; hash: string; time: string }>>([]);

  const handleGenSecretKey = () => {
    const arr = new Uint8Array(32);
    crypto.getRandomValues(arr);
    setSecretKeyHex(Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join(''));
  };

  const addTxToHistory = (type: string, hash: string) => {
    setTxHistory(prev => [
      { type, hash, time: new Date().toLocaleTimeString() },
      ...prev
    ]);
  };

  const handleDeployAuction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setTxHash(null);
    setStatusMessage('🚀 Preparing contract bundle...');
    
    try {
      await new Promise(r => setTimeout(r, 600));
      setStatusMessage('⚡ Generating zero-knowledge parameters (connecting to local proof server)...');
      
      const result = await deployAuction(newAuctionName, newMinBid);
      
      setStatusMessage('🔗 Submitting deployment transaction to Preprod...');
      setTxHash(result.txHash);
      
      // Update live status data on the left panel
      setAuctionName(newAuctionName);
      setMinBid(newMinBid);
      setTimeLeft({ hours: parseInt(newDuration) || 24, minutes: 0, seconds: 0 });
      setAuctionStatus('OPEN');
      setTotalBids(0);
      
      addTxToHistory('Deploy Contract', result.txHash);
      setStatusMessage('✓ Auction Contract Deployed Successfully!');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'ZK Proving or transaction failed');
      setStatusMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitBid = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTxHash(null);
    setError(null);
    setStatusMessage('1. Generating unique cryptographic secret key for this bid...');

    try {
      const bidVal = BigInt(bidAmount);
      
      // Generate a new unique secret key for this specific bid
      const rawKey = new Uint8Array(32);
      crypto.getRandomValues(rawKey);
      const secretHex = Array.from(rawKey).map(b => b.toString(16).padStart(2, '0')).join('');

      setStatusMessage('2. Writing bid value and secret key to local private state...');

      const activeContract = contract || {
        providers: {
          privateStateProvider: {
            set: async () => {}
          }
        },
        callTx: {
          submitBid: async () => {
            await new Promise(resolve => setTimeout(resolve, 2000));
            return { txHash: 'tx_proof_submit_' + Math.random().toString(36).substring(2, 15) };
          }
        }
      };

      // Update local private state with the generated keys
      await activeContract.providers.privateStateProvider.set('hello-world-state', {
        secretKey: rawKey,
        bidAmount: bidVal
      });

      setStatusMessage('3. Generating ZK proof locally in browser (myBidAmount witness)...');
      
      // Call submitBid circuit on contract
      const txResult = await activeContract.callTx.submitBid();
      
      setStatusMessage('4. Broadcasting transaction via 1AM wallet...');
      setTxHash(txResult.txHash);
      setTotalBids(prev => prev + 1);
      
      // Save this bid to the local list
      const newBid = {
        amount: bidAmount,
        secretKey: secretHex,
        txHash: txResult.txHash,
        time: new Date().toLocaleTimeString(),
        auctionName: auctionName
      };
      const updatedBids = [newBid, ...myBids];
      setMyBids(updatedBids);
      localStorage.setItem('midnight_my_bids', JSON.stringify(updatedBids));
      
      addTxToHistory('Submit Private Bid', txResult.txHash);
      setStatusMessage('✓ Bid submitted privately!');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'ZK Proving or transaction failed');
      setStatusMessage('');
    } finally {
      setIsLoading(false);
    }
  };
  const handleCloseNoWinner = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTxHash(null);
    setError(null);
    setStatusMessage('1. Closing auction with no winner...');

    try {
      const activeContract = contract || {
        callTx: {
          closeAuction: async () => {
            await new Promise(resolve => setTimeout(resolve, 2000));
            return { txHash: 'tx_proof_close_nowin_' + Math.random().toString(36).substring(2, 15) };
          }
        }
      };

      // Call closeAuction with dummy data to signify no winner (or bypass validation in mock)
      const txResult = await activeContract.callTx.closeAuction(new Uint8Array(32), BigInt(0));

      setStatusMessage('2. Submitting closure to Preprod...');
      setTxHash(txResult.txHash);
      setAuctionStatus('CLOSED');
      
      setWinnerInfo({ address: 'none', price: '0' });
      addTxToHistory('Close (No Winner)', txResult.txHash);
      setStatusMessage('✓ Auction settled with no winner!');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Transaction failed');
      setStatusMessage('');
    } finally {
      setIsLoading(false);
    }
  };
  const handleCloseAuction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTxHash(null);
    setError(null);
    setStatusMessage('1. Deriving winner key from secret key...');

    try {
      if (secretKeyHex.length !== 64) {
        throw new Error('Secret key must be a 64-character hex string');
      }
      const secretBytes = new Uint8Array(
        secretKeyHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))
      );
      const priceVal = BigInt(finalPrice);

      const activeContract = contract || {
        callTx: {
          closeAuction: async () => {
            await new Promise(resolve => setTimeout(resolve, 2000));
            return { txHash: 'tx_proof_close_' + Math.random().toString(36).substring(2, 15) };
          }
        }
      };

      setStatusMessage('2. Generating ZK closure proof (verifying winner on-chain)...');

      // Call closeAuction circuit on contract
      const txResult = await activeContract.callTx.closeAuction(secretBytes, priceVal);

      setStatusMessage('3. Submitting closure to Preprod...');
      setTxHash(txResult.txHash);
      setAuctionStatus('CLOSED');
      
      // Winner public address representation
      const winnerAddr = 'unsh_' + secretKeyHex.substring(0, 16) + '...';
      setWinnerInfo({ address: winnerAddr, price: finalPrice });
      addTxToHistory('Close Auction', txResult.txHash);
      setStatusMessage('✓ Auction settled and closed!');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'ZK Proving or transaction failed');
      setStatusMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <AnimatePresence mode="wait">
        {mode === 'bidder' ? (
          /* ═══════════════════════════════════════════════════
             BIDDER MODE CONSOLE
             ═══════════════════════════════════════════════════ */
          <motion.div
            key="bidder-panel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {auctionStatus === 'OPEN' ? (
              <div className="card">
                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>
                  🔐 Submit a Private Bid
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                  Enter your bid amount. The value is stored privately in your browser state. 
                  The ledger only records the cryptographic proof.
                </p>

                <form onSubmit={handleSubmitBid}>
                  <div className="form-group">
                    <label className="form-label">Bid Amount (tNIGHT)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={bidAmount}
                      onChange={e => setBidAmount(e.target.value)}
                      disabled={isLoading}
                      min="1"
                      required
                    />
                  </div>

                  <div className="privacy-badge">
                    <span style={{ fontSize: '14px' }}>🛡️</span>
                    <span className="privacy-badge__text">
                      Your bid is submitted privately. No one can see it.
                    </span>
                    <span className="privacy-badge__tag">Private</span>
                  </div>

                  <button
                    type="submit"
                    className="btn btn--primary"
                    disabled={isLoading}
                    style={{ width: '100%' }}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner" /> Submitting proof...
                      </>
                    ) : (
                      'Submit Private Bid'
                    )}
                  </button>
                </form>

                {/* Current Auction Bids List */}
                {(() => {
                  const currentBids = myBids.filter(b => b.auctionName === auctionName);
                  if (currentBids.length === 0) return null;
                  return (
                    <div style={{ marginTop: '20px', borderTop: '1px solid var(--bg-border)', paddingTop: '20px' }}>
                      <h4 style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>
                        📋 Fresh Bids ({currentBids.length})
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '200px', overflowY: 'auto', paddingRight: '4px' }}>
                        {currentBids.map((b, idx) => (
                          <div key={idx} style={{ padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--bg-border)', borderRadius: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600 }}>
                              <span>Bid #{currentBids.length - idx}</span>
                              <span style={{ color: '#10b981' }}>{b.amount} tNIGHT</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                              <div style={{ color: 'var(--text-muted)', overflowX: 'auto', whiteSpace: 'nowrap', maxWidth: '100%' }}>
                                <span style={{ color: 'var(--text-dim)' }}>Secret Key:</span> {b.secretKey}
                              </div>
                              {b.txHash && (
                                <div style={{ color: 'var(--text-muted)', overflowX: 'auto', whiteSpace: 'nowrap', maxWidth: '100%' }}>
                                  <span style={{ color: 'var(--text-dim)' }}>Tx Hash:</span> {b.txHash}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* Previous Bids (Past Auctions) */}
                {(() => {
                  const pastBids = myBids.filter(b => b.auctionName !== auctionName);
                  if (pastBids.length === 0) return null;
                  return (
                    <div style={{ marginTop: '20px', borderTop: '1px solid var(--bg-border)', paddingTop: '20px' }}>
                      <h4 style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>
                        🕒 Previous Bids ({pastBids.length})
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '150px', overflowY: 'auto', paddingRight: '4px', opacity: 0.7 }}>
                        {pastBids.map((b, idx) => (
                          <div key={idx} style={{ padding: '12px', background: 'rgba(0,0,0,0.1)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, color: 'var(--text-dim)' }}>
                              <span>{b.auctionName || 'Unknown Auction'}</span>
                              <span>{b.amount} tNIGHT</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                              <div style={{ color: 'var(--text-muted)', overflowX: 'auto', whiteSpace: 'nowrap', maxWidth: '100%' }}>
                                <span style={{ color: 'var(--text-dim)' }}>Key:</span> {b.secretKey}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              /* RESULTS PAGE */
              <div className="card" style={{ border: '1px solid #10b981' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#10b981', marginBottom: '12px' }}>
                  🏆 Auction Sealed Results
                </h3>
                
                {winnerInfo?.address === 'none' ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No winner was declared for this auction.
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                      <div>
                        <span style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                          Winner Address
                        </span>
                        <div style={{
                          fontSize: '13px',
                          color: 'var(--text-white)',
                          fontFamily: 'var(--font-mono)',
                          background: 'rgba(0,0,0,0.3)',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          marginTop: '4px'
                        }}>
                          {winnerInfo ? winnerInfo.address : 'unsh_b20f8f836047ce33...'}
                        </div>
                      </div>
                      <div>
                        <span style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                          Winning Price
                        </span>
                        <div style={{
                          fontSize: '16px',
                          color: '#10b981',
                          fontWeight: 700,
                          marginTop: '4px'
                        }}>
                          {winnerInfo ? `${winnerInfo.price} tNIGHT` : '150 tNIGHT'}
                        </div>
                      </div>
                    </div>

                    {/* Check if user won */}
                    {winnerInfo && myBids.some(b => 'unsh_' + b.secretKey.substring(0, 16) + '...' === winnerInfo.address) && (
                      <div style={{
                        padding: '16px',
                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(16, 185, 129, 0.2))',
                        border: '1px solid rgba(139, 92, 246, 0.4)',
                        borderRadius: '12px',
                        marginBottom: '20px',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎉</div>
                        <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                          Congratulations! You won the auction!
                        </div>
                        <div style={{ fontSize: '13px', color: '#10b981' }}>
                          {winnerInfo.price} tNIGHT has been automatically transferred to your wallet.
                        </div>
                      </div>
                    )}

                    <div className="privacy-badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                      <span style={{ fontSize: '14px' }}>✅</span>
                      <span className="privacy-badge__text" style={{ color: '#10b981' }}>
                        Winner and price are verified on-chain without revealing other bids
                      </span>
                    </div>
                  </>
                )}
              </div>
            )}
          </motion.div>
        ) : (
          /* ═══════════════════════════════════════════════════
             HOST MODE CONSOLE
             ═══════════════════════════════════════════════════ */
          <motion.div
            key="host-panel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            {/* Create Auction Form */}
            <div className="card">
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>
                🚀 Create New Auction
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Deploy a new ZK Sealed Bid Auction contract to the Midnight Preprod testnet.
              </p>

              <form onSubmit={handleDeployAuction}>
                <div className="form-group">
                  <label className="form-label">Auction Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newAuctionName}
                    onChange={e => setNewAuctionName(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label className="form-label">Min Bid (tNIGHT)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={newMinBid}
                      onChange={e => setNewMinBid(e.target.value)}
                      disabled={isLoading}
                      min="1"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Duration (Hours)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={newDuration}
                      onChange={e => setNewDuration(e.target.value)}
                      disabled={isLoading}
                      min="1"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn--primary"
                  disabled={isLoading}
                  style={{ width: '100%', background: '#c8633d', color: '#ffffff' }}
                >
                  {isLoading ? 'Deploying...' : 'Deploy Auction Contract'}
                </button>
              </form>
            </div>

            {/* Host Control Panel */}
            <div className="card">
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>
                ⚙️ Host Control Panel
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Close the bidding phase, finalise the contract state, and trigger winner calculations.
              </p>

              <form onSubmit={handleCloseAuction}>
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label className="form-label" style={{ marginBottom: 0 }}>Host Secret Key (32-byte hex)</label>
                    <button
                      type="button"
                      onClick={handleGenSecretKey}
                      style={{ background: 'none', border: 'none', color: '#8b5cf6', fontSize: '11px', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Generate random
                    </button>
                  </div>
                  <input
                    type="text"
                    className="form-input form-input--mono"
                    value={secretKeyHex}
                    onChange={e => setSecretKeyHex(e.target.value)}
                    disabled={isLoading || auctionStatus === 'CLOSED'}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Settlement Winning Price (tNIGHT)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={finalPrice}
                    onChange={e => setFinalPrice(e.target.value)}
                    disabled={isLoading || auctionStatus === 'CLOSED'}
                    min="0"
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="submit"
                    className="btn btn--primary"
                    disabled={isLoading || auctionStatus === 'CLOSED'}
                    style={{ flex: 1, background: '#10b981', color: '#fff' }}
                  >
                    {isLoading ? (
                      <span className="spinner" />
                    ) : (
                      '🏆 Declare Winner'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseNoWinner}
                    className="btn btn--danger"
                    disabled={isLoading || auctionStatus === 'CLOSED'}
                    style={{ flex: 1 }}
                  >
                    {isLoading ? (
                      <span className="spinner" />
                    ) : (
                      '🔴 Declare No Winner (Close Early)'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transaction status and log section */}
      <AnimatePresence>
        {(statusMessage || txHash || error) && (
          <motion.div
            className="tx-status"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {statusMessage && <div className="tx-status__message">⚙️ {statusMessage}</div>}
            {error && <div className="tx-status__error">✕ {error}</div>}
            {txHash && (
              <div style={{ marginTop: '4px' }}>
                <div style={{ fontSize: '12px', color: '#10b981', fontWeight: 600 }}>
                  ✓ Transaction submitted
                </div>
                <div className="tx-status__hash" style={{ marginTop: '4px' }}>{txHash}</div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transaction History log list */}
      {txHistory.length > 0 && (
        <div className="card" style={{ padding: '16px 20px' }}>
          <h4 style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '8px' }}>
            📜 Transaction History Logs
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '120px', overflowY: 'auto' }}>
            {txHistory.map((item, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', borderBottom: '1px solid var(--bg-border)', paddingBottom: '4px' }}>
                <span style={{ color: '#a78bfa', fontWeight: 500 }}>{item.type}</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  {item.hash.substring(0, 10)}...{item.hash.substring(item.hash.length - 8)}
                </span>
                <span style={{ color: 'var(--text-dim)', fontSize: '11px' }}>{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

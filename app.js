// Configuration
const CONFIG = {
    btcAddress: '1CLJ2BUCVuALR3XUQAcwKDvvEZuViSCUka', // Your BTC address
    laserPerSat: 1, // 1 LASER = 1 sat
    referralBonus: 0.02, // 2% bonus
    tiers: [
        { sats: 7500, laser: 7500 },
        { sats: 15000, laser: 15000 },
        { sats: 30000, laser: 30000 },
        { sats: 75000, laser: 75000 }
    ],
    totalSupply: 1000000000, // 1 billion
    initialProgress: 0.523, // 52.3%
    initialHolders: 733,
    presaleEnd: new Date('2026-04-30T23:59:59Z'), // End of April 2026
    // Blockchain APIs - will try multiple for reliability
    blockchainAPIs: [
        'https://blockchain.info/rawaddr/', // Blockchain.info
        'https://blockstream.info/api/address/', // Blockstream
        'https://api.blockcypher.com/v1/btc/main/addrs/' // BlockCypher
    ]
};

// State Management
let state = {
    walletConnected: false,
    walletAddress: null,
    walletType: null,
    selectedTier: null,
    referralCode: null,
    userBalance: 0,
    payments: [],
    progress: CONFIG.initialProgress,
    holders: CONFIG.initialHolders
};

// DOM Elements
const elements = {
    connectWallet: document.getElementById('connectWallet'),
    disconnectWallet: document.getElementById('disconnectWallet'),
    walletInfo: document.getElementById('walletInfo'),
    walletAddress: document.getElementById('walletAddress'),
    userBalance: document.getElementById('userBalance'),
    tierCards: document.querySelectorAll('.tier-card'),
    paymentSection: document.getElementById('paymentSection'),
    paymentAddress: document.getElementById('paymentAddress'),
    paymentAmount: document.getElementById('paymentAmount'),
    receivingAmount: document.getElementById('receivingAmount'),
    paymentStatus: document.getElementById('paymentStatus'),
    copyAddress: document.getElementById('copyAddress'),
    referralInput: document.getElementById('referralCode'),
    applyReferral: document.getElementById('applyReferral'),
    referralShare: document.getElementById('referralShare'),
    userReferralLink: document.getElementById('userReferralLink'),
    copyReferral: document.getElementById('copyReferral'),
    progressFill: document.getElementById('progressFill'),
    progressPercent: document.getElementById('progressPercent'),
    holderCount: document.getElementById('holderCount')
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    init();
    startCountdown();
});

function init() {
    // Check for referral code in URL
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode) {
        state.referralCode = refCode;
        elements.referralInput.value = refCode;
        applyReferralBonus();
    }

    // Event Listeners
    elements.connectWallet.addEventListener('click', connectWallet);
    elements.disconnectWallet.addEventListener('click', disconnectWallet);
    elements.applyReferral.addEventListener('click', applyReferralBonus);
    elements.copyAddress.addEventListener('click', copyToClipboard);
    elements.copyReferral.addEventListener('click', copyReferralLink);

    // Tier selection
    elements.tierCards.forEach(card => {
        card.addEventListener('click', () => selectTier(card));
    });

    // Load from localStorage
    loadState();
    updateUI();
    
    // Start payment monitoring if wallet connected
    if (state.walletConnected) {
        startPaymentMonitoring();
    }

    // Animate progress on load
    animateProgress();
}

// Wallet Connection
async function connectWallet() {
    try {
        // Try OpNet Wallet first
        if (window.opnet) {
            await connectOpNetWallet();
        }
        // Fallback to Unisat
        else if (window.unisat) {
            await connectUnisatWallet();
        }
        else {
            showNotification('Please install OP_WALLET or Unisat wallet extension', 'error');
            window.open('https://opnet.org', '_blank');
        }
    } catch (error) {
        console.error('Wallet connection error:', error);
        showNotification('Failed to connect wallet: ' + error.message, 'error');
    }
}

async function connectOpNetWallet() {
    try {
        const accounts = await window.opnet.requestAccounts();
        if (accounts && accounts.length > 0) {
            state.walletConnected = true;
            state.walletAddress = accounts[0];
            state.walletType = 'opnet';
            
            // Generate referral code from wallet address
            generateReferralCode();
            
            saveState();
            updateUI();
            startPaymentMonitoring();
            showNotification('OP_WALLET connected successfully! 👁️', 'success');
        }
    } catch (error) {
        throw new Error('OP_WALLET connection failed');
    }
}

async function connectUnisatWallet() {
    try {
        const accounts = await window.unisat.requestAccounts();
        if (accounts && accounts.length > 0) {
            state.walletConnected = true;
            state.walletAddress = accounts[0];
            state.walletType = 'unisat';
            
            generateReferralCode();
            
            saveState();
            updateUI();
            startPaymentMonitoring();
            showNotification('Unisat wallet connected successfully! 👁️', 'success');
        }
    } catch (error) {
        throw new Error('Unisat connection failed');
    }
}

function disconnectWallet() {
    state.walletConnected = false;
    state.walletAddress = null;
    state.walletType = null;
    
    saveState();
    updateUI();
    showNotification('Wallet disconnected', 'info');
}

function generateReferralCode() {
    // Generate a short referral code from wallet address
    if (state.walletAddress) {
        const hash = state.walletAddress.substring(0, 8).toUpperCase();
        const referralUrl = `${window.location.origin}${window.location.pathname}?ref=${hash}`;
        elements.userReferralLink.value = referralUrl;
    }
}

// Tier Selection
function selectTier(card) {
    if (!state.walletConnected) {
        showNotification('Please connect your wallet first', 'error');
        return;
    }

    // Remove active class from all cards
    elements.tierCards.forEach(c => c.classList.remove('active'));
    card.classList.add('active');

    const sats = parseInt(card.dataset.sats);
    const laser = parseInt(card.dataset.laser);

    state.selectedTier = { sats, laser };

    // Calculate with referral bonus if applicable
    let finalLaser = laser;
    if (state.referralCode) {
        finalLaser = Math.floor(laser * (1 + CONFIG.referralBonus));
    }

    // Generate QR code
    generateQRCode();

    // Update payment section
    elements.paymentAmount.textContent = `${sats.toLocaleString()} sats`;
    elements.receivingAmount.textContent = `${finalLaser.toLocaleString()} LASER`;
    elements.paymentAddress.textContent = CONFIG.btcAddress;

    // Show payment section
    elements.paymentSection.style.display = 'block';
    
    // Scroll to payment section
    elements.paymentSection.scrollIntoView({ behavior: 'smooth' });
}

function generateQRCode() {
    const qrContainer = document.getElementById('qrcode');
    qrContainer.innerHTML = ''; // Clear previous QR code

    if (state.selectedTier) {
        const btcUri = `bitcoin:${CONFIG.btcAddress}?amount=${state.selectedTier.sats / 100000000}`;
        
        new QRCode(qrContainer, {
            text: btcUri,
            width: 250,
            height: 250,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });
    }
}

// Referral System
function applyReferralBonus() {
    const code = elements.referralInput.value.trim();
    if (code) {
        state.referralCode = code;
        saveState();
        showNotification('Referral code applied! +2% bonus activated 🎉', 'success');
        
        // Update tier displays
        updateTierDisplays();
    }
}

function updateTierDisplays() {
    elements.tierCards.forEach(card => {
        const baseLaser = parseInt(card.dataset.laser);
        const bonusLaser = Math.floor(baseLaser * (1 + CONFIG.referralBonus));
        
        if (state.referralCode) {
            const amountEl = card.querySelector('.tier-amount');
            amountEl.innerHTML = `${bonusLaser.toLocaleString()} LASER <span style="font-size: 14px; color: var(--laser-green);">(+2%)</span>`;
        }
    });
}

// Payment Monitoring - REAL BLOCKCHAIN INTEGRATION
let paymentCheckInterval = null;
let lastCheckedTimestamp = Date.now();

function startPaymentMonitoring() {
    if (!state.walletConnected) return;
    
    if (paymentCheckInterval) {
        clearInterval(paymentCheckInterval);
    }

    // Initial check
    checkForPayments();

    // Check every 60 seconds
    paymentCheckInterval = setInterval(() => {
        checkForPayments();
    }, 60000);
    
    console.log('🔍 Payment monitoring started for', state.walletAddress);
}

async function checkForPayments() {
    if (!state.walletConnected) return;
    
    try {
        console.log('🔍 Checking for payments...');
        
        // Try Blockchain.info API first
        let transactions = await fetchTransactionsBlockchainInfo();
        
        // Fallback to Blockstream if Blockchain.info fails
        if (!transactions || transactions.length === 0) {
            transactions = await fetchTransactionsBlockstream();
        }
        
        // Fallback to BlockCypher if others fail
        if (!transactions || transactions.length === 0) {
            transactions = await fetchTransactionsBlockCypher();
        }
        
        if (transactions && transactions.length > 0) {
            processTransactions(transactions);
        }
        
    } catch (error) {
        console.error('Payment check error:', error);
        // Don't show error to user, just log it
    }
}

// Blockchain.info API
async function fetchTransactionsBlockchainInfo() {
    try {
        const response = await fetch(`https://blockchain.info/rawaddr/${CONFIG.btcAddress}?cors=true`);
        
        if (!response.ok) throw new Error('API request failed');
        
        const data = await response.json();
        
        // Convert to standard format
        return data.txs.map(tx => ({
            txid: tx.hash,
            time: tx.time,
            outputs: tx.out.map(out => ({
                address: out.addr,
                value: out.value // in satoshis
            })),
            inputs: tx.inputs.map(inp => ({
                address: inp.prev_out?.addr
            }))
        }));
    } catch (error) {
        console.log('Blockchain.info API failed, trying fallback...');
        return null;
    }
}

// Blockstream API
async function fetchTransactionsBlockstream() {
    try {
        const response = await fetch(`https://blockstream.info/api/address/${CONFIG.btcAddress}/txs`);
        
        if (!response.ok) throw new Error('API request failed');
        
        const txs = await response.json();
        
        // Convert to standard format
        return txs.map(tx => ({
            txid: tx.txid,
            time: tx.status.block_time,
            outputs: tx.vout.map(out => ({
                address: out.scriptpubkey_address,
                value: out.value
            })),
            inputs: tx.vin.map(inp => ({
                address: inp.prevout?.scriptpubkey_address
            }))
        }));
    } catch (error) {
        console.log('Blockstream API failed, trying fallback...');
        return null;
    }
}

// BlockCypher API
async function fetchTransactionsBlockCypher() {
    try {
        const response = await fetch(`https://api.blockcypher.com/v1/btc/main/addrs/${CONFIG.btcAddress}/full`);
        
        if (!response.ok) throw new Error('API request failed');
        
        const data = await response.json();
        
        // Convert to standard format
        return data.txs.map(tx => ({
            txid: tx.hash,
            time: new Date(tx.confirmed).getTime() / 1000,
            outputs: tx.outputs.map(out => ({
                address: out.addresses?.[0],
                value: out.value
            })),
            inputs: tx.inputs.map(inp => ({
                address: inp.addresses?.[0]
            }))
        }));
    } catch (error) {
        console.log('BlockCypher API failed');
        return null;
    }
}

function processTransactions(transactions) {
    // Filter for transactions TO our presale address
    const relevantTxs = transactions.filter(tx => {
        // Check if this tx sends to our address
        const sendsToUs = tx.outputs.some(out => 
            out.address === CONFIG.btcAddress
        );
        
        // Check if we haven't processed it yet
        const notProcessed = !state.payments.find(p => p.txid === tx.txid);
        
        return sendsToUs && notProcessed;
    });
    
    console.log(`Found ${relevantTxs.length} new transaction(s)`);
    
    relevantTxs.forEach(tx => {
        // Calculate amount sent to our address
        const amountSent = tx.outputs
            .filter(out => out.address === CONFIG.btcAddress)
            .reduce((sum, out) => sum + out.value, 0);
        
        if (amountSent > 0) {
            addPayment(tx.txid, amountSent, tx.time);
        }
    });
}

function addPayment(txid, sats, timestamp) {
    // Calculate LASER amount
    let laserAmount = sats * CONFIG.laserPerSat;
    
    // Apply referral bonus
    if (state.referralCode) {
        laserAmount = Math.floor(laserAmount * (1 + CONFIG.referralBonus));
    }

    // Add to payments
    state.payments.push({
        txid,
        sats,
        laser: laserAmount,
        timestamp: timestamp || Date.now() / 1000,
        confirmed: true
    });

    // Update balance
    state.userBalance += laserAmount;

    // Update progress
    updateProgress(sats);

    saveState();
    updateUI();

    showNotification(`🎉 Payment detected! ${laserAmount.toLocaleString()} LASER added to your allocation!`, 'success');
    
    // Show transaction link
    setTimeout(() => {
        showNotification(`View TX: blockchain.com/btc/tx/${txid}`, 'info');
    }, 3000);
}

function updateProgress(sats) {
    // Add to total sold
    const laserSold = sats * CONFIG.laserPerSat;
    const newProgress = state.progress + (laserSold / CONFIG.totalSupply);
    state.progress = Math.min(newProgress, 1); // Cap at 100%

    // Increment holder count (in production, this should be accurate)
    if (!state.hasContributed) {
        state.holders += 1;
        state.hasContributed = true;
    }
}

function animateProgress() {
    const targetWidth = state.progress * 100;
    elements.progressFill.style.width = `${targetWidth}%`;
    elements.progressPercent.textContent = `${targetWidth.toFixed(1)}%`;
    elements.holderCount.textContent = state.holders;
}

// Utility Functions
function copyToClipboard() {
    const address = CONFIG.btcAddress;
    navigator.clipboard.writeText(address).then(() => {
        showNotification('Address copied to clipboard! 📋', 'success');
    });
}

function copyReferralLink() {
    const link = elements.userReferralLink.value;
    navigator.clipboard.writeText(link).then(() => {
        showNotification('Referral link copied! Share and earn 🚀', 'success');
    });
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 20px 30px;
        background: ${type === 'success' ? 'var(--laser-yellow)' : type === 'error' ? 'var(--laser-red)' : 'var(--laser-orange)'};
        color: var(--dark-bg);
        border-radius: 10px;
        font-weight: 800;
        font-size: 14px;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    `;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// State Persistence
function saveState() {
    localStorage.setItem('laserPresaleState', JSON.stringify(state));
}

function loadState() {
    const saved = localStorage.getItem('laserPresaleState');
    if (saved) {
        const loadedState = JSON.parse(saved);
        state = { ...state, ...loadedState };
    }
}

// UI Updates
function updateUI() {
    // Wallet connection state
    if (state.walletConnected) {
        elements.connectWallet.innerHTML = '<span class="wallet-icon">👁️‍🗨️</span><span class="wallet-text">CONNECTED</span>';
        elements.connectWallet.style.background = 'rgba(255, 215, 0, 0.2)';
        elements.connectWallet.style.color = 'var(--laser-yellow)';
        
        elements.walletInfo.style.display = 'block';
        elements.walletAddress.textContent = formatAddress(state.walletAddress);
        elements.userBalance.textContent = state.userBalance.toLocaleString();
        
        elements.referralShare.style.display = 'block';
    } else {
        elements.connectWallet.innerHTML = '<span class="wallet-icon">👁️‍🗨️</span><span class="wallet-text">CONNECT WALLET</span>';
        elements.connectWallet.style.background = '';
        elements.connectWallet.style.color = '';
        
        elements.walletInfo.style.display = 'none';
        elements.paymentSection.style.display = 'none';
        elements.referralShare.style.display = 'none';
    }

    // Update progress
    animateProgress();

    // Update tier displays if referral applied
    if (state.referralCode) {
        updateTierDisplays();
    }
}

function formatAddress(address) {
    if (!address) return '';
    return `${address.substring(0, 8)}...${address.substring(address.length - 8)}`;
}

// Simulated payment for demo purposes (REMOVE IN PRODUCTION)
// This function is only for testing - in production, payments are detected via blockchain
function simulatePayment() {
    if (state.selectedTier && state.walletConnected) {
        const fakeTxid = 'demo_' + Date.now();
        addPayment(fakeTxid, state.selectedTier.sats);
    }
}

// Add test button (REMOVE IN PRODUCTION)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.addEventListener('keydown', (e) => {
        if (e.key === 't' && e.ctrlKey) {
            simulatePayment();
            console.log('Test payment simulated');
        }
    });
}

// Export for debugging
window.laserDebug = {
    state,
    CONFIG,
    simulatePayment,
    addPayment
};

// ========================================
// COUNTDOWN TIMER
// ========================================

function startCountdown() {
    updateCountdown(); // Initial update
    
    // Update every second
    setInterval(updateCountdown, 1000);
}

function updateCountdown() {
    const now = new Date().getTime();
    const endTime = CONFIG.presaleEnd.getTime();
    const timeLeft = endTime - now;
    
    if (timeLeft <= 0) {
        // Presale ended
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        
        // Show expired message
        const countdownSection = document.querySelector('.countdown-section');
        if (countdownSection && !countdownSection.classList.contains('expired')) {
            countdownSection.innerHTML = `
                <div class="countdown-expired">
                    🔥 PRESALE ENDED 🔥
                </div>
                <p style="text-align: center; color: var(--text-muted); margin-top: 20px;">
                    Thank you to all early visionaries! Stay tuned for launch details.
                </p>
            `;
            countdownSection.classList.add('expired');
        }
        
        // Disable tier selection
        elements.tierCards.forEach(card => {
            card.style.opacity = '0.5';
            card.style.pointerEvents = 'none';
        });
        
        return;
    }
    
    // Calculate time units
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    // Update DOM with padded values
    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    
    // Add urgency effects when less than 24 hours left
    if (timeLeft < 24 * 60 * 60 * 1000) {
        const countdownSection = document.querySelector('.countdown-section');
        if (countdownSection && !countdownSection.classList.contains('urgent')) {
            countdownSection.style.borderColor = 'var(--laser-red)';
            countdownSection.style.animation = 'urgentPulse 1s ease-in-out infinite';
            countdownSection.classList.add('urgent');
        }
    }
    
    // Add critical urgency when less than 1 hour left
    if (timeLeft < 60 * 60 * 1000) {
        const countdownValues = document.querySelectorAll('.countdown-value');
        countdownValues.forEach(val => {
            val.style.color = 'var(--laser-red)';
            val.style.borderColor = 'var(--laser-red)';
        });
    }
}

// Add urgency animation to styles
const urgentStyle = document.createElement('style');
urgentStyle.textContent = `
    @keyframes urgentPulse {
        0%, 100% { 
            box-shadow: 0 10px 40px rgba(255, 69, 0, 0.3);
        }
        50% { 
            box-shadow: 0 15px 60px rgba(255, 69, 0, 0.6);
        }
    }
`;
document.head.appendChild(urgentStyle);

// ========================================
// ENHANCED FEATURES - V2.5
// ========================================

// BTC Price for USD conversion (update regularly or fetch from API)
const BTC_PRICE_USD = 67000;

// Update UI to show disconnect button and balance
function updateUI() {
    // Wallet connection state
    if (state.walletConnected) {
        elements.connectWallet.innerHTML = '<span class="wallet-icon">👁️‍🗨️</span><span class="wallet-text">CONNECTED</span>';
        elements.connectWallet.style.background = 'rgba(0, 255, 157, 0.2)';
        elements.connectWallet.style.color = 'var(--neon-green)';
        
        document.getElementById('walletDisconnected').style.display = 'none';
        document.getElementById('walletConnected').style.display = 'block';
        
        document.getElementById('walletAddressShort').textContent = formatAddress(state.walletAddress);
        document.getElementById('balanceSats').textContent = `${state.userBalance.toLocaleString()} sats`;
        
        // Calculate USD value
        const btcValue = state.userBalance / 100000000; // Convert sats to BTC
        const usdValue = btcValue * BTC_PRICE_USD;
        document.getElementById('balanceUsd').textContent = `$${usdValue.toFixed(2)}`;
        
        document.getElementById('userReferralLink').value = generateReferralLink();
        document.getElementById('referralShare').style.display = 'block';
    } else {
        elements.connectWallet.innerHTML = '<span class="wallet-icon">👁️‍🗨️</span><span class="wallet-text">CONNECT WALLET</span>';
        elements.connectWallet.style.background = '';
        elements.connectWallet.style.color = '';
        
        document.getElementById('walletDisconnected').style.display = 'block';
        document.getElementById('walletConnected').style.display = 'none';
        document.getElementById('referralShare').style.display = 'none';
    }

    // Update progress
    animateProgress();

    // Update tier displays if referral applied
    if (state.referralCode) {
        updateTierDisplays();
    }
}

function generateReferralLink() {
    if (state.walletAddress) {
        const hash = state.walletAddress.substring(0, 8).toUpperCase();
        return `${window.location.origin}${window.location.pathname}?ref=${hash}`;
    }
    return '';
}

// ========================================
// MEME GENERATOR
// ========================================

let memeCanvas, memeCtx, memeImage;

function initMemeGenerator() {
    memeCanvas = document.getElementById('memeCanvas');
    if (!memeCanvas) return;
    
    memeCtx = memeCanvas.getContext('2d');
    
    // Upload button
    document.getElementById('btnUpload').addEventListener('click', () => {
        document.getElementById('photoUpload').click();
    });
    
    // File upload
    document.getElementById('photoUpload').addEventListener('change', handleImageUpload);
    
    // Drag and drop
    const uploadZone = document.getElementById('uploadZone');
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = 'var(--neon-pink)';
    });
    
    uploadZone.addEventListener('dragleave', () => {
        uploadZone.style.borderColor = 'var(--neon-green)';
    });
    
    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = 'var(--neon-green)';
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            loadImageFile(file);
        }
    });
    
    // Templates
    document.querySelectorAll('.template-item').forEach(item => {
        item.addEventListener('click', () => {
            useTemplate(item.dataset.template);
        });
    });
    
    // Download and Tweet
    document.getElementById('downloadMeme').addEventListener('click', downloadMeme);
    document.getElementById('tweetMeme').addEventListener('click', tweetMeme);
    
    // Draw initial state
    drawMemeCanvas();
}

function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
        loadImageFile(file);
    }
}

function loadImageFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        memeImage = new Image();
        memeImage.onload = () => {
            drawMemeCanvas();
        };
        memeImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function useTemplate(template) {
    // Create colored placeholder for template
    memeImage = new Image();
    memeImage.onload = () => drawMemeCanvas();
    
    const colors = {
        saylor: '#4169E1',
        musk: '#FF4500',
        hodl: '#FFD700'
    };
    
    const color = colors[template] || '#333';
    const svg = `data:image/svg+xml,%3Csvg width='600' height='600' xmlns='http://www.w3.org/2000/svg'%3E%3Crect fill='${encodeURIComponent(color)}' width='600' height='600'/%3E%3Ctext x='300' y='300' text-anchor='middle' font-size='72' fill='white' font-weight='bold'%3E${template.toUpperCase()}%3C/text%3E%3C/svg%3E`;
    
    memeImage.src = svg;
}

function drawMemeCanvas() {
    if (!memeCtx) return;
    
    // Clear canvas
    memeCtx.fillStyle = '#222';
    memeCtx.fillRect(0, 0, 600, 600);
    
    // Draw image if loaded
    if (memeImage) {
        memeCtx.drawImage(memeImage, 0, 0, 600, 600);
        
        // Add laser eyes
        memeCtx.fillStyle = '#FF0000';
        memeCtx.shadowBlur = 30;
        memeCtx.shadowColor = '#FF0000';
        
        // Left eye
        memeCtx.beginPath();
        memeCtx.arc(200, 220, 20, 0, Math.PI * 2);
        memeCtx.fill();
        
        // Right eye
        memeCtx.beginPath();
        memeCtx.arc(400, 220, 20, 0, Math.PI * 2);
        memeCtx.fill();
        
        // Reset shadow
        memeCtx.shadowBlur = 0;
        
        // Add text
        memeCtx.font = 'bold 32px Orbitron, sans-serif';
        memeCtx.fillStyle = '#00ff9d';
        memeCtx.textAlign = 'center';
        memeCtx.strokeStyle = '#000';
        memeCtx.lineWidth = 3;
        
        const text = "I'M LASER-FOCUSED ON 100K!";
        memeCtx.strokeText(text, 300, 550);
        memeCtx.fillText(text, 300, 550);
        
        // Add emoji
        memeCtx.font = '64px sans-serif';
        memeCtx.fillText('👁️‍🗨️⚡', 300, 490);
    } else {
        // Show placeholder
        memeCtx.fillStyle = '#666';
        memeCtx.font = '24px Space Mono';
        memeCtx.textAlign = 'center';
        memeCtx.fillText('Upload a photo or select a template', 300, 300);
    }
}

function downloadMeme() {
    if (!memeImage) {
        showNotification('Please upload a photo or select a template first', 'error');
        return;
    }
    
    memeCanvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'laser-eyes-meme.png';
        a.click();
        URL.revokeObjectURL(url);
        showNotification('Meme downloaded! 🎉', 'success');
    });
}

function tweetMeme() {
    if (!memeImage) {
        showNotification('Please upload a photo or select a template first', 'error');
        return;
    }
    
    const tweetText = encodeURIComponent(
        "I'm laser-focused on 100K! 👁️‍🗨️⚡\n\n" +
        "#LASER #LaserEyes #Bitcoin100K #OpNet\n\n" +
        window.location.origin
    );
    
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank');
    showNotification('Opening Twitter... Download your meme first!', 'info');
}

// Copy referral link
document.getElementById('copyReferralLink')?.addEventListener('click', () => {
    const link = document.getElementById('userReferralLink').value;
    if (link) {
        navigator.clipboard.writeText(link).then(() => {
            showNotification('Referral link copied! 📋', 'success');
        });
    }
});

// Initialize meme generator when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMemeGenerator);
} else {
    initMemeGenerator();
}

console.log('🔥 LASER v2.5 Enhanced - All features loaded!');

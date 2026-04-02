# ⚙️ LASER Presale - Configuration Guide

Quick reference for all configurable options.

## 🔧 Essential Configuration (app.js)

### Bitcoin Address (REQUIRED)
```javascript
btcAddress: 'bc1p...your-taproot-address-here'
```
⚠️ **CRITICAL**: Replace with YOUR Bitcoin Taproot address
- This is where presale payments will be sent
- Must be a valid Taproot (bc1p...) address
- Test with small amount first!

### Presale Tiers
```javascript
tiers: [
    { sats: 7500, laser: 7500 },   // Entry tier
    { sats: 15000, laser: 15000 }, // Focused tier (most popular)
    { sats: 30000, laser: 30000 }, // Visionary tier
    { sats: 75000, laser: 75000 }  // Diamond tier
]
```
- `sats`: Amount user pays in satoshis
- `laser`: Amount of LASER tokens they receive
- Add/remove tiers as needed

### Token Economics
```javascript
laserPerSat: 1,           // Exchange rate: 1 LASER = 1 sat
totalSupply: 1000000000,  // 1 billion LASER tokens
referralBonus: 0.02,      // 2% bonus for referrals
```

### Initial Stats
```javascript
initialProgress: 0.523,   // 52.3% progress bar
initialHolders: 733,      // Starting holder count
```
💡 **Tip**: Set these to create FOMO. Higher numbers = more social proof.

---

## 🎨 Visual Customization (styles.css)

### Color Scheme
```css
:root {
    --laser-yellow: #FFD700;   /* Primary brand color */
    --laser-orange: #FF8C00;   /* Secondary accent */
    --laser-red: #FF4500;      /* Call-to-action */
    --laser-glow: #FFFF00;     /* Glow effects */
    --dark-bg: #0a0a0a;        /* Background */
    --card-bg: #1a1a1a;        /* Card backgrounds */
}
```

Change these hex codes to match your brand:
- Yellow → Gold tone
- Orange → Warm accent
- Red → Urgent CTAs

### Gradient Effects
```css
--gradient-primary: linear-gradient(135deg, 
    var(--laser-yellow) 0%, 
    var(--laser-orange) 50%, 
    var(--laser-red) 100%
);
```

### Typography
Current fonts:
- **Headlines**: Bebas Neue (bold, condensed)
- **Subheadings**: Archivo Black (heavy, impactful)
- **Body**: Work Sans (clean, readable)
- **Code/Addresses**: Press Start 2P (retro gaming)
- **Accents**: Righteous (bold display)

Change fonts in `<head>` of index.html:
```html
<link href="https://fonts.googleapis.com/css2?family=YourFont&display=swap" rel="stylesheet">
```

Then update CSS:
```css
.hero-title {
    font-family: 'Your Font', sans-serif;
}
```

---

## 📝 Content Customization (index.html)

### Hero Section (Line ~60)
```html
<h2 class="hero-title">THE VISION IS CLEAR</h2>
<p class="hero-subtitle">
    Bitcoin L1 DeFi just got its eyes on the prize...
</p>
```

### Story Section (Line ~120)
Update your token's story:
- What is LASER?
- Why it exists
- The vision/mission

### Tagline (Line ~35)
```html
<p class="tagline">LASER-FOCUSED ON 100K 🎯</p>
```
Keep it short, punchy, memorable!

### Social Links (Line ~380)
```html
<a href="https://twitter.com/yourproject" target="_blank">Twitter/X</a>
<a href="https://t.me/yourproject" target="_blank">Telegram</a>
<a href="https://discord.gg/yourproject" target="_blank">Discord</a>
```

---

## 🔗 Blockchain Integration

### Payment Monitoring

**Option 1: Blockstream API** (Recommended for testing)
```javascript
const apiUrl = `https://blockstream.info/api/address/${CONFIG.btcAddress}/txs`;
```
- Free
- No API key needed
- Rate limited

**Option 2: Mempool.space API**
```javascript
const apiUrl = `https://mempool.space/api/address/${CONFIG.btcAddress}/txs`;
```
- Free
- Good documentation
- WebSocket support available

**Option 3: Bitcoin Core RPC** (Production recommended)
```javascript
// Requires running Bitcoin node
const bitcoin = require('bitcoin-core');
const client = new bitcoin({
    network: 'mainnet',
    username: 'your-rpc-user',
    password: 'your-rpc-password',
    host: 'your-node-ip',
    port: 8332
});
```

### Wallet Support

Currently supports:
1. **OP_WALLET** (Official OpNet wallet)
2. **Unisat** (Popular Bitcoin wallet)

Add more wallets by extending:
```javascript
async function connectXverseWallet() {
    if (window.XverseProviders?.BitcoinProvider) {
        // Implementation
    }
}
```

---

## 📊 Tokenomics Display (index.html, Line ~280)

```html
<div class="token-stat">
    <div class="token-icon">🔥</div>
    <div class="token-label">Presale Allocation</div>
    <div class="token-value">40%</div>
</div>
```

Update percentages based on your tokenomics:
- Presale: 40%
- Liquidity: 30%
- Community: 20%
- Development: 10%

**Total must = 100%**

---

## 🗺️ Roadmap (index.html, Line ~315)

```html
<div class="roadmap-item completed">
    <div class="roadmap-checkpoint">✅</div>
    <div class="roadmap-content">
        <h4>Q1 2026: Vision Initialized</h4>
        <p>Presale launch. Community building.</p>
    </div>
</div>
```

Classes:
- `completed` - ✅ checkmark (done)
- `active` - 👁️ pulsing (in progress)
- No class - ⚡ upcoming

---

## 🎯 Advanced Options

### Whitelist Mode
Add before tier selection:
```javascript
const WHITELIST = [
    'bc1p...address1',
    'bc1p...address2',
    // ...
];

if (!WHITELIST.includes(state.walletAddress)) {
    showNotification('Address not whitelisted', 'error');
    return;
}
```

### Presale Time Limit
```javascript
const PRESALE_END = new Date('2026-05-01T00:00:00Z');

if (Date.now() > PRESALE_END) {
    showNotification('Presale has ended', 'error');
    return;
}
```

### Hard Cap
```javascript
const HARD_CAP_SATS = 10000000; // 0.1 BTC
let totalRaised = 0;

if (totalRaised + sats > HARD_CAP_SATS) {
    showNotification('Hard cap reached!', 'error');
    return;
}
```

### Multiple Payment Addresses
```javascript
const PAYMENT_ADDRESSES = [
    'bc1p...address1', // For tier 1 & 2
    'bc1p...address2', // For tier 3 & 4
];

const address = state.selectedTier.sats > 20000 
    ? PAYMENT_ADDRESSES[1] 
    : PAYMENT_ADDRESSES[0];
```

---

## 🔔 Notifications

Customize notification styles in `app.js`:
```javascript
function showNotification(message, type = 'info') {
    // type: 'success', 'error', 'info'
    // Modify colors, position, duration
}
```

Position options:
- `top: 100px; right: 20px` (current)
- `bottom: 20px; right: 20px`
- `top: 50%; left: 50%; transform: translate(-50%, -50%)`

---

## 🌐 Multi-Language Support

Add language switcher:
```javascript
const TRANSLATIONS = {
    en: {
        connect: 'Connect Wallet',
        buy: 'Get LASER Eyes Now'
    },
    es: {
        connect: 'Conectar Billetera',
        buy: 'Obtener LASER Ahora'
    }
};

let currentLang = 'en';
```

---

## 🎨 Animation Speed

Adjust in `styles.css`:

```css
/* Laser beam animation */
@keyframes beamMove {
    /* duration: 8s (current) */
    animation: beamMove 4s linear infinite; /* Faster */
}

/* Progress pulse */
@keyframes progressPulse {
    /* duration: 2s (current) */
    animation: progressPulse 1s ease-in-out infinite; /* Faster */
}
```

---

## 🔧 Performance Optimization

### Lazy Load Images
```html
<img src="placeholder.jpg" data-src="large-image.jpg" loading="lazy">
```

### Minify CSS/JS
Before production:
```bash
# Install minifier
npm install -g clean-css-cli uglify-js

# Minify CSS
cleancss -o styles.min.css styles.css

# Minify JS
uglifyjs app.js -o app.min.js -c -m
```

Update references in HTML:
```html
<link rel="stylesheet" href="styles.min.css">
<script src="app.min.js"></script>
```

---

## 📱 Mobile Optimization

Test breakpoints in `styles.css`:
```css
@media (max-width: 968px) {
    /* Tablet */
}

@media (max-width: 640px) {
    /* Mobile */
}
```

Add custom mobile styles:
```css
@media (max-width: 640px) {
    .hero-title {
        font-size: 32px; /* Smaller on mobile */
    }
}
```

---

## 🎯 Conversion Optimization Tips

1. **FOMO Elements**
   - "Only 477M LASER remaining!"
   - "733 early adopters already in"
   - Countdown timer

2. **Trust Signals**
   - Display recent purchases
   - Show total raised
   - Community member count

3. **Clear CTAs**
   - Make "Get LASER Eyes Now" button HUGE
   - Use contrasting colors
   - Add urgency text

4. **Reduce Friction**
   - One-click tier selection
   - QR code for mobile
   - Clear instructions

5. **Social Proof**
   - Testimonials (if available)
   - Partner logos
   - Media mentions

---

## 📊 Testing Checklist

Before going live:

**Visual:**
- [ ] All colors match brand
- [ ] Fonts load correctly
- [ ] Animations smooth
- [ ] Mobile responsive
- [ ] No layout breaks

**Functional:**
- [ ] Wallet connects
- [ ] Tiers selectable
- [ ] QR generates
- [ ] Address correct
- [ ] Copy buttons work
- [ ] Referral system works

**Content:**
- [ ] No typos
- [ ] All links work
- [ ] Social links correct
- [ ] Legal disclaimers
- [ ] Contact info

**Technical:**
- [ ] HTTPS enabled
- [ ] Fast load time (<3s)
- [ ] No console errors
- [ ] Works in all browsers
- [ ] Analytics tracking

---

## 💡 Quick Wins

**5-Minute Customizations:**
1. Update Bitcoin address (app.js line 2)
2. Change hero title (index.html line 60)
3. Update social links (index.html line 380)
4. Deploy to Vercel (`vercel --prod`)

**1-Hour Customizations:**
1. Custom color scheme (styles.css)
2. Write your story (index.html story section)
3. Create custom graphics
4. Set up analytics

**1-Day Customizations:**
1. Implement real payment monitoring
2. Add backend database
3. Create admin dashboard
4. Set up email notifications

---

## 🆘 Support

If stuck:
1. Check browser console (F12)
2. Review this guide
3. Read README.md
4. Check DEPLOYMENT.md
5. Test in different browser

---

**Remember**: Start simple, test thoroughly, iterate based on feedback!

Good luck! 🚀👁️‍🗨️

#LaserRayUntil100K

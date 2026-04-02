# LASER Token Presale Landing Page 👁️⚡

**Laser-Focused on 100K** - The most bullish OP20 token on Bitcoin L1

A viral, meme-style presale landing page for LASER token built on OpNet (Bitcoin Layer 1 Smart Contracts).

## 🎯 Features

- **Real Blockchain Integration**: Automatically detects Bitcoin payments via blockchain APIs (NO BACKEND NEEDED!)
- **Wallet Integration**: Connect with OP_WALLET or Unisat
- **Live Payment Tracking**: Monitors Blockchain.info, Blockstream, and BlockCypher APIs
- **Countdown Timer**: Live countdown to presale end (April 30, 2026)
- **Referral System**: +2% bonus for both referrer and referee
- **Progress Tracking**: Live progress bar showing presale completion
- **QR Code Payments**: Easy mobile payments with Bitcoin URI
- **Responsive Design**: Works on desktop and mobile
- **Viral Meme Aesthetics**: Yellow/Orange/Red gradient theme with laser effects

## 🚀 Quick Start

### 1. Configuration

**GOOD NEWS**: The BTC address is already configured!
- Address: `1CLJ2BUCVuALR3XUQAcwKDvvEZuViSCUka`
- Presale End: April 30, 2026 at 23:59:59 UTC

All you need to do is deploy!

### 2. Local Testing

Simply open `index.html` in a web browser. 

**Real Features That Work Locally**:
- ✅ Countdown timer (live)
- ✅ Payment detection (real blockchain APIs)
- ✅ Wallet connection (if extensions installed)
- ✅ QR code generation

### 3. Deploy to Production

#### Option A: Vercel (EASIEST - 30 seconds)
```bash
npm i -g vercel
cd laser-presale
vercel --prod
```
Done! 🚀

#### Option B: GitHub Pages
1. Create repository
2. Upload files
3. Enable Pages in Settings
4. Live at `https://yourusername.github.io/laser-presale`

See `DEPLOYMENT.md` for detailed instructions.

## ⚡ NEW: Real Blockchain Payment Detection

**NO BACKEND REQUIRED!** The site now automatically detects payments using:

1. **Blockchain.info API** (primary)
2. **Blockstream API** (fallback #1)
3. **BlockCypher API** (fallback #2)

### How It Works:
1. User connects wallet
2. Selects tier and gets QR code
3. Sends Bitcoin to: `1CLJ2BUCVuALR3XUQAcwKDvvEZuViSCUka`
4. Site checks blockchain every 60 seconds
5. When payment detected → LASER balance updates automatically!
6. All tracked in localStorage (persists across sessions)

**No server needed. No database needed. Pure client-side magic!** ✨

## ⏰ Countdown Timer

Live countdown to presale end:
- **End Date**: April 30, 2026 at 23:59:59 UTC
- Updates every second
- Shows: Days : Hours : Minutes : Seconds
- Turns red when < 24 hours left
- Auto-disables purchases when expired

## 🔐 Security & Privacy

- ✅ No server-side code
- ✅ No database
- ✅ No private keys stored
- ✅ Only public addresses
- ✅ All data in user's browser (localStorage)
- ✅ Multiple API fallbacks for reliability

## 📁 File Structure

```
laser-presale/
├── index.html          # Main HTML file
├── styles.css          # All styles and animations
├── app.js             # JavaScript logic
└── README.md          # This file
```

## 🎨 Customization

### Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --laser-yellow: #FFD700;
    --laser-orange: #FF8C00;
    --laser-red: #FF4500;
    /* ... */
}
```

### Presale Tiers
Modify in `app.js`:
```javascript
tiers: [
    { sats: 7500, laser: 7500 },
    { sats: 15000, laser: 15000 },
    { sats: 30000, laser: 30000 },
    { sats: 75000, laser: 75000 }
]
```

### Initial Progress
Set initial presale progress:
```javascript
initialProgress: 0.523, // 52.3%
initialHolders: 733
```

### Content
All text content is in `index.html` - easily editable without coding knowledge.

## 🔐 Security Considerations

1. **Never store private keys**: The site only requests public addresses
2. **HTTPS required**: Always use HTTPS in production
3. **Verify payments server-side**: Don't trust client-side payment verification
4. **Rate limiting**: Implement on backend to prevent spam
5. **Input validation**: Sanitize all user inputs
6. **CORS headers**: Configure properly if using backend API

## 🧪 Testing Checklist

Before going live:

- [ ] Update `btcAddress` with your real Bitcoin address
- [ ] Test wallet connection (OP_WALLET and Unisat)
- [ ] Verify QR code generates correctly
- [ ] Test referral link generation
- [ ] Test on mobile devices
- [ ] Test on different browsers
- [ ] Implement real payment monitoring
- [ ] Set up backend database (recommended)
- [ ] Configure analytics (Google Analytics, Plausible, etc.)
- [ ] Set up error logging (Sentry, LogRocket, etc.)
- [ ] Test payment flow end-to-end
- [ ] Review all text content for typos
- [ ] Verify social media links work
- [ ] Test copy-to-clipboard functionality

## 📊 Analytics Integration

Add analytics to track conversions:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

Track events:
```javascript
// In app.js when important actions happen
gtag('event', 'wallet_connected', {
    'wallet_type': state.walletType
});

gtag('event', 'tier_selected', {
    'tier_amount': state.selectedTier.laser
});

gtag('event', 'purchase_completed', {
    'value': state.selectedTier.sats,
    'currency': 'BTC'
});
```

## 🛠️ Troubleshooting

**Wallet won't connect:**
- Ensure OP_WALLET or Unisat extension is installed
- Check browser console for errors
- Try refreshing the page

**QR code not showing:**
- Verify QRCode.js library is loading
- Check browser console for errors
- Ensure `btcAddress` is set correctly

**Payments not detected:**
- Implement actual blockchain monitoring (see Production Setup)
- Check Bitcoin address is correct
- Verify transactions have sufficient confirmations

**Styling issues:**
- Clear browser cache
- Check CSS file is loading correctly
- Verify no conflicting styles from browser extensions

## 📱 Social Media Kit

Promote your presale with these hashtags:
- #LASER
- #LaserRayUntil100K
- #OpNet
- #BitcoinL1
- #OP20
- #SlowFi
- #BTCfi

Example tweets:
```
🎯 $LASER presale is LIVE!

The first meme token with actual vision on Bitcoin L1.

✅ No bridges
✅ No wrapped tokens
✅ Pure OP20 on OpNet

Join 733+ early visionaries.

👁️‍🗨️ [YOUR PRESALE LINK]

#LaserRayUntil100K
```

## 📄 License

This is a template for your token presale. Customize and use as you wish.

**Disclaimer**: This is not financial advice. Cryptocurrency investments are risky. Users should DYOR (Do Your Own Research).

## 🤝 Support

For issues or questions:
1. Check this README first
2. Review browser console for errors
3. Test on different browsers/devices
4. Verify wallet extensions are up to date

## 🚀 Future Enhancements

Consider adding:
- Email notifications for payments
- Multi-language support
- Dark/light mode toggle
- Admin dashboard for managing presale
- Whitelist/KYC integration
- Vesting schedule display
- Token claim interface (post-presale)
- Community leaderboard
- Live transaction feed

---

**Built with 👁️ for the Bitcoin community**

*Remember: We don't chase pumps. We lock onto targets.* ⚡

#LaserRayUntil100K

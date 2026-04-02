# 🚀 LASER Token Presale - Deployment Guide

Complete step-by-step guide to deploy your presale landing page.

## ⚠️ BEFORE DEPLOYMENT

### Critical Configuration Steps

1. **Update Bitcoin Address** (MANDATORY)
   - Open `app.js`
   - Find line ~2: `btcAddress: 'bc1p...your-taproot-address-here'`
   - Replace with YOUR actual Bitcoin Taproot address
   - This is where you'll receive presale payments

2. **Test Locally First**
   - Open `index.html` in browser
   - Connect wallet (install OP_WALLET or Unisat first)
   - Select a tier
   - Verify QR code generates correctly
   - Check Bitcoin address is correct

3. **Update Social Links** (in `index.html`)
   - Line ~380: Twitter/X link
   - Line ~381: Telegram link
   - Line ~382: Discord link
   - Replace `#` with your actual social media URLs

## 📦 Deployment Options

### Option 1: Vercel (RECOMMENDED - Easiest)

**Why Vercel?**
- ✅ Free hosting
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Instant deployment
- ✅ Custom domain support
- ✅ Automatic Git integration

**Steps:**

1. **Install Vercel CLI** (one-time setup)
   ```bash
   npm install -g vercel
   ```

2. **Navigate to project**
   ```bash
   cd laser-presale
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Follow prompts:**
   - Set up and deploy? → Yes
   - Which scope? → Your account
   - Link to existing project? → No
   - Project name? → laser-presale (or your choice)
   - Directory? → ./ (current directory)
   - Override settings? → No

5. **Production deployment:**
   ```bash
   vercel --prod
   ```

6. **Your site is LIVE!**
   - You'll get a URL like: `https://laser-presale.vercel.app`
   - Add custom domain in Vercel dashboard

**Custom Domain on Vercel:**
1. Go to Vercel dashboard
2. Select your project
3. Settings → Domains
4. Add your domain
5. Update DNS records as instructed
6. Wait for SSL certificate (automatic)

---

### Option 2: GitHub Pages (Free)

**Steps:**

1. **Create GitHub repository**
   - Go to https://github.com/new
   - Name it: `laser-presale`
   - Make it public
   - Don't initialize with README

2. **Upload files**
   - Upload: `index.html`, `styles.css`, `app.js`, `README.md`
   - Or use Git:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/laser-presale.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**
   - Go to repository Settings
   - Scroll to "Pages" section
   - Source: main branch
   - Folder: / (root)
   - Save

4. **Your site is live!**
   - URL: `https://yourusername.github.io/laser-presale`
   - Takes 1-2 minutes to deploy

**Custom Domain on GitHub Pages:**
1. Settings → Pages → Custom domain
2. Enter your domain: `presale.yourdomain.com`
3. Add DNS records at your domain provider:
   - Type: CNAME
   - Name: presale
   - Value: yourusername.github.io
4. Wait for DNS propagation (up to 24h)
5. Enable "Enforce HTTPS" in GitHub Pages settings

---

### Option 3: Netlify (Alternative)

**Steps:**

1. **Drag & Drop Method:**
   - Go to https://app.netlify.com/drop
   - Drag the entire `laser-presale` folder
   - Site deploys instantly
   - Get URL like: `https://random-name.netlify.app`

2. **Or use Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   netlify deploy
   netlify deploy --prod
   ```

**Custom Domain on Netlify:**
1. Domain settings in Netlify dashboard
2. Add custom domain
3. Update DNS records
4. Automatic HTTPS

---

### Option 4: Traditional Web Hosting

**For services like:**
- HostGator, Bluehost, SiteGround, GoDaddy, etc.

**Steps:**

1. **Connect via FTP/cPanel:**
   - Get FTP credentials from your host
   - Use FileZilla or cPanel File Manager

2. **Upload files to public_html/**
   - `index.html`
   - `styles.css`
   - `app.js`

3. **Access your site:**
   - `https://yourdomain.com`

4. **Enable HTTPS:**
   - Most hosts offer free SSL (Let's Encrypt)
   - Enable in cPanel → SSL/TLS

---

## 🔧 Post-Deployment Checklist

After deployment, verify:

- [ ] Website loads correctly
- [ ] Wallet connection works (OP_WALLET & Unisat)
- [ ] Tier selection works
- [ ] QR code displays
- [ ] Bitcoin address is CORRECT
- [ ] Copy address button works
- [ ] Referral links generate
- [ ] Mobile responsive design works
- [ ] All social links work
- [ ] HTTPS is enabled
- [ ] No console errors

## 📊 Setup Analytics (Recommended)

### Google Analytics

1. **Get Tracking ID:**
   - Go to https://analytics.google.com
   - Create account/property
   - Get Measurement ID (G-XXXXXXXXXX)

2. **Add to index.html** (before `</head>`):
   ```html
   <!-- Google Analytics -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXXXXX');
   </script>
   ```

### Track Conversions

Add to `app.js` in the `selectTier` function:
```javascript
// Track tier selection
gtag('event', 'tier_selected', {
    'event_category': 'presale',
    'event_label': `${laser} LASER`,
    'value': sats
});
```

---

## 🔐 Security Setup

### 1. Environment Variables (for API keys)

If you add backend APIs, use environment variables:

**Vercel:**
```bash
vercel env add BITCOIN_API_KEY
```

**Netlify:**
- Dashboard → Site settings → Environment variables

**GitHub Pages:**
- Use GitHub Secrets for Actions

### 2. Rate Limiting

If implementing backend, add rate limiting:
```javascript
// Example with Express
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use("/api/", limiter);
```

---

## 🎯 Marketing Launch Checklist

Before announcing:

- [ ] Test everything on multiple devices
- [ ] Set up social media accounts
- [ ] Prepare announcement tweets
- [ ] Create graphics/videos for social
- [ ] Set up Telegram/Discord community
- [ ] Prepare FAQ document
- [ ] Test referral system
- [ ] Monitor server/hosting limits
- [ ] Have customer support ready
- [ ] Legal disclaimer in place

---

## 🚨 Troubleshooting

### "Wallet won't connect"
- Clear browser cache
- Disable ad blockers
- Try different browser
- Reinstall wallet extension

### "Site not loading after deployment"
- Wait 5-10 minutes (DNS propagation)
- Clear browser cache
- Check domain DNS settings
- Verify hosting is active

### "QR code not showing"
- Check browser console
- Verify QRCode.js CDN is loading
- Check btcAddress is set

### "Payments not detected"
- Implement blockchain monitoring (see README)
- Check Bitcoin address is correct
- Monitor transactions manually

---

## 📱 Mobile Testing

Test on:
- iOS Safari
- iOS Chrome
- Android Chrome
- Android Firefox

Check:
- Wallet connection (may need mobile wallets)
- QR code scanning
- Touch interactions
- Layout/responsiveness

---

## 🔄 Updates & Maintenance

### Update Content:
1. Edit files locally
2. Re-deploy:
   - **Vercel:** `vercel --prod`
   - **GitHub Pages:** Push to repository
   - **Netlify:** Drag & drop or CLI deploy
   - **cPanel:** Re-upload via FTP

### Monitor:
- Check analytics daily
- Monitor blockchain for payments
- Respond to community questions
- Update progress bar as sales increase

---

## 💡 Advanced Features (Optional)

### Add Email Collection:
```html
<form id="emailForm">
  <input type="email" placeholder="Get notified on launch">
  <button>Subscribe</button>
</form>
```

### Add Countdown Timer:
```javascript
const launchDate = new Date('2026-04-15T00:00:00Z');
// Calculate and display time remaining
```

### Add Live Transaction Feed:
```javascript
// Display recent purchases
<div class="recent-purchases">
  <p>0x1234...5678 just bought 15,000 LASER!</p>
</div>
```

---

## 📞 Support Resources

- **Bitcoin Development:** https://bitcoin.org/en/developer-documentation
- **OpNet Docs:** https://opnet.org/docs
- **Vercel Support:** https://vercel.com/support
- **GitHub Pages Docs:** https://docs.github.com/en/pages

---

## ✅ Final Pre-Launch Checklist

**Configuration:**
- [ ] Bitcoin address updated
- [ ] Social links updated
- [ ] Analytics installed
- [ ] All text reviewed

**Testing:**
- [ ] Desktop tested (Chrome, Firefox, Safari)
- [ ] Mobile tested (iOS, Android)
- [ ] Wallet connection tested
- [ ] Payment flow tested
- [ ] Referral system tested

**Deployment:**
- [ ] Site live and accessible
- [ ] HTTPS enabled
- [ ] Custom domain configured (if applicable)
- [ ] DNS propagated

**Marketing:**
- [ ] Social media ready
- [ ] Community channels set up
- [ ] Launch announcement prepared
- [ ] Support team ready

---

🎯 **Ready to launch?**

1. Deploy your site
2. Test everything one more time
3. Announce on social media
4. Monitor closely for first 24-48 hours
5. Respond to community quickly
6. Update progress regularly

**Good luck with your presale! 🚀👁️‍🗨️**

#LaserRayUntil100K

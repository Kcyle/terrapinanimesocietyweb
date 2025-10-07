# Deployment Guide 🚀

Your multi-page website is now ready to deploy! Here are several free and easy options:

## Option 1: GitHub Pages (Recommended - Free & Easy)

**Best for:** Free hosting with custom domain support

### Steps:
1. **Create a GitHub repository**
   ```bash
   cd "c:\Users\Kyle\Downloads\terrapinanimesocietyweb-main"
   git init
   git add .
   git commit -m "Initial commit - reorganized multi-page website"
   ```

2. **Create a new repository on GitHub.com**
   - Go to https://github.com/new
   - Name it (e.g., `terrapin-anime-society`)
   - Don't initialize with README (you already have files)

3. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/terrapin-anime-society.git
   git branch -M main
   git push -u origin main
   ```

4. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from branch `main`
   - Folder: `/ (root)`
   - Click Save

5. **Your site will be live at:**
   `https://YOUR_USERNAME.github.io/terrapin-anime-society/`

---

## Option 2: Netlify (Easiest - Drag & Drop)

**Best for:** Instant deployment with automatic HTTPS

### Steps:
1. Go to https://www.netlify.com/
2. Sign up (free account)
3. Click "Add new site" → "Deploy manually"
4. **Drag and drop** your entire `terrapinanimesocietyweb-main` folder
5. Done! Your site is live instantly

**Benefits:**
- Automatic HTTPS
- Custom domain support
- Instant preview
- Continuous deployment from Git

---

## Option 3: Vercel

**Best for:** Fast global CDN, great performance

### Steps:
1. Go to https://vercel.com/
2. Sign up (free)
3. Click "New Project"
4. Import from Git (or drag & drop)
5. Deploy

---

## Option 4: Traditional Web Host (cPanel/FTP)

**Best for:** If you already have web hosting

### Steps:
1. Connect via FTP (FileZilla, WinSCP, or cPanel File Manager)
2. Upload all files to `public_html` or `www` directory:
   ```
   public_html/
   ├── index.html
   ├── meetings.html
   ├── events.html
   ├── (all other HTML files)
   ├── styles/
   ├── js/
   ├── images/
   └── audio/
   ```
3. Visit your domain - done!

**Common hosts:** Bluehost, HostGator, SiteGround, etc.

---

## Option 5: Firebase Hosting

**Best for:** Google's free hosting with fast CDN

### Steps:
1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login and initialize:
   ```bash
   firebase login
   firebase init hosting
   ```

3. Configure:
   - Public directory: `.` (current directory)
   - Single-page app: `No`
   - GitHub deploys: Optional

4. Deploy:
   ```bash
   firebase deploy
   ```

---

## Quick Comparison

| Service | Free Tier | Custom Domain | HTTPS | Difficulty |
|---------|-----------|---------------|-------|------------|
| **GitHub Pages** | ✅ Unlimited | ✅ Yes | ✅ Auto | Easy |
| **Netlify** | ✅ 100GB/mo | ✅ Yes | ✅ Auto | Easiest |
| **Vercel** | ✅ Unlimited | ✅ Yes | ✅ Auto | Easy |
| **Firebase** | ✅ 10GB/mo | ✅ Yes | ✅ Auto | Medium |
| **Traditional Host** | ❌ Paid | ✅ Yes | ⚠️ Varies | Medium |

---

## Pre-Deployment Checklist

Before deploying, verify:

- [ ] All images are in `images/` folder
- [ ] All audio files are in `audio/` folder
- [ ] Test all pages locally first
- [ ] Check all navigation links work
- [ ] Test on mobile (responsive design)
- [ ] Update contact form action if needed
- [ ] Check for any hardcoded localhost URLs

---

## Recommended: GitHub Pages (Detailed Guide)

Since you're already in a Git repository context, here's the complete workflow:

### 1. Initialize Git (if not done)
```bash
cd "c:\Users\Kyle\Downloads\terrapinanimesocietyweb-main"
git init
git add .
git commit -m "Initial commit - Terrapin Anime Society website"
```

### 2. Create `.gitignore` file (optional but recommended)
```bash
echo "node_modules/" > .gitignore
echo ".DS_Store" >> .gitignore
echo "*.log" >> .gitignore
echo "reorganize.js" >> .gitignore
echo "reorganize.py" >> .gitignore
echo "index.html.original" >> .gitignore
echo "index.html.original.backup" >> .gitignore
git add .gitignore
git commit -m "Add gitignore"
```

### 3. Create GitHub repository
- Go to https://github.com/new
- Repository name: `terrapin-anime-society` (or your choice)
- Public or Private: **Public** (required for free GitHub Pages)
- Click "Create repository"

### 4. Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/terrapin-anime-society.git
git branch -M main
git push -u origin main
```

### 5. Enable GitHub Pages
- Go to your repository on GitHub
- Click "Settings" tab
- Click "Pages" in left sidebar
- Under "Source":
  - Branch: `main`
  - Folder: `/ (root)`
- Click "Save"
- Wait 1-2 minutes

### 6. Access your site
Your site will be available at:
```
https://YOUR_USERNAME.github.io/terrapin-anime-society/
```

### 7. Custom Domain (Optional)
If you have a custom domain:
- In GitHub Pages settings, add your custom domain
- In your domain registrar (Namecheap, GoDaddy, etc.), add DNS records:
  - Type: `CNAME`
  - Host: `www`
  - Value: `YOUR_USERNAME.github.io`

---

## Testing Before Deployment

### Local Testing
1. Open `index.html` in your browser
2. Click through all navigation links
3. Test all interactive features
4. Check on mobile (browser dev tools → device emulation)

### Common Issues & Fixes

**Issue:** Images not loading
- **Fix:** Ensure paths are relative (`images/file.png`, not `/images/file.png`)

**Issue:** Navigation doesn't work
- **Fix:** Links should be `href="page.html"` not `href="/page.html"` for GitHub Pages subdirectories

**Issue:** Audio not playing
- **Fix:** Check browser console for errors, ensure audio files exist in `audio/` folder

**Issue:** Styles not loading
- **Fix:** Check CSS file paths in `<link>` tags are relative (`styles/global.css`)

---

## Need Help?

- **GitHub Pages Docs:** https://pages.github.com/
- **Netlify Docs:** https://docs.netlify.com/
- **Vercel Docs:** https://vercel.com/docs

---

## My Recommendation

For your use case (student organization website), I recommend:

**🥇 First Choice: Netlify**
- Easiest deployment (drag & drop)
- Auto HTTPS
- Great performance
- Free tier is generous

**🥈 Second Choice: GitHub Pages**
- Free unlimited bandwidth
- Version control built-in
- Easy to update (just push to Git)
- Great for collaboration

Both are excellent, free, and professional. Choose based on your workflow preference!

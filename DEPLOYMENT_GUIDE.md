# GitHub Pages Deployment Guide - ATLAS & Cerebro

## 🎉 Successfully Deployed Applications

### ✅ ATLAS (Main Application)
- **URL**: https://stvnko-amzn.github.io
- **Location**: Main branch, root directory
- **Type**: React/Vite application (Supply Chain Intelligence Platform)
- **Status**: ✅ Working perfectly

### ✅ Cerebro (Prototype Application)
- **URL**: https://stvnko-amzn.github.io/cerebro/index.html
- **Location**: Main branch, `/cerebro/` subdirectory
- **Type**: Static React application (Vendor Research Platform)
- **Status**: ✅ Working perfectly

## 📁 Repository Structure

```
stvnko-amzn.github.io/
├── index.html              # ATLAS application (built from dist/)
├── assets/                  # ATLAS CSS/JS assets
├── cerebro/
│   └── index.html          # Cerebro static application
├── dist/                   # ATLAS build output (source)
├── src/                    # ATLAS source code
├── package.json            # ATLAS dependencies
└── [other ATLAS files]
```

## 🔄 Maintenance Workflows

### Updating ATLAS Application

1. **Make changes to ATLAS source code** in the repository
2. **Build the application**:
   ```bash
   cd /path/to/stvnko-amzn.github.io
   npm run build
   ```
3. **Copy built files to root**:
   ```bash
   cp dist/index.html .
   cp -r dist/assets .
   cp dist/.nojekyll .
   ```
4. **Commit and push**:
   ```bash
   git add .
   git commit -m "Update ATLAS application"
   git push origin main
   ```

### Updating Cerebro Application

1. **Update Cerebro in development repository** (`cerebro-vendor-research`)
2. **Copy updated static file**:
   ```bash
   cp "/path/to/cerebro-vendor-research/index.html" cerebro/
   ```
3. **Commit and push**:
   ```bash
   git add cerebro/
   git commit -m "Update Cerebro prototype"
   git push origin main
   ```

## 🌐 Access URLs

### For Sharing & Demos
- **ATLAS**: `https://stvnko-amzn.github.io`
- **Cerebro**: `https://stvnko-amzn.github.io/cerebro/index.html`

### Alternative Access (if needed)
- **Cerebro Branch**: The `cerebro` branch contains a standalone version
- **Direct File Access**: Both applications work with direct file access

## 🔧 GitHub Pages Configuration

### Current Settings
- **Source**: Deploy from main branch
- **Directory**: Root (`/`)
- **Custom Domain**: None (using default GitHub Pages URL)

### How It Works
- GitHub Pages serves the main branch from the root directory
- ATLAS files are in the root, so `stvnko-amzn.github.io` loads ATLAS
- Cerebro files are in `/cerebro/` subdirectory, accessible at `/cerebro/index.html`

## 🚀 Deployment History

### What Was Fixed
1. **ATLAS Recovery**: Restored from built `dist/` folder to root directory
2. **Cerebro Integration**: Added as subdirectory for easy prototype sharing
3. **Dual Application Setup**: Both applications now work from single repository

### Previous Issues Resolved
- ✅ Blank page issue (ATLAS was serving development files instead of built files)
- ✅ 404 errors (proper file structure and GitHub Pages configuration)
- ✅ Branch conflicts (clean separation between ATLAS and Cerebro)

## 📋 Testing Checklist

Before making changes, always test:

### ATLAS Testing
- [ ] Visit https://stvnko-amzn.github.io
- [ ] Verify role selection interface loads
- [ ] Check for console errors
- [ ] Test basic navigation

### Cerebro Testing
- [ ] Visit https://stvnko-amzn.github.io/cerebro/index.html
- [ ] Verify search interface loads
- [ ] Test file upload area
- [ ] Check sample questions display
- [ ] Verify no console errors (warnings are OK)

## 🔍 Troubleshooting

### Common Issues

#### ATLAS Not Loading
1. Check if `index.html` in root is the built version (should reference `/assets/` files)
2. Verify `assets/` folder exists with CSS/JS files
3. Rebuild from `dist/` if necessary

#### Cerebro Not Loading
1. Verify `cerebro/index.html` exists and is the complete static file
2. Check file size (should be ~68KB for full application)
3. Test direct file access: `/cerebro/index.html`

#### GitHub Pages Not Updating
1. Check GitHub Actions tab for deployment status
2. Wait 5-10 minutes for changes to propagate
3. Clear browser cache and try again
4. Verify commits were pushed to `main` branch

### Emergency Recovery

If something breaks:

1. **ATLAS Recovery**:
   ```bash
   cp dist/index.html .
   cp -r dist/assets .
   git add . && git commit -m "Restore ATLAS" && git push origin main
   ```

2. **Cerebro Recovery**:
   ```bash
   cp "/path/to/cerebro-vendor-research/index.html" cerebro/
   git add cerebro/ && git commit -m "Restore Cerebro" && git push origin main
   ```

## 📞 Support Information

### Repository Details
- **Main Repository**: `stvnko-amzn/stvnko-amzn.github.io`
- **Development Repository**: `stvnko-amzn/cerebro-vendor-research`
- **GitHub Pages URL**: https://stvnko-amzn.github.io

### Key Files
- `index.html` (root) - ATLAS application
- `cerebro/index.html` - Cerebro application
- `dist/` - ATLAS build output (source of truth for ATLAS)
- `.nojekyll` - Prevents Jekyll processing

---

## ✅ Success Summary

Both applications are now successfully deployed and accessible:

1. **ATLAS** restored and working at main URL
2. **Cerebro** available as prototype at `/cerebro/` path
3. **Clean separation** between applications
4. **Easy maintenance** workflow established
5. **Professional URLs** for sharing and demos

The GitHub Pages site is now fully functional with both projects! 🎉

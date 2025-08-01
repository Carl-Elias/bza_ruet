# BZA RUET Website - Deployment Workflow Reference

## 🔄 Development & Deployment Workflow

### For Testing/Development:
```bash
npm run dev          # Test locally first
git add .
git commit -m "WIP: testing new feature"
git push            # Save progress to GitHub (but don't deploy yet)
```

### For Production Updates:
```bash
npm run dev          # Test locally
git add .
git commit -m "Add alumni search functionality"
git push            # Save to GitHub
./deploy.sh         # Deploy to live website
```

### For Quick Fixes:
```bash
# Edit files
./deploy.sh         # Deploy immediately
# Then later:
git add .
git commit -m "Quick fix for registration form"
git push           # Save to GitHub
```

## 📋 Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server at http://localhost:5173 |
| `npm run build` | Build for production |
| `./deploy.sh` | Build and deploy to Firebase Hosting |
| `firebase serve` | Preview production build locally |
| `git add .` | Stage all changes |
| `git commit -m "message"` | Commit changes with message |
| `git push` | Push to GitHub repository |

## 🌐 Important URLs

- **Live Website**: https://bza-ruet-alumni-477a6.web.app
- **GitHub Repository**: https://github.com/Carl-Elias/bza_ruet
- **Firebase Console**: https://console.firebase.google.com/project/bza-ruet-alumni-477a6

## 🎯 Key Pages

- **Home**: https://bza-ruet-alumni-477a6.web.app
- **Alumni Registration**: https://bza-ruet-alumni-477a6.web.app/alumni/register
- **Admin Dashboard**: https://bza-ruet-alumni-477a6.web.app/admin
- **Alumni Directory**: https://bza-ruet-alumni-477a6.web.app/alumni

## 💡 Workflow Best Practices

### 1. Always Test Locally First
```bash
npm run dev  # Make sure everything works locally
```

### 2. Separate Development from Production
- **GitHub** = Code backup and version control
- **Firebase** = Live website that users see
- **You control when each gets updated**

### 3. Commit Messages Guidelines
- `"Add feature: alumni search functionality"`
- `"Fix: registration form validation"`
- `"Update: improve admin dashboard UI"`
- `"WIP: working on new feature"` (for work in progress)

### 4. Deploy Strategy
- **Test locally** → **Push to GitHub** → **Deploy to Firebase**
- This ensures your live website always works
- GitHub keeps your code history safe

## 🛠️ Troubleshooting

### If deployment fails:
```bash
firebase login  # Make sure you're logged in
npm run build   # Test build locally first
./deploy.sh     # Try deployment again
```

### If local development issues:
```bash
npm install     # Reinstall dependencies
npm run dev     # Start development server
```

### If Firebase issues:
- Check Firebase Console for errors
- Verify `.env` file has correct configuration
- Ensure you're logged into correct Firebase account

## ⚡ Quick Reference

### Daily Development:
1. `npm run dev` - Start working
2. Make changes
3. Test in browser
4. When satisfied: `git add . && git commit -m "description" && git push`
5. When ready for users: `./deploy.sh`

### Weekly Deployment:
1. Test all features locally
2. Update GitHub with all changes
3. Deploy to production for users
4. Monitor Firebase Console for any issues

This workflow gives you **full control** over when your code gets saved (GitHub) and when users see changes (Firebase)!

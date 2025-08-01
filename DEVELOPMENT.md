# BZA RUET Website - Development Guide

## 🚀 Quick Start

### Development Server
```bash
npm run dev
```
Opens at: http://localhost:5173

### Deploy to Production
```bash
./deploy.sh
```
Deploys to: https://bza-ruet-alumni-477a6.web.app

## 📋 Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `./deploy.sh` | Build and deploy to Firebase |
| `firebase serve` | Preview production build locally |

## 🌐 Live URLs

- **Production**: https://bza-ruet-alumni-477a6.web.app
- **Firebase Console**: https://console.firebase.google.com/project/bza-ruet-alumni-477a6

## 📱 Key Features

- ✅ Alumni Registration System
- ✅ Admin Dashboard for approval workflow
- ✅ Real-time Firebase integration
- ✅ Responsive design
- ✅ Image upload with Base64 storage

## 🔄 Development Workflow

1. **Make changes locally**
2. **Test with** `npm run dev`
3. **Deploy when ready** with `./deploy.sh`

## 🛠️ Troubleshooting

- **Build issues**: Check `npm run build` locally first
- **Firebase errors**: Ensure you're logged in with `firebase login`
- **Environment variables**: Check `.env` file exists and is correct

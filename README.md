# 500 Rule Calculator ⭐

A beautiful, modern astrophotography calculator that helps photographers determine the perfect shutter speed using the 500 rule to avoid star trails in night sky photography.

## ✨ Features

- **Dark space theme** with animated twinkling stars background
- **Modern UI** with Material-UI v5
- **Responsive design** that works on all devices
- **Real-time calculations** for multiple camera sensor types
- **Smooth animations** with Framer Motion
- **Clean, minimal interface** focused on essential functionality

## 🚀 Live Demo

The app is [live](https://develop.d3h3dygshkjxg9.amplifyapp.com/) and deployed to AWS Amplify.

## 💻 Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Export static files for GitHub Pages
npm run export

# Deploy to GitHub Pages
npm run deploy
```

## 📸 How It Works

1. **Select your camera sensor type** (Full Frame, Canon APS-C, Nikon/Sony APS-C, Micro Four Thirds)
2. **Enter your lens focal length** in millimeters
3. **Get instant results** showing the maximum shutter speed to avoid star trails

The calculator uses the formula: `500 ÷ (focal length × crop factor) = max shutter speed`

## 🌟 About the 500 Rule

The 500 rule is a fundamental guideline in astrophotography that helps determine the longest shutter speed you can use before stars begin to show trailing due to Earth's rotation. This tool makes it easy to calculate the perfect settings for sharp, trail-free star photos.

## 📱 Supported Camera Types

- **Full Frame** (1x crop factor)
- **Canon APS-C** (1.6x crop factor)
- **Nikon/Sony APS-C** (1.5x crop factor)
- **Micro Four Thirds** (2x crop factor)

# CX365 Recording Dashboard 🎙️

An elite, high-performance SaaS dashboard designed for enterprise call recording management. Built with modern React, TypeScript, and Vite, this application provides an unparalleled user experience through pixel-perfect aesthetics, robust data filtering, and seamless audio analysis capabilities.

## 🚀 Key Features

* **High-Density Data Grid**: A custom, compact MUI DataGrid implementation for optimal data visibility, featuring real-time selection and bulk operations.
* **Audio Command Center**: A floating, responsive audio player with integrated playback speed, volume control, and an interactive emerald green waveform visualizer powered by `wavesurfer.js`.
* **Advanced Filtering Engine**: A slide-out, multi-parameter filtering sidebar with dynamic "Match All/Match Any" logic and UTC-normalized date ranges.
* **Pixel-Perfect Responsive UI**: Painstakingly crafted with MUI's Flexbox systems to ensure flawless operation across Desktop, Tablet, and Mobile viewports without layout shifting.
* **Global State Management**: Powered by Zustand for blazingly fast, re-render optimized cross-component communication.

## 🛠️ Technology Stack

* **Core**: React 19, TypeScript
* **Build Tool**: Vite 8 for instant HMR and optimized production builds
* **UI Framework**: Material-UI (MUI) v6
* **Icons**: Lucide React
* **Audio Visualizer**: WaveSurfer.js v7
* **State Management**: Zustand
* **Date Parsing**: Day.js

## 📦 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/Sandeep010-hub/cx65-recordings.git
cd cx65-recordings
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```

### 4. Build for production
```bash
npm run build
```

## 🏗️ Architecture Highlights

* **State Persistence**: The dashboard utilizes a centralized `useStore` to seamlessly sync audio playback state, active filters, and table row selections across completely decoupled components.
* **CORS-Resilient Rendering**: The waveform engine utilizes intelligent dummy-peak generation strategies during local development to ensure the UI renders perfectly without fetching external media and triggering browser CORS blocks.
* **Enterprise Theming**: Features a dedicated `theme.ts` file injecting strict padding overrides and standardizing the `#E8F5E9` Mint / `#2F9A4E` Emerald corporate color palette globally.

## 📄 License

This project is proprietary and intended for demonstration purposes. All rights reserved.

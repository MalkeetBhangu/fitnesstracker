# Fitness Tracker - React Native Machine Coding Assignment

This is a modern, high-performance Fitness & Health Progress Tracking mobile app built with **React Native (0.87.1)**, **React 19**, **TypeScript**, **React Navigation**, **TanStack React Query**, and **Zustand**.

## Features

- **Progress Dashboard Screen**:
  - Virtualized, performance-optimized feed using a polymorphic Section model (`Section[]`).
  - Auto-selected default landing tab upon app launch.
  - Header with bold title and options modal trigger (`...`).

- **Current Weight Card**:
  - Live weight display in kilograms (`kg`).
  - Dynamic weight change badge with directional trend indicators (`+` / `-`).
  - Formatted last-logged date and edit button trigger.

- **Goal Progress Card**:
  - Target weight tracking with concentric activity rings icon.
  - Target date formatting with remaining weight delta.
  - Pace indicator with progress badge.

- **Interactive Weight Chart**:
  - Smooth cubic bezier curve with gradient fill rendered via `react-native-svg`.
  - Interactive touchable data points with dynamic selection.
  - Custom speech bubble tooltip with speech notch pointing directly to the active point.
  - Time range filter selectors (`W`, `M`, `6M`, `Y`) with responsive X/Y axis grid lines.

- **BMI Visualizer Card**:
  - Custom 4-band colored gauge (Underweight, Normal, Overweight, Obese).
  - Dynamically calculated indicator pin positioned based on exact BMI values.
  - User height info tile with quick edit modal trigger and localized units (`cm`).

- **Recent Logs Section**:
  - Chronological history of previous weight and waist measurements.
  - Directional trend arrows and localized date formatting.

- **Walkthrough Video Carousel**:
  - Horizontal snap carousel of video cards.
  - Custom translucent play button overlay, category tag pills, and multiline titles.

- **Multi-Language Support (i18n)**:
  - Full English (🇬🇧) and German (🇩🇪) localization.
  - **Zero static strings rule**: all labels, units (`kg`, `cm`), month names, and day names are centralized in `en.json` and `de.json`.
  - Header More options modal for instant runtime language switching.
  - Persistent language selection across app restarts via MMKV.

- **Custom Floating Bottom Navigation**:
  - Floating tab bar with pill-shaped active state indicators.
  - Smooth transitions across Home, Learn, Journal, Progress, and Profile tabs.

## Tech Stack & Architecture

- **Framework**: React Native (0.87.1), React 19
- **Language**: TypeScript
- **Navigation**: React Navigation (`@react-navigation/native`, `@react-navigation/bottom-tabs`, `@react-navigation/native-stack`)
- **State Management**: Zustand with `react-native-mmkv` synchronous persistence
- **Data Fetching**: TanStack React Query with Section Transformer pipeline
- **Localization**: Custom i18n (`en.json`, `de.json`, `TranslationHelper`)
- **Graphics & SVG**: `react-native-svg` & `react-native-svg-transformer` for vector icons and charts
- **Safe Area & Insets**: `react-native-safe-area-context` & `react-native-screens`
- **Styling**: `StyleSheet.create` with custom Design Tokens (`Colors.ts`) and responsive scaling helper (`StyleHelper`)

## Project Structure

```
├── App.tsx
├── app.json
├── declarations.d.ts
├── index.js
├── metro.config.js
├── package.json
├── tsconfig.json
├── assets
│   ├── images
│   │   ├── ArrowDown.svg
│   │   ├── ArrowUp.svg
│   │   ├── BackIcon.svg
│   │   ├── GoalTarget.svg
│   │   ├── Home.svg
│   │   ├── Journal.svg
│   │   ├── Learn.svg
│   │   ├── MoreIcon.svg
│   │   ├── PlayIcon.svg
│   │   ├── Profile.svg
│   │   ├── Progress.svg
│   │   └── ScaleIcon.svg
│   └── index.ts
└── src
    ├── config
    │   ├── ApiConstans.ts
    │   ├── QueryClientProvider.tsx
    │   └── useProgress.tsx
    ├── constants
    │   ├── Constants.ts
    │   └── Screens.ts
    ├── libs
    │   └── StyleHelper.ts
    ├── localStorage
    │   ├── LocalStroage.ts
    │   └── Store.ts
    ├── mockJson
    │   └── Progress.json
    ├── navigation
    │   ├── TabNavigator.tsx
    │   ├── index.tsx
    │   └── useNavigation.tsx
    ├── screens
    │   ├── home
    │   │   └── index.tsx
    │   ├── journal
    │   │   └── index.tsx
    │   ├── learn
    │   │   └── index.tsx
    │   ├── profile
    │   │   └── index.tsx
    │   └── progress
    │       ├── ProgressConstant.ts
    │       ├── components
    │       │   ├── BmiCard.tsx
    │       │   ├── CurrentWeightCard.tsx
    │       │   ├── GoalCard.tsx
    │       │   ├── RecentLogsCard.tsx
    │       │   ├── WalkthroughCard.tsx
    │       └── WeightChartCard.tsx
    │       └── index.tsx
    ├── sharedComponents
    │   ├── Button.tsx
    │   ├── Header.tsx
    │   ├── LanguageModal.tsx
    │   ├── Loader.tsx
    │   └── TextView.tsx
    ├── store
    │   └── UseUserStore.tsx
    ├── tokens
    │   └── Colors.ts
    ├── translations
    │   ├── TranslationHelper.ts
    │   ├── de.json
    │   └── en.json
    └── types
        ├── ProgressTypes.ts
        └── UserTypes.ts
```

## Architecture & Data Flow

- **Section Transformer Model**: Mock/Server response is transformed via `transformProgressToSections` into strongly typed `Section[]` items (`weight`, `goal`, `chart`, `bmi`, `recentLogs`, `walkthrough`) and rendered efficiently in a virtualized feed.
- **State & Local Persistence**: User preferences (like `languageCode`) are stored in Zustand and synchronously persisted to native disk using `react-native-mmkv`.
- **Localization Pipeline**: Dynamic text resolution via `getTexts(languageCode)` ensuring zero static or hardcoded strings across all screens and components.

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Install iOS Pods (macOS only)**:
   ```bash
   cd ios && pod install && cd ..
   ```

3. **Start the Metro Bundler**:
   ```bash
   npm start
   ```

4. **Run on Emulator / Device**:
   - For iOS: `npm run ios`
   - For Android: `npm run android`

## Scripts

- `npm start` - Starts Metro bundler
- `npm run ios` - Runs app on iOS simulator / device
- `npm run android` - Runs app on Android emulator / device
- `npm run lint` - Runs ESLint code quality checks
- `npx tsc --noEmit` - Runs TypeScript compiler check without emitting files

# Fitness Tracker - React Native Machine Coding Assignment

This is a React Native fitness progress tracking app built for the machine coding assignment using React Navigation, TanStack React Query, Zustand, and MMKV.

## Features

- **Progress Screen**:
  - Virtualized dashboard displaying current weight, target goal, weight chart, BMI gauge, recent logs, and video walkthrough carousel.
  - Interactive cubic bezier SVG chart with range filters (`W`, `M`, `6M`, `Y`) and touchable data point tooltip.
  - Dynamic 4-band BMI visualizer gauge with calculated indicator pin.
  - Horizontal video carousel with custom play button overlay.

- **Multi-Language Support (i18n)**:
  - Supports English and German localization with zero hardcoded strings.
  - Header options modal (`...`) for switching languages at runtime with MMKV persistence.

- **Navigation & Tabs**:
  - Custom floating bottom tab bar (Home, Learn, Journal, Progress, Profile) with active pill indicator.
  - Auto-selects Progress tab on initial launch.

## Tech Stack & Architecture

- **Framework**: React Native (0.87.1), React 19
- **Navigation**: React Navigation (Bottom Tabs & Native Stack)
- **State Management**: Zustand with `react-native-mmkv` persistence
- **Data Fetching**: TanStack React Query with Section Transformer pipeline
- **Graphics & Charts**: `react-native-svg` & `react-native-svg-transformer`
- **Styling**: `StyleSheet.create` with Design Tokens (`Colors.ts`) & responsive helper (`StyleHelper`)

## Project Structure

```
├── App.tsx
├── app.json
├── package.json
├── tsconfig.json
├── assets
│   ├── images
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
    │       │   └── WeightChartCard.tsx
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

## Setup & Configuration Instructions

- **Node.js**: Requires Node.js `>= 22.11.0` (tested on Node v22.14.0).
- **iOS Environment**: Xcode 15+ with CocoaPods installed (`pod install` in `ios/` folder). Deployment target: iOS 15.1+.
- **Android Environment**: JDK 17+ and Android SDK 34+. Ensure `ANDROID_HOME` and `platform-tools` are set in your environment.
- **SVG Transformer**: Configured via `metro.config.js` and `react-native-svg-transformer` for direct vector icon imports.
- **Path Aliases**: TypeScript path mapping configured in `tsconfig.json` (`@src/*` -> `src/*`).

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
- `npm run ios` - Runs app on iOS
- `npm run android` - Runs app on Android
- `npm run lint` - Runs ESLint checks
- `npx tsc --noEmit` - Runs TypeScript type checking

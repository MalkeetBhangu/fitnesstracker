# Fitness Tracker Mobile App 🏋️‍♂️

A modern, high-performance **Fitness & Health Progress Tracking** application built with **React Native (0.87.1)**, **React 19**, and **TypeScript**. Engineered with a clean modular architecture, custom SVG data visualizations, dynamic gauge scales, persistent internationalization (i18n), and an extensible design system.

---

## 📑 Table of Contents

- [App Highlights & Features](#-app-highlights--features)
- [System Architecture](#-system-architecture)
  - [High-Level Architecture](#1-high-level-architecture)
  - [Data Flow & Transformation Pipeline](#2-data-flow--transformation-pipeline)
  - [State Management & Local Storage Architecture](#3-state-management--local-storage-architecture)
  - [Localization & i18n Pipeline](#4-localization--i18n-pipeline)
- [Project Directory Structure](#-project-directory-structure)
- [Module & Component Breakdown](#-module--component-breakdown)
  - [Progress Dashboard Features](#progress-dashboard-features)
  - [Shared Components](#shared-components)
  - [Navigation & Tab Bar](#navigation--tab-bar)
  - [Design Tokens & Utilities](#design-tokens--utilities)
- [Engineering Guidelines & Rules](#-engineering-guidelines--rules)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the App](#running-the-app)
  - [Quality & Type Checks](#quality--type-checks)
- [Tech Stack & Dependencies](#-tech-stack--dependencies)
- [License](#-license)

---

## 📱 App Highlights & Features

- **Current Weight Card**: Live weight display with delta badges (`+`/`-`), last-logged relative timestamps, and edit triggers.
- **Goal Progress Card**: Target tracking with dynamic date formatting, progress delta to target weight, and pace indicator.
- **Interactive Weight Chart**:
  - Smooth cubic bezier SVG curve with dynamic gradient fill.
  - Interactive touch points with dynamic data selection.
  - Custom speech bubble tooltip with speech notch pointing directly to the active point.
  - Period filter pills (`W`, `M`, `6M`, `Y`) with responsive X/Y axis grids.
- **BMI Visualizer Card**:
  - Custom 4-band colored gauge (Underweight, Normal, Overweight, Obese).
  - Dynamically calculated indicator pin positioned based on exact BMI values.
  - User height info tile with quick edit modal trigger and localized units (`cm`).
- **Recent Logs Section**: Chronological feed of user weight & waist logs with directional trend icons and localized dates.
- **Walkthrough Video Carousel**: Horizontal snap carousel featuring custom translucent play button overlays, tag badges, and multiline video titles.
- **Runtime Multi-Language Localization (i18n)**:
  - English (🇬🇧) and German (🇩🇪) support with 0 hardcoded strings.
  - Header More icon (`...`) modal for instant runtime language switching.
  - Persistent language preference across app restarts via MMKV storage.
- **Custom Floating Bottom Tab Bar**: Pill-shaped active state navigation with automatic initial routing to the Progress tab.

---

## 🏗️ System Architecture

### 1. High-Level Architecture

The application adopts a **Layered Clean Architecture** separating UI presentation, state management, data transformation, and native persistence:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           PRESENTATION LAYER                            │
│  ┌─────────────────────────────────┐   ┌─────────────────────────────┐  │
│  │         Screens / Tabs          │   │      Shared Components      │  │
│  │  • Progress   • Home    • Learn │   │  • TextView   • Header      │  │
│  │  • Journal    • Profile         │   │  • Button     • Loader      │  │
│  └────────────────┬────────────────┘   │  • LanguageModal            │  │
│                   │                    └──────────────┬──────────────┘  │
│                   ▼                                   │                 │
│  ┌────────────────────────────────────────────────────┴──────────────┐  │
│  │                    Progress Feature Cards                         │  │
│  │  • CurrentWeightCard  • GoalCard         • WeightChartCard        │  │
│  │  • BmiCard            • RecentLogsCard   • WalkthroughCard        │  │
│  └────────────────────────────────┬──────────────────────────────────┘  │
└───────────────────────────────────┼─────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      STATE & DATA LOGIC LAYER                           │
│  ┌───────────────────────────────┐   ┌───────────────────────────────┐  │
│  │     TanStack React Query      │   │         Zustand Store         │  │
│  │  • Server State / API Hooks   │   │  • User Preferences / Language│  │
│  │  • Section Transformer        │   │  • Persist Middleware         │  │
│  └───────────────┬───────────────┘   └───────────────┬───────────────┘  │
└──────────────────┼───────────────────────────────────┼──────────────────┘
                   │                                   │
                   ▼                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     STORAGE & FOUNDATION LAYER                          │
│  ┌───────────────────────────────┐   ┌───────────────────────────────┐  │
│  │          MMKV Storage         │   │       Design System & i18n    │  │
│  │  • Fast Synchronous Storage   │   │  • Colors (RGBA Token Palette)│  │
│  │  • Persistent User State      │   │  • StyleHelper (Responsive)   │  │
│  │  • Encryption & Key-Value     │   │  • Localization (en / de)     │  │
│  └───────────────────────────────┘   └───────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 2. Data Flow & Transformation Pipeline

The Progress screen uses a **Polymorphic Section Model** where server/mock responses are decoupled from view rendering:

```
[ Mock / API Response (Progress.json) ]
                  │
                  ▼
[ useProgress Hook (TanStack React Query) ]
                  │
                  ▼
[ transformProgressToSections Pipeline ]
                  │
                  ├──► Map weightData       ──► { id: 'weight',      type: 'weight',      data: WeightInfo }
                  ├──► Map goalData         ──► { id: 'goal',        type: 'goal',        data: GoalInfo }
                  ├──► Map chartData        ──► { id: 'chart',       type: 'chart',       data: ChartInfo }
                  ├──► Map bmiData          ──► { id: 'bmi',         type: 'bmi',         data: BmiInfo }
                  ├──► Map recentLogs       ──► { id: 'recentLogs',  type: 'recentLogs',  data: RecentLogItem[] }
                  └──► Map walkthrough     ──► { id: 'walkthrough', type: 'walkthrough', data: WalkthroughItem[] }
                  │
                  ▼
[ Section[] Array Fed into Virtualized FlatList ]
                  │
                  ▼
[ Dynamic Component Resolver (renderItem) ]
     ├─ 'weight'      ──► <CurrentWeightCard />
     ├─ 'goal'        ──► <GoalCard />
     ├─ 'chart'       ──► <WeightChartCard />
     ├─ 'bmi'         ──► <BmiCard />
     ├─ 'recentLogs'  ──► <RecentLogsCard />
     └─ 'walkthrough' ──► <WalkthroughCard />
```

---

### 3. State Management & Local Storage Architecture

Global state is powered by **Zustand** integrated directly with **MMKV** for zero-latency local persistence:

```
┌─────────────────────────┐
│     UI Interaction      │ (User selects German 🇩🇪 in LanguageModal)
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  useUserStore.setState  │ (Updates user languageCode: 'de')
└────────────┬────────────┘
             │
             ├─────────────────────────────────────────┐
             ▼                                         ▼
┌─────────────────────────┐               ┌─────────────────────────┐
│ Zustand Reactive Hook   │               │ MMKV Synchronous Bridge │
│ All UI re-renders with  │               │ Writes key-value pair   │
│ translated strings      │               │ to native disk storage  │
└─────────────────────────┘               └─────────────────────────┘
```

---

### 4. Localization & i18n Pipeline

To maintain multi-language consistency, all strings are accessed dynamically:

```
[ Active languageCode ('en' | 'de') in useUserStore ]
                         │
                         ▼
             [ getTexts(languageCode) ]
                         │
        ┌────────────────┴────────────────┐
        ▼                                 ▼
[ src/translations/en.json ]     [ src/translations/de.json ]
        │                                 │
        └────────────────┬────────────────┘
                         ▼
        [ Strongly-typed `t` translation object ]
                         │
                         ├─► `t.progress.currentWeight`
                         ├─► `t.progress.goal`
                         ├─► `t.progress.kg` / `t.progress.cm`
                         └─► `t.tabs.progress`
```

---

## 📂 Project Directory Structure

```
fitnesstracker/
├── assets/
│   ├── images/                           # SVG Vector Icons & Illustrations
│   │   ├── ArrowDown.svg                 # Downward trend indicator
│   │   ├── ArrowUp.svg                   # Upward trend indicator
│   │   ├── BackIcon.svg                  # Navigation back chevron
│   │   ├── GoalTarget.svg                # Activity concentric rings goal icon
│   │   ├── Home.svg                      # Home bottom tab icon
│   │   ├── Journal.svg                   # Journal bottom tab icon
│   │   ├── Learn.svg                     # Learn bottom tab icon
│   │   ├── MoreIcon.svg                  # Header options (3 dots) icon
│   │   ├── PlayIcon.svg                  # Video thumbnail play button icon
│   │   ├── Profile.svg                   # Profile bottom tab icon
│   │   ├── Progress.svg                  # Progress bottom tab icon
│   │   └── ScaleIcon.svg                 # BMI weight scale icon
│   └── index.ts                          # Asset export registry
│
├── src/
│   ├── config/                           # API & Query Configurations
│   │   ├── ApiConstans.ts                # React Query keys & API constants
│   │   ├── QueryClientProvider.tsx       # TanStack Query client & cache provider
│   │   └── useProgress.tsx               # Progress data fetcher & Section transformer
│   │
│   ├── constants/                        # Global Constants & Route Enums
│   │   ├── Constants.ts                  # App defaults (DEFAULT_LANGUAGE_CODE)
│   │   └── Screens.ts                    # Screen names & Tab route enums (TABS, Screens)
│   │
│   ├── libs/                             # Helper Libraries
│   │   └── StyleHelper.ts                # Responsive scale helpers (getHeight, getWidth)
│   │
│   ├── localStorage/                     # Native Storage Layer
│   │   ├── LocalStroage.ts               # MMKV Storage instance & helpers
│   │   └── Store.ts                      # Storage keys & Zustand persistence storage engine
│   │
│   ├── mockJson/                         # Mock Datasets
│   │   └── Progress.json                 # Progress feed data (Weight, Goal, Chart, BMI, Logs, Videos)
│   │
│   ├── navigation/                       # Navigation & Routing
│   │   ├── index.tsx                     # Root NavigationContainer with Dark Theme
│   │   ├── TabNavigator.tsx              # Bottom Tab Navigator with custom floating bar
│   │   └── useNavigation.tsx             # Typed navigation hooks & helpers
│   │
│   ├── screens/                          # Application Screen Modules
│   │   ├── home/index.tsx                # Home Tab screen
│   │   ├── journal/index.tsx             # Journal Tab screen
│   │   ├── learn/index.tsx               # Learn Tab screen
│   │   ├── profile/index.tsx             # Profile Tab screen
│   │   └── progress/                     # Progress Dashboard Module
│   │       ├── index.tsx                 # Main Progress feed screen
│   │       ├── ProgressConstant.ts       # Section types, month/day selectors
│   │       └── components/               # Modular Progress Cards
│   │           ├── BmiCard.tsx           # BMI 4-band gauge & height info
│   │           ├── CurrentWeightCard.tsx # Current weight, delta & log date
│   │           ├── GoalCard.tsx          # Target weight, timeline & pace
│   │           ├── RecentLogsCard.tsx    # Weight & waist history logs
│   │           ├── WalkthroughCard.tsx   # Video carousel with play buttons
│   │           └── WeightChartCard.tsx   # SVG bezier chart with dynamic tooltip
│   │
│   ├── sharedComponents/                 # Reusable UI Primitives
│   │   ├── Button.tsx                    # Standard touchable button with styles
│   │   ├── Header.tsx                    # Screen header with title, back & more actions
│   │   ├── LanguageModal.tsx             # Language switch dialog (English & German)
│   │   ├── Loader.tsx                    # Loading spinner overlay
│   │   └── TextView.tsx                  # Core text component bound to Design Tokens
│   │
│   ├── store/                            # Global State Stores
│   │   └── UseUserStore.tsx              # Zustand user store (language, preferences)
│   │
│   ├── tokens/                           # Design System Tokens
│   │   └── Colors.ts                     # Strict RGBA color palette & tokens
│   │
│   ├── translations/                     # Internationalization (i18n)
│   │   ├── en.json                       # English dictionary
│   │   ├── de.json                       # German dictionary
│   │   └── TranslationHelper.ts          # getTexts selector & locale helpers
│   │
│   └── types/                            # TypeScript Type Definitions
│       ├── ProgressTypes.ts              # Payload types for all progress sections
│       └── UserTypes.ts                  # User model & preference types
│
├── App.tsx                               # Application root & provider tree
├── declarations.d.ts                     # TypeScript SVG & asset module declarations
├── index.js                              # React Native AppRegistry entrypoint
├── metro.config.js                       # Metro bundler config with SVG transformer
├── package.json                          # Dependencies & NPM scripts
└── tsconfig.json                         # TypeScript compiler options
```

---

## 🧩 Module & Component Breakdown

### Progress Dashboard Features

| Component | Path | Description |
| :--- | :--- | :--- |
| **`CurrentWeightCard`** | `src/screens/progress/components/CurrentWeightCard.tsx` | Displays current weight in `kg`, trend badge with delta, timestamp, and edit button. |
| **`GoalCard`** | `src/screens/progress/components/GoalCard.tsx` | Displays target weight goal, concentric target icon, remaining weight delta, and pace indicator. |
| **`WeightChartCard`** | `src/screens/progress/components/WeightChartCard.tsx` | Smooth cubic bezier SVG curve with gradient fill, touchable active points, speech notch tooltip, and period selectors (`W`, `M`, `6M`, `Y`). |
| **`BmiCard`** | `src/screens/progress/components/BmiCard.tsx` | 4-band colored BMI gauge (Underweight, Normal, Overweight, Obese) with dynamic indicator pin and height info tile. |
| **`RecentLogsCard`** | `src/screens/progress/components/RecentLogsCard.tsx` | Chronological list of previous weight and waist measurements with directional trend arrows. |
| **`WalkthroughCard`** | `src/screens/progress/components/WalkthroughCard.tsx` | Horizontal video carousel with rounded thumbnails, custom play buttons, and tag badges. |

### Shared Components

| Component | Path | Description |
| :--- | :--- | :--- |
| **`TextView`** | `src/sharedComponents/TextView.tsx` | Foundation text component ensuring consistent typography, color tokens, and React 19 safety. |
| **`Header`** | `src/sharedComponents/Header.tsx` | Standardized header supporting back navigation, bold title, and right action buttons (e.g. `...` options). |
| **`LanguageModal`** | `src/sharedComponents/LanguageModal.tsx` | Centered dialog allowing users to switch between English and German with radio checks and backdrop dismiss. |
| **`Button`** | `src/sharedComponents/Button.tsx` | Standardized pressable component with disabled and loading states. |
| **`Loader`** | `src/sharedComponents/Loader.tsx` | Full-screen activity indicator overlay. |

### Navigation & Tab Bar

| File | Path | Description |
| :--- | :--- | :--- |
| **`TabNavigator`** | `src/navigation/TabNavigator.tsx` | Custom floating bottom bar with active indicator pills. Default tab set to `Progress`. |
| **`useNavigation`** | `src/navigation/useNavigation.tsx` | Typed navigation and route parameter hooks. |

### Design Tokens & Utilities

| File | Path | Description |
| :--- | :--- | :--- |
| **`Colors`** | `src/tokens/Colors.ts` | Strict `rgba(...)` color palette supporting dark mode, borders, gradients, and card backgrounds. |
| **`StyleHelper`** | `src/libs/StyleHelper.ts` | `getHeight(h)` and `getWidth(w)` helpers for responsive scaling across different device sizes. |
| **`TranslationHelper`** | `src/translations/TranslationHelper.ts` | Dynamically selects `en.json` or `de.json` based on store state. |

---

## 📏 Engineering Guidelines & Rules

1. **Zero Hardcoded Strings**:
   - Every user-facing label, title, subtitle, unit (`kg`, `cm`), month name, and day name MUST come from `src/translations/en.json` and `src/translations/de.json`.
   - Translation dictionaries store arrays as objects (e.g. `months: { jan: "Jan", ... }`) to ensure JSON compatibility and avoid string indexes.
2. **Typography & Styling**:
   - Always use `TextView` instead of raw React Native `<Text>`.
   - Colors must be referenced from `colors.*` in `src/tokens/Colors.ts` (strict `rgba` notation).
   - Use `getHeight` and `getWidth` for layout dimensions.
3. **React 19 Compatibility**:
   - Avoid redundant `<>` fragment wrappers inside host text tags.
   - Avoid inline component definitions in render methods to retain React 19 static compiler optimization flags.
4. **Data Isolation**:
   - All screen components receive structured data via type-safe props.
   - Mock datasets replicate production API JSON structures.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `>= 22.11.0`
- **Package Manager**: `npm` or `yarn`
- **macOS**: Xcode (with Command Line Tools) and CocoaPods for iOS
- **Android**: Android Studio with JDK 17+ and Android SDK

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/MalkeetBhangu/fitnesstracker.git
   cd fitnesstracker
   ```

2. Install JavaScript dependencies:
   ```bash
   npm install
   ```

3. Install iOS CocoaPods (macOS only):
   ```bash
   cd ios && pod install && cd ..
   ```

### Running the App

```bash
# Start the Metro bundler
npm start

# Run on iOS simulator / device
npm run ios

# Run on Android emulator / device
npm run android
```

### Quality & Type Checks

```bash
# Run TypeScript compilation check
npx tsc --noEmit

# Run ESLint check
npm run lint
```

---

## 🛠️ Tech Stack & Dependencies

| Category | Library | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Core Framework** | `react-native` | `0.87.1` | Native mobile application framework |
| **UI Engine** | `react` | `19.2.3` | React library & component model |
| **Language** | `typescript` | `6.0.3` | Static typing & developer ergonomics |
| **Navigation** | `@react-navigation/native`<br/>`@react-navigation/bottom-tabs`<br/>`@react-navigation/native-stack` | `^7.x` | Screen navigation & floating tab bar |
| **State Management** | `zustand` | `^5.0.15` | Global user & preference store |
| **Local Storage** | `react-native-mmkv` | `^3.3.3` | Ultra-fast persistent key-value storage |
| **Server State** | `@tanstack/react-query` | `^5.102.8` | Data caching & section transformation |
| **Graphics & SVG** | `react-native-svg`<br/>`react-native-svg-transformer` | `^15.x` | Vector icons & cubic bezier charts |
| **Screen & Insets** | `react-native-screens`<br/>`react-native-safe-area-context` | `^4.x` | Native screen optimization & safe areas |

---

## 📄 License

This project is private and proprietary. All rights reserved.

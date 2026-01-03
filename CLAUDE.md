# Sound Playground - Interactive Math & Music Education

## Project Overview

An interactive educational web application that explores the connection between mathematics, physics, and music. The project features **14 modules** (in Italian) that guide users through concepts like sound vibrations, frequency, amplitude, harmonics, musical scales, temperaments, synthesis, and psychoacoustics. Includes interactive quizzes, ear training games, glossary, and preset management.

**Tech Stack:**
- Vite + React 18 + TypeScript
- shadcn/ui + Tailwind CSS
- React Router DOM for navigation
- Web Audio API for sound generation
- React Query for state management

## Project Structure

```
src/
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── InfoBox.tsx           # Educational information boxes
│   ├── ModuleLayout.tsx      # Shared layout for all modules
│   ├── ModuleCard.tsx        # Module navigation cards
│   ├── NavLink.tsx           # Navigation component
│   ├── PlayButton.tsx        # Audio playback control
│   ├── Slider.tsx            # Interactive parameter controls
│   └── WaveVisualizer.tsx    # Visual representation of sound waves
├── hooks/
│   ├── useAudioContext.ts    # Web Audio API wrapper
│   ├── use-mobile.tsx        # Mobile device detection
│   └── use-toast.ts          # Toast notifications
├── pages/
│   ├── Index.tsx             # Landing page with module grid
│   ├── Module1.tsx           # Sound as vibration
│   ├── Module2.tsx           # Frequency and pitch
│   ├── Module3.tsx           # Amplitude and intensity
│   ├── Module4.tsx           # Timbre and spectrum
│   ├── Module5.tsx           # Harmonics and Fourier
│   ├── Module6.tsx           # Octaves and ratios
│   ├── Module7.tsx           # Building scales with fifths
│   ├── Module8.tsx           # The dominant note
│   ├── Module9.tsx           # Strings and air columns
│   ├── Module10.tsx          # Beats
│   ├── Module11.tsx          # Temperaments
│   └── NotFound.tsx          # 404 page
├── lib/
│   └── utils.ts              # Utility functions
├── App.tsx                   # Main app with routing
└── main.tsx                  # App entry point
```

## Module Topics (Italian Language)

1. **Il suono come vibrazione** - Sound as vibration
2. **Frequenza e altezza** - Frequency and pitch
3. **Ampiezza e intensità** - Amplitude and intensity
4. **Timbro e spettro** - Timbre and spectrum
5. **Armonici e Fourier** - Harmonics and Fourier
6. **Ottava e rapporti** - Octaves and ratios
7. **Costruire la scala con le quinte** - Building scales with fifths
8. **La dominante** - The dominant
9. **Corde e colonne d'aria** - Strings and air columns
10. **I battimenti** - Beats
11. **Temperamenti** - Temperaments

## Key Components

### ModuleLayout
- Wrapper component for all module pages
- Provides consistent header, navigation, and footer
- Accepts `moduleNumber`, `title`, `description`, and `nextModule` props

### WaveVisualizer
- Visual representation of sound waves
- Animates based on frequency, amplitude, and playback state
- Core component for demonstrating audio concepts

### PlayButton
- Controls audio playback via useAudioContext hook
- Toggles between play and pause states

### InfoBox
- Displays educational tips and information
- Supports `type` prop: "tip", "info", "warning"

## Audio System

The application uses the Web Audio API wrapped in the `useAudioContext` hook:
- `startOscillator(frequency, volume)` - Start playing a tone
- `stopOscillator()` - Stop the current tone
- `setFrequency(frequency)` - Change frequency while playing
- Supports sine, square, sawtooth, and triangle waveforms

## Routes

- `/` - Home page with module grid
- `/modulo-1` to `/modulo-11` - Individual module pages
- `*` - 404 Not Found page

## Development Commands

```bash
npm run dev        # Start development server
npm run build      # Production build
npm run build:dev  # Development build
npm run lint       # Run ESLint
npm run preview    # Preview production build
```

## Design Patterns

- Each module follows a consistent structure with visualization, controls, and educational content
- Interactive sliders allow real-time parameter adjustment
- Visual feedback through wave animations synchronized with audio
- Responsive design with mobile-first approach
- Consistent color theming for each module

## Common Development Tasks

### Adding a New Module
1. Create `src/pages/ModuleX.tsx` following existing module patterns
2. Add route in `src/App.tsx`
3. Add module card data in `src/pages/Index.tsx`
4. Implement visualization and controls using existing components

### Modifying Audio Behavior
- Edit `src/hooks/useAudioContext.ts` for global audio changes
- Individual modules customize audio parameters via hook methods

### Styling
- Uses Tailwind CSS with custom theme configuration
- shadcn/ui components for consistent UI elements
- Custom classes defined in `src/index.css`

## Important Notes

- Content is in Italian - maintain language consistency
- Educational focus - changes should enhance learning experience
- Interactive elements are core to the experience
- Web Audio API requires user interaction before playing sounds (browser security)
- Responsive design is crucial for accessibility

## Browser Compatibility

- Modern browsers with Web Audio API support
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers supported with touch interactions

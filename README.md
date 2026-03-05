# FocusFlow — Productivity Suite

A fully client-side productivity suite featuring a Pomodoro timer and task manager. No backend, no API keys required — all data persists in `localStorage`.

## Features

### Pomodoro Timer
- Animated SVG circular progress ring
- Three modes: Focus (25 min), Short Break (5 min), Long Break (15 min)
- Auto-switch between modes after each session
- Long break every 4 focus sessions (configurable)
- Browser tab title updates live with remaining time
- Desktop notifications on session end
- Ambient sound generator (Rain, Café, Forest, Ocean) via Web Audio API

### Task Manager
- Add tasks with estimated pomodoros and priority (Low/Medium/High)
- Drag-and-drop reorder with `@dnd-kit`
- Link a task to the active timer session
- Confetti animation on task completion
- Completed tasks section with clear option

### Settings
- Timer duration sliders (Focus / Short Break / Long Break)
- Auto-start breaks & focus toggles
- Timer sound selector: Chime, Bell, Digital, None
- Timer volume control
- Tick sound toggle

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play / Pause timer |
| `R` | Reset timer |

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 + TypeScript | UI framework |
| Vite 4 | Build tool |
| Tailwind CSS | Styling |
| Zustand | Global state (persisted to localStorage) |
| @dnd-kit | Drag & drop task reordering |
| Lucide React | Icons |
| Web Audio API | Timer sounds & ambient noise generation |

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open: http://127.0.0.1:5174

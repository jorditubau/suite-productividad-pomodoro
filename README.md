# 🍅 FocusFlow — Productivity Suite

A fully client-side productivity suite featuring a Pomodoro timer, task manager, and session statistics. No backend, no API keys required — all data persists in `localStorage`.

## ✨ Features

### ⏱ Pomodoro Timer
- Animated SVG circular progress ring
- Three modes: Focus (25 min), Short Break (5 min), Long Break (15 min)
- Auto-switch between modes after each session
- Long break every 4 focus sessions (configurable)
- Do Not Disturb fullscreen mode
- Browser tab title updates live with remaining time
- Desktop notifications on session end

### ✅ Task Manager
- Add tasks with estimated pomodoros, priority (Low/Medium/High), and group
- Drag-and-drop reorder with `@dnd-kit`
- Task groups: Today, This Week, Someday
- Link a task to the active timer session
- Confetti animation on task completion ✨
- Completed tasks section with clear option

### 📊 Statistics Dashboard
- Daily overview: focus time, pomodoros, streak, tasks completed
- Bar chart: pomodoros per day (last 7 days)
- Line chart: focus hours per day (last 4 weeks)
- Pie chart: time distribution per task (top 5)
- GitHub-style activity heatmap (last 3 months)
- Session log with timestamps

### ⚙️ Settings
- Timer duration sliders (Focus / Short Break / Long Break)
- Auto-start breaks & focus toggles
- Theme: Dark / Light / System
- 5 accent color presets: Tomato Red, Ocean Blue, Forest Green, Purple, Amber
- Timer sound selector: Chime, Bell, Digital, None
- Ambient sound generator (Rain, Café, Forest, Ocean) via Web Audio API
- Export / Import data as JSON
- Reset all data

## 🔑 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play / Pause timer |
| `R` | Reset timer |
| `T` | Go to Tasks tab |
| `S` | Go to Stats tab |

## 🛠 Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 + TypeScript | UI framework |
| Vite 4 | Build tool |
| Tailwind CSS | Styling |
| Zustand | Global state (persisted to localStorage) |
| @dnd-kit | Drag & drop task reordering |
| Recharts | Statistics charts |
| Lucide React | Icons |
| Web Audio API | Timer sounds & ambient noise generation |

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📁 Project Structure

```
src/
├── components/
│   ├── timer/       # TimerRing, Controls, ModeSelector, AmbientSounds, CurrentTask
│   ├── tasks/       # TaskInput, TaskCard, TaskList, TaskGroup
│   ├── stats/       # OverviewCards, Charts, HeatmapCalendar, SessionLog
│   ├── settings/    # Timer, Appearance, Sound, Data settings
│   └── ui/          # ProgressRing, Badge, Modal, ConfirmDialog, Slider, TomatoIcon
├── store/           # timerStore, taskStore, statsStore, settingsStore (Zustand)
├── hooks/           # useTimer, useNotifications, useKeyboardShortcuts, useConfetti
├── utils/           # timeFormat, localStorage, dataExport, colors
└── types/           # TypeScript types
```

## 📄 License

MIT

# RepTrack

RepTrack is a responsive web application designed to help users track workouts, visualize progress, and stay consistent through streak tracking. The app focuses on **progressive overload**, encouraging users to log workouts and improve over time in a simple, motivating way.


## What Is RepTrack?

RepTrack allows users to:
- Log workouts with exercise name, weight, reps, and sets
- Store workout history persistently
- Visualize progress using charts
- Track consistency with a streak system
- Quickly navigate between sections using a dropdown menu

The app is designed to be **clean, beginner-friendly, and mobile-responsive**, with smooth animations and good user experience.


## Main Features

### Workout Form
- Detailed form with validation
- Prevents empty or invalid input
- Uses exercise suggestions from API/JSON data

### Workout History
- Displays all logged workouts
- Scrollable container to keep layout compact
- Data saved using **localStorage**, so workouts remain after refresh

### Progress Chart
- Line chart showing weight progression
- Automatically updates when workouts are added
- Built with **Chart.js**

### Streak Tracker
- Tracks consecutive workout days
- Animated flame icon
- Encourages consistency and motivation

### Navigation & Quick Jump
- Dropdown menu for section navigation
- Uses **URL parameters** (e.g. `?section=history`)
- Smooth scroll + highlight animation when jumping to sections

### Responsive Design
- Optimized for desktop and mobile
- Grid layout adapts to single-column on small screens
- Mobile-specific spacing and layout adjustments

### UI & Animations
- Hover effects on cards and buttons
- Section “jump” animation when navigating
- Toast notifications for user feedback
- Gradient buttons and modern card design


## Technologies Used

- **HTML5** – Semantic structure
- **CSS3** – Layout, responsiveness, animations
- **JavaScript (ES Modules)** – App logic and organization
- **Chart.js** – Progress visualization
- **Local Storage API** – Data persistence
- **ExerciseDB API / JSON data** – Exercise suggestions


## Application Structure

```txt
reptrack/
├── index.html            # Main workout planner page
├── start.html            # Landing / intro page
├── routines.html         # Preset workout routines page
│
├── css/
│   ├── style.css         # Global styles (layout, cards, buttons, animations)
│   ├── start.css         # Landing page specific styles
│   └── routine.css      # Routines page styles
│
├── js/
│   ├── main.js           # App initialization and event handling
│   ├── history.js        # Workout history & localStorage logic
│   ├── chart.js          # Progress chart (Chart.js)
│   ├── streak.js         # Streak tracking logic
│   ├── api.js            # Exercise data fetching (API / JSON)
│   └── dropdown.js       # Dropdown menu behavior
│
└── README.md             # Project documentation

```

## URL Parameters

RepTrack uses URL parameters to navigate between sections of the app.

**Example:**
```txt
planner.html?section=history
```

This:

- Smoothly scrolls to the History section  
- Applies a visual highlight (jump) animation  
- Improves navigation and overall user experience  


## UX & Accessibility

- Clear visual hierarchy for easy scanning  
- Large tap targets optimized for mobile users  
- `aria-live` used for dynamic feedback messages  
- High-contrast text and buttons for readability  
- Animations are subtle and purposeful, not distracting  


# App Graph Builder

A responsive "App Graph Builder" UI built with React, TypeScript, ReactFlow, and modern tooling. This application allows you to visualize and manage application architectures through an interactive graph canvas.

## Features

- **Layout Composition**: Top bar, left rail navigation, right panel, and dotted canvas
- **ReactFlow Integration**: Drag nodes, select, delete with Delete/Backspace, zoom/pan
- **Node Inspector**: Tabs (Config/Runtime), status pill, synced slider + numeric input
- **TanStack Query**: Mock API data fetching with loading/error states and caching
- **Zustand State Management**: Minimal, well-structured UI state
- **Responsive Design**: Right panel becomes a slide-over drawer on mobile

## Tech Stack

- React 18 + Vite
- TypeScript
- ReactFlow (xyflow)
- shadcn/ui components
- TanStack Query
- Zustand
- Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, or bun

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd <project-folder>

# Install dependencies
npm install
# or
bun install
```

### Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint

# Run TypeScript type checking (if available)
npx tsc --noEmit
```

## Key Decisions

1. **Mock API Approach**: Using simple Promise-based mocking with simulated delays for development simplicity.

2. **State Management**: 
   - Zustand handles UI state (selectedAppId, selectedNodeId, isMobilePanelOpen, activeInspectorTab)
   - ReactFlow manages its own internal node/edge state

3. **Component Architecture**: 
   - Layout components (TopBar, LeftRail, RightPanel) handle structure
   - Canvas components handle ReactFlow integration
   - Panel components handle app selection and node inspection

4. **Custom Node Types**: ServiceNode and DatabaseNode with different styling and icons.

5. **Responsive Strategy**: Desktop shows fixed right panel, mobile uses a slide-over drawer.

## Known Limitations

- No persistent storage - node changes are lost on refresh
- Mock data is static - no CRUD operations on the backend
- Node deletion removes connected edges automatically

## Project Structure

```
src/
├── components/
│   ├── canvas/          # ReactFlow canvas and node components
│   ├── layout/          # TopBar, LeftRail, RightPanel
│   ├── panel/           # AppSelector, NodeInspector
│   └── ui/              # shadcn/ui components
├── hooks/               # Custom hooks including API hooks
├── mocks/               # Mock data and API functions
├── pages/               # Page components
├── store/               # Zustand store
├── types/               # TypeScript type definitions
└── lib/                 # Utility functions
```

## Usage

1. Select an app from the right panel to load its graph
2. Drag nodes to reposition them on the canvas
3. Click a node to select it and view its properties in the inspector
4. Use the slider and input to adjust resource allocation (they stay in sync)
5. Edit node name and description in the Config tab
6. View runtime metrics in the Runtime tab
7. Use Delete or Backspace to remove selected nodes
8. Use zoom controls in the top bar or scroll to zoom
9. Click "Add Node" to create new service nodes
10. On mobile, use the menu button to toggle the panel drawer

## Deployment

Deploy to Vercel or Cloudflare Pages:

```bash
# Build the project
npm run build

# The dist folder contains the production build
```

For Vercel: Connect your GitHub repo and it will auto-detect Vite configuration.

For Cloudflare Pages: Set build command to `npm run build` and output directory to `dist`.

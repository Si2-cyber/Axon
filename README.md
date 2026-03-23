# IsoMap (Structural Node Editor)

A high-precision, multi-mode visualization tool for structured thinking. 

Unlike standard "free-form" whiteboard applications where nodes are placed arbitrarily, **IsoMap** enforces strict document typologies. Whether building a Mind Map, a Logic Chart, or an Org Chart, the application relies on rule-based canvas mechanics, recursive layout algorithms, and a unified state engine to maintain structural integrity.

## 🚀 Key Features

* **Strict Typology Enforcement:** Documents are strictly typed upon creation (e.g., `MIND_MAP`, `FLOWCHART`). The application's rules and UI adapt to the chosen mode.
* **Algorithmic Tree Layout:** In Mind Map mode, the application utilizes a recursive layout engine to automatically position nodes in a Left-to-Right horizontal tree.
* **Dynamic Collision Prevention:** Mathematical bounding-box calculations automatically push sibling branches along the Y-axis to prevent connection lines and nodes from ever overlapping.
* **Contextual UI:** The toolbar and action menus are context-aware. Drag-and-drop shape palettes are hidden in auto-layout modes, while node-specific actions (Add Child, Delete) are handled via floating context menus.

## 🚧 Current Focus (Work in Progress)

The application is currently undergoing a major architectural update to improve state management and UI stability:

1.  **Routing & Dashboard:** Implementing React Router to introduce a Home Page gateway, moving away from booting directly into the canvas.
2.  **Immutable Document State:** Locking the document `mode` upon creation to simplify the state engine and prevent the need for complex typology reflowing.
3.  **CSS Architecture (Component Separation):** Refactoring `CustomNode.tsx` into "Smart" (logic/handles) and "Dumb" (presentation/styling) components to prevent visual regressions and ensure a unified UI consisting of rounded, contained cards.

## 🛠️ Tech Stack

* **Frontend Framework:** React (via Vite)
* **Language:** TypeScript
* **Canvas/Node Engine:** React Flow
* **Styling:** CSS / Tailwind (Adjust based on your specific setup)

## 💻 Local Development Setup

To run this project locally, you will need Node.js installed on your machine.

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd <your-repo-name>
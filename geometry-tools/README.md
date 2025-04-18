# 3D Model Hierarchy Tool

A web application for creating and managing 3D model hierarchies using React, TypeScript, and React Three Fiber.

## Features

- Create and manage 3D primitives (Box, Cylinder, Cone, Sphere)
- Drag and drop to reorder components in the model tree
- Interactive 3D viewport with orbit controls
- Persistent storage using localStorage
- Select objects from both the tree view and 3D viewport

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd geometry-tools
```

2. Install dependencies:
```bash
npm install
```

## Development

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Testing

To run the linter:

```bash
npm run lint
```

## Usage

1. Use the "Add Primitive" buttons to create new 3D objects
2. Click on objects in the tree or 3D view to select them
3. Drag and drop objects in the tree to reorder them
4. The application automatically saves your work to localStorage

## Technologies Used

- React
- TypeScript
- React Three Fiber
- Vite
- HTML5 Drag and Drop

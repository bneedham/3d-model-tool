import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import ModelTree from './components/ModelTree';
import ThreeScene from './components/ThreeScene';
import PrimitiveControls from './components/PrimitiveControls';
import ResizeHandle from './components/ResizeHandle';
import { ModelNode, ModelState } from './types/ModelTypes';
import './styles/App.css';

const STORAGE_KEY = 'modelHierarchyState';
const SIDEBAR_WIDTH_KEY = 'sidebarWidth';

function App() {
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    return saved ? parseInt(saved, 10) : 300;
  });

  const [modelState, setModelState] = useState<ModelState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { nodes: [], selectedNodeId: null };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(modelState));
  }, [modelState]);

  useEffect(() => {
    localStorage.setItem(SIDEBAR_WIDTH_KEY, sidebarWidth.toString());
  }, [sidebarWidth]);

  const handleAddPrimitive = (type: PrimitiveType) => {
    const newNode: ModelNode = {
      id: crypto.randomUUID(),
      name: `${type}_${modelState.nodes.length + 1}`,
      type,
      children: [],
      properties: {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        dimensions: {
          width: 1,
          height: 1,
          depth: 1,
          radius: 0.5,
        },
      },
    };

    setModelState(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode],
    }));
  };

  const handleNodeSelect = (nodeId: string) => {
    setModelState(prev => ({
      ...prev,
      selectedNodeId: nodeId,
    }));
  };

  return (
    <div className="app">
      <div className="sidebar" style={{ width: sidebarWidth }}>
        <PrimitiveControls onAddPrimitive={handleAddPrimitive} />
        <ModelTree
          nodes={modelState.nodes}
          selectedNodeId={modelState.selectedNodeId}
          onNodeSelect={handleNodeSelect}
          onNodesChange={nodes => setModelState(prev => ({ ...prev, nodes }))}
        />
      </div>
      <ResizeHandle onResize={setSidebarWidth} />
      <div className="viewport">
        <Canvas>
          <ThreeScene
            nodes={modelState.nodes}
            selectedNodeId={modelState.selectedNodeId}
            onNodeSelect={handleNodeSelect}
          />
        </Canvas>
      </div>
    </div>
  );
}

export default App;

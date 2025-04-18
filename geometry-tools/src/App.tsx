import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import ModelTree from './components/ModelTree';
import ThreeScene from './components/ThreeScene';
import PrimitiveControls from './components/PrimitiveControls';
import ResizeHandle from './components/ResizeHandle';
import { ModelNode, ModelState, TransformControls, MaterialProperties } from './types/ModelTypes';
import MaterialControls from './components/MaterialControls';
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

  const [transformMode, setTransformMode] = useState<TransformControls['mode']>(null);

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
        material: {
          color: '#ffffff',
          metalness: 0.5,
          roughness: 0.5,
          emissive: '#000000',
          emissiveIntensity: 0,
          transparent: false,
          opacity: 1,
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

  const handleNodeTransform = (
    id: string,
    type: 'position' | 'rotation' | 'scale',
    value: [number, number, number]
  ) => {
    const updateNodeProperties = (nodes: ModelNode[]): ModelNode[] => {
      return nodes.map(node => {
        if (node.id === id) {
          return {
            ...node,
            properties: {
              ...node.properties,
              [type]: value,
            },
          };
        }
        return {
          ...node,
          children: updateNodeProperties(node.children),
        };
      });
    };

    setModelState(prev => ({
      ...prev,
      nodes: updateNodeProperties(prev.nodes),
    }));
  };

  const handleMaterialChange = (
    id: string,
    materialProps: Partial<MaterialProperties>
  ) => {
    const updateNodeMaterial = (nodes: ModelNode[]): ModelNode[] => {
      return nodes.map(node => {
        if (node.id === id) {
          return {
            ...node,
            properties: {
              ...node.properties,
              material: {
                ...node.properties.material,
                ...materialProps,
              },
            },
          };
        }
        return {
          ...node,
          children: updateNodeMaterial(node.children),
        };
      });
    };

    setModelState(prev => ({
      ...prev,
      nodes: updateNodeMaterial(prev.nodes),
    }));
  };

  const selectedNode = modelState.selectedNodeId
    ? modelState.nodes.find(node => node.id === modelState.selectedNodeId)
    : null;

  return (
    <div className="app">
      <div className="sidebar" style={{ width: sidebarWidth }}>
        <div className="transform-controls">
          <button
            className={`transform-button ${transformMode === 'translate' ? 'active' : ''}`}
            onClick={() => setTransformMode(prev => prev === 'translate' ? null : 'translate')}
          >
            Move
          </button>
          <button
            className={`transform-button ${transformMode === 'rotate' ? 'active' : ''}`}
            onClick={() => setTransformMode(prev => prev === 'rotate' ? null : 'rotate')}
          >
            Rotate
          </button>
          <button
            className={`transform-button ${transformMode === 'scale' ? 'active' : ''}`}
            onClick={() => setTransformMode(prev => prev === 'scale' ? null : 'scale')}
          >
            Scale
          </button>
        </div>
        <PrimitiveControls onAddPrimitive={handleAddPrimitive} />
        {selectedNode && selectedNode.type !== 'Group' && (
          <MaterialControls
            material={selectedNode.properties.material}
            onChange={(changes) => handleMaterialChange(selectedNode.id, changes)}
          />
        )}
        <ModelTree
          nodes={modelState.nodes}
          selectedNodeId={modelState.selectedNodeId}
          onNodeSelect={handleNodeSelect}
          onNodesChange={nodes => setModelState(prev => ({ ...prev, nodes }))}
        />
      </div>
      <ResizeHandle onResize={setSidebarWidth} />
      <div className="viewport">
        <Canvas shadows>
          <ThreeScene
            nodes={modelState.nodes}
            selectedNodeId={modelState.selectedNodeId}
            onNodeSelect={handleNodeSelect}
            onNodeTransform={handleNodeTransform}
            onMaterialChange={handleMaterialChange}
            transformMode={transformMode}
          />
        </Canvas>
      </div>
    </div>
  );
}

export default App;

import { Canvas } from '@react-three/fiber';
import ModelTree from './components/ModelTree';
import ThreeScene from './components/ThreeScene';
import PrimitiveControls from './components/PrimitiveControls';
import ResizeHandle from './components/ResizeHandle';
import MaterialControls from './components/MaterialControls';
import useModelStore from './store/modelStore';
import './styles/App.css';

function App() {
  const {
    modelState,
    sidebarWidth,
    transformMode,
    setSidebarWidth,
    setTransformMode,
    addPrimitive,
    selectNode,
    updateNodeTransform,
    updateMaterial,
  } = useModelStore();

  const selectedNode = modelState.selectedNodeId
    ? modelState.nodes.find(node => node.id === modelState.selectedNodeId)
    : null;

  return (
    <div className="app">
      <div className="sidebar" style={{ width: sidebarWidth }}>
        <div className="transform-controls">
          <button
            className={`transform-button ${transformMode === 'translate' ? 'active' : ''}`}
            onClick={() => setTransformMode(transformMode === 'translate' ? null : 'translate')}
          >
            Move
          </button>
          <button
            className={`transform-button ${transformMode === 'rotate' ? 'active' : ''}`}
            onClick={() => setTransformMode(transformMode === 'rotate' ? null : 'rotate')}
          >
            Rotate
          </button>
          <button
            className={`transform-button ${transformMode === 'scale' ? 'active' : ''}`}
            onClick={() => setTransformMode(transformMode === 'scale' ? null : 'scale')}
          >
            Scale
          </button>
        </div>
        <PrimitiveControls onAddPrimitive={addPrimitive} />
        {selectedNode && selectedNode.type !== 'Group' && (
          <MaterialControls
            material={selectedNode.properties.material}
            onChange={(changes) => updateMaterial(selectedNode.id, changes)}
          />
        )}
        <ModelTree
          nodes={modelState.nodes}
          selectedNodeId={modelState.selectedNodeId}
          onNodeSelect={selectNode}
          onNodesChange={nodes => useModelStore.getState().setModelState({ ...modelState, nodes })}
        />
      </div>
      <ResizeHandle onResize={setSidebarWidth} />
      <div className="viewport">
        <Canvas shadows>
          <ThreeScene
            nodes={modelState.nodes}
            selectedNodeId={modelState.selectedNodeId}
            onNodeSelect={selectNode}
            onNodeTransform={updateNodeTransform}
            onMaterialChange={updateMaterial}
            transformMode={transformMode}
          />
        </Canvas>
      </div>
    </div>
  );
}

export default App;

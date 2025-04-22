import { create } from 'zustand';
import { ModelNode, ModelState, TransformControls, MaterialProperties } from '../types/ModelTypes';

const STORAGE_KEY = 'modelHierarchyState';
const SIDEBAR_WIDTH_KEY = 'sidebarWidth';

interface ModelStore {
  // State
  modelState: ModelState;
  sidebarWidth: number;
  transformMode: TransformControls['mode'];

  // Actions
  setModelState: (modelState: ModelState) => void;
  setSidebarWidth: (width: number) => void;
  setTransformMode: (mode: TransformControls['mode']) => void;
  addPrimitive: (type: PrimitiveType) => void;
  selectNode: (nodeId: string) => void;
  updateNodeTransform: (
    id: string,
    type: 'position' | 'rotation' | 'scale',
    value: [number, number, number]
  ) => void;
  updateMaterial: (id: string, materialProps: Partial<MaterialProperties>) => void;
}

const useModelStore = create<ModelStore>((set, get) => ({
  // Initialize state
  modelState: (() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { nodes: [], selectedNodeId: null };
  })(),

  sidebarWidth: (() => {
    const saved = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    return saved ? parseInt(saved, 10) : 300;
  })(),

  transformMode: null,

  // Actions
  setModelState: (modelState) => {
    set({ modelState });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(modelState));
  },

  setSidebarWidth: (width) => {
    set({ sidebarWidth: width });
    localStorage.setItem(SIDEBAR_WIDTH_KEY, width.toString());
  },

  setTransformMode: (mode) => set({ transformMode: mode }),

  addPrimitive: (type) => {
    const newNode: ModelNode = {
      id: crypto.randomUUID(),
      name: `${type}_${get().modelState.nodes.length + 1}`,
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

    const newModelState = {
      ...get().modelState,
      nodes: [...get().modelState.nodes, newNode],
    };
    set({ modelState: newModelState });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newModelState));
  },

  selectNode: (nodeId) => {
    const newModelState = {
      ...get().modelState,
      selectedNodeId: nodeId,
    };
    set({ modelState: newModelState });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newModelState));
  },

  updateNodeTransform: (id, type, value) => {
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

    const newModelState = {
      ...get().modelState,
      nodes: updateNodeProperties(get().modelState.nodes),
    };
    set({ modelState: newModelState });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newModelState));
  },

  updateMaterial: (id, materialProps) => {
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

    const newModelState = {
      ...get().modelState,
      nodes: updateNodeMaterial(get().modelState.nodes),
    };
    set({ modelState: newModelState });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newModelState));
  },
}));

export default useModelStore; 
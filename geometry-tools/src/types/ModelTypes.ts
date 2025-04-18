export type PrimitiveType = 'Box' | 'Cylinder' | 'Cone' | 'Sphere';
export type NodeType = PrimitiveType | 'Group';

export interface MaterialProperties {
  color: string;
  metalness: number;
  roughness: number;
  emissive: string;
  emissiveIntensity: number;
  transparent: boolean;
  opacity: number;
}

export interface ModelNode {
  id: string;
  name: string;
  type: NodeType;
  children: ModelNode[];
  properties: {
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
    dimensions?: {
      width?: number;
      height?: number;
      depth?: number;
      radius?: number;
    };
    material: MaterialProperties;
  };
}

export interface ModelState {
  nodes: ModelNode[];
  selectedNodeId: string | null;
}

export interface TransformControls {
  mode: 'translate' | 'rotate' | 'scale' | null;
} 
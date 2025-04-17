export type PrimitiveType = 'Box' | 'Cylinder' | 'Cone' | 'Sphere';

export interface ModelNode {
  id: string;
  name: string;
  type: PrimitiveType;
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
  };
}

export interface ModelState {
  nodes: ModelNode[];
  selectedNodeId: string | null;
} 
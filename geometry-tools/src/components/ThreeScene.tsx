import React from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { ModelNode } from '../types/ModelTypes';

interface PrimitiveProps {
  node: ModelNode;
  isSelected: boolean;
  onClick: () => void;
}

const Primitive: React.FC<PrimitiveProps> = ({ node, isSelected, onClick }) => {
  const { position, rotation, scale, dimensions = {} } = node.properties;
  const color = isSelected ? '#2196f3' : '#ffffff';

  const getMesh = () => {
    switch (node.type) {
      case 'Box':
        return (
          <boxGeometry
            args={[
              dimensions.width || 1,
              dimensions.height || 1,
              dimensions.depth || 1,
            ]}
          />
        );
      case 'Cylinder':
        return (
          <cylinderGeometry
            args={[
              dimensions.radius || 0.5,
              dimensions.radius || 0.5,
              dimensions.height || 1,
              32,
            ]}
          />
        );
      case 'Cone':
        return (
          <coneGeometry
            args={[
              dimensions.radius || 0.5,
              dimensions.height || 1,
              32,
            ]}
          />
        );
      case 'Sphere':
        return (
          <sphereGeometry
            args={[dimensions.radius || 0.5, 32, 32]}
          />
        );
      default:
        return null;
    }
  };

  return (
    <mesh
      position={position}
      rotation={rotation as [number, number, number]}
      scale={scale}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {getMesh()}
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

interface ThreeSceneProps {
  nodes: ModelNode[];
  selectedNodeId: string | null;
  onNodeSelect: (id: string) => void;
}

const ThreeScene: React.FC<ThreeSceneProps> = ({
  nodes,
  selectedNodeId,
  onNodeSelect,
}) => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls />
      {nodes.map((node) => (
        <Primitive
          key={node.id}
          node={node}
          isSelected={node.id === selectedNodeId}
          onClick={() => onNodeSelect(node.id)}
        />
      ))}
    </>
  );
};

export default ThreeScene; 
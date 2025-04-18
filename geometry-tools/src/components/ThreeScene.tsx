import React, { useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { ModelNode } from '../types/ModelTypes';
import TransformControls from './TransformControls';
import * as THREE from 'three';

interface PrimitiveProps {
  node: ModelNode;
  isSelected: boolean;
  onClick: () => void;
  onTransformChange: (
    id: string,
    type: 'position' | 'rotation' | 'scale',
    value: [number, number, number]
  ) => void;
  onMaterialChange?: (
    id: string,
    materialProps: Partial<MaterialProperties>
  ) => void;
  transformMode: 'translate' | 'rotate' | 'scale' | null;
}

const Primitive: React.FC<PrimitiveProps> = ({
  node,
  isSelected,
  onClick,
  onTransformChange,
  onMaterialChange,
  transformMode,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { position, rotation, scale, dimensions = {}, material } = node.properties;

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
    <>
      <mesh
        ref={meshRef}
        position={position}
        rotation={rotation as [number, number, number]}
        scale={scale}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        castShadow
        receiveShadow
      >
        {getMesh()}
        <meshStandardMaterial
          color={material.color}
          metalness={material.metalness}
          roughness={material.roughness}
          emissive={new THREE.Color(material.emissive)}
          emissiveIntensity={material.emissiveIntensity}
          transparent={material.transparent}
          opacity={material.opacity}
        />
      </mesh>
      {isSelected && meshRef.current && (
        <TransformControls
          object={meshRef.current}
          mode={transformMode}
          onTransformChange={(type, value) => onTransformChange(node.id, type, value)}
        />
      )}
    </>
  );
};

interface ThreeSceneProps {
  nodes: ModelNode[];
  selectedNodeId: string | null;
  onNodeSelect: (id: string) => void;
  onNodeTransform: (
    id: string,
    type: 'position' | 'rotation' | 'scale',
    value: [number, number, number]
  ) => void;
  onMaterialChange: (
    id: string,
    materialProps: Partial<MaterialProperties>
  ) => void;
  transformMode: 'translate' | 'rotate' | 'scale' | null;
}

const ThreeScene: React.FC<ThreeSceneProps> = ({
  nodes,
  selectedNodeId,
  onNodeSelect,
  onNodeTransform,
  onMaterialChange,
  transformMode,
}) => {
  const renderNode = (node: ModelNode) => {
    if (node.type === 'Group') {
      return node.children.map(child => renderNode(child));
    }
    return (
      <Primitive
        key={node.id}
        node={node}
        isSelected={node.id === selectedNodeId}
        onClick={() => onNodeSelect(node.id)}
        onTransformChange={onNodeTransform}
        onMaterialChange={onMaterialChange}
        transformMode={transformMode}
      />
    );
  };

  return (
    <>
      <color attach="background" args={['#1a1a1a']} />
      <fog attach="fog" args={['#1a1a1a', 10, 50]} />
      
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight position={[-5, -5, -5]} intensity={0.2} />
      
      <Environment preset="city" />
      
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -2, 0]}
        receiveShadow
      >
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial
          color="#333333"
          roughness={1}
          metalness={0}
        />
      </mesh>
      
      <OrbitControls makeDefault />
      {nodes.map(node => renderNode(node))}
    </>
  );
};

export default ThreeScene; 
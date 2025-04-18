import React from 'react';
import { TransformControls as DreiTransformControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { Object3D } from 'three';

interface TransformControlsProps {
  object: Object3D;
  mode: 'translate' | 'rotate' | 'scale' | null;
  onTransformChange: (type: 'position' | 'rotation' | 'scale', value: [number, number, number]) => void;
}

const TransformControls: React.FC<TransformControlsProps> = ({
  object,
  mode,
  onTransformChange,
}) => {
  const { camera } = useThree();

  if (!mode) return null;

  return (
    <DreiTransformControls
      object={object}
      mode={mode}
      camera={camera}
      onObjectChange={(e) => {
        const obj = e.target.object;
        if (mode === 'translate') {
          onTransformChange('position', [obj.position.x, obj.position.y, obj.position.z]);
        } else if (mode === 'rotate') {
          onTransformChange('rotation', [obj.rotation.x, obj.rotation.y, obj.rotation.z]);
        } else if (mode === 'scale') {
          onTransformChange('scale', [obj.scale.x, obj.scale.y, obj.scale.z]);
        }
      }}
    />
  );
};

export default TransformControls; 
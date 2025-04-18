import React from 'react';
import { PrimitiveType } from '../types/ModelTypes';

interface PrimitiveControlsProps {
  onAddPrimitive: (type: PrimitiveType) => void;
}

const primitiveTypes: PrimitiveType[] = ['Box', 'Cylinder', 'Cone', 'Sphere'];

const PrimitiveControls: React.FC<PrimitiveControlsProps> = ({ onAddPrimitive }) => {
  return (
    <div className="primitive-controls">
      <h3>Add Primitive</h3>
      <div className="primitive-buttons">
        {primitiveTypes.map((type) => (
          <button
            key={type}
            onClick={() => onAddPrimitive(type)}
            className="primitive-button"
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PrimitiveControls; 
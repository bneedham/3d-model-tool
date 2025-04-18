import React from 'react';
import { MaterialProperties } from '../types/ModelTypes';

interface MaterialControlsProps {
  material: MaterialProperties;
  onChange: (changes: Partial<MaterialProperties>) => void;
}

const MaterialControls: React.FC<MaterialControlsProps> = ({
  material,
  onChange,
}) => {
  return (
    <div className="material-controls">
      <h3>Material Properties</h3>
      
      <div className="control-group">
        <label>
          Color:
          <input
            type="color"
            value={material.color}
            onChange={(e) => onChange({ color: e.target.value })}
          />
        </label>
      </div>

      <div className="control-group">
        <label>
          Metalness:
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={material.metalness}
            onChange={(e) => onChange({ metalness: parseFloat(e.target.value) })}
          />
          <span>{material.metalness.toFixed(2)}</span>
        </label>
      </div>

      <div className="control-group">
        <label>
          Roughness:
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={material.roughness}
            onChange={(e) => onChange({ roughness: parseFloat(e.target.value) })}
          />
          <span>{material.roughness.toFixed(2)}</span>
        </label>
      </div>

      <div className="control-group">
        <label>
          Emissive Color:
          <input
            type="color"
            value={material.emissive}
            onChange={(e) => onChange({ emissive: e.target.value })}
          />
        </label>
      </div>

      <div className="control-group">
        <label>
          Emissive Intensity:
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={material.emissiveIntensity}
            onChange={(e) => onChange({ emissiveIntensity: parseFloat(e.target.value) })}
          />
          <span>{material.emissiveIntensity.toFixed(1)}</span>
        </label>
      </div>

      <div className="control-group">
        <label>
          <input
            type="checkbox"
            checked={material.transparent}
            onChange={(e) => onChange({ transparent: e.target.checked })}
          />
          Transparent
        </label>
      </div>

      {material.transparent && (
        <div className="control-group">
          <label>
            Opacity:
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={material.opacity}
              onChange={(e) => onChange({ opacity: parseFloat(e.target.value) })}
            />
            <span>{material.opacity.toFixed(2)}</span>
          </label>
        </div>
      )}
    </div>
  );
};

export default MaterialControls; 
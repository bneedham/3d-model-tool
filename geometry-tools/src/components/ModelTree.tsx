import React from 'react';
import { ModelNode } from '../types/ModelTypes';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface TreeNodeProps {
  node: ModelNode;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onMove: (dragId: string, hoverId: string) => void;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, isSelected, onSelect, onMove }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'node',
    item: { id: node.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'node',
    drop: (item: { id: string }) => {
      if (item.id !== node.id) {
        onMove(item.id, node.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`tree-node ${isSelected ? 'selected' : ''} ${isOver ? 'drop-target' : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      onClick={() => onSelect(node.id)}
    >
      <span>{node.name} ({node.type})</span>
      {node.children.length > 0 && (
        <div className="node-children">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              isSelected={isSelected}
              onSelect={onSelect}
              onMove={onMove}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface ModelTreeProps {
  nodes: ModelNode[];
  selectedNodeId: string | null;
  onNodeSelect: (id: string) => void;
  onNodesChange: (nodes: ModelNode[]) => void;
}

const ModelTree: React.FC<ModelTreeProps> = ({
  nodes,
  selectedNodeId,
  onNodeSelect,
  onNodesChange,
}) => {
  const handleMove = (dragId: string, hoverId: string) => {
    const updateNodes = (nodes: ModelNode[]): ModelNode[] => {
      return nodes.map(node => {
        if (node.id === dragId) {
          return { ...node };
        }
        if (node.id === hoverId) {
          return {
            ...node,
            children: [...node.children, nodes.find(n => n.id === dragId)!],
          };
        }
        return {
          ...node,
          children: updateNodes(node.children),
        };
      });
    };

    onNodesChange(updateNodes(nodes));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="model-tree">
        {nodes.map((node) => (
          <TreeNode
            key={node.id}
            node={node}
            isSelected={node.id === selectedNodeId}
            onSelect={onNodeSelect}
            onMove={handleMove}
          />
        ))}
      </div>
    </DndProvider>
  );
};

export default ModelTree; 
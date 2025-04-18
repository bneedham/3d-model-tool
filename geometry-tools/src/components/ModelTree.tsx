import React, { useState } from 'react';
import { ModelNode, NodeType } from '../types/ModelTypes';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface TreeNodeProps {
  node: ModelNode;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onMove: (dragId: string, hoverId: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, newName: string) => void;
  level: number;
}

const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  isSelected,
  onSelect,
  onMove,
  onDelete,
  onRename,
  level,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(node.name);

  const [{ isDragging }, drag] = useDrag({
    type: 'node',
    item: { id: node.id, type: node.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'node',
    drop: (item: { id: string, type: NodeType }, monitor) => {
      if (monitor.didDrop()) return;
      if (item.id !== node.id) {
        onMove(item.id, node.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
    canDrop: (item: { id: string, type: NodeType }) => {
      return node.type === 'Group' || level === 0;
    },
  });

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onRename(node.id, newName);
      setIsEditing(false);
    } else if (e.key === 'Escape') {
      setNewName(node.name);
      setIsEditing(false);
    }
  };

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`tree-node ${isSelected ? 'selected' : ''} ${isOver ? 'drop-target' : ''}`}
      style={{
        opacity: isDragging ? 0.5 : 1,
        marginLeft: `${level * 20}px`,
      }}
      onClick={() => onSelect(node.id)}
    >
      <div className="tree-node-content">
        {isEditing ? (
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              onRename(node.id, newName);
              setIsEditing(false);
            }}
            autoFocus
          />
        ) : (
          <span onDoubleClick={handleDoubleClick}>
            {node.name} ({node.type})
          </span>
        )}
        <button
          className="delete-button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(node.id);
          }}
        >
          ×
        </button>
      </div>
      {node.children.length > 0 && (
        <div className="node-children">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              isSelected={isSelected}
              onSelect={onSelect}
              onMove={onMove}
              onDelete={onDelete}
              onRename={onRename}
              level={level + 1}
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
  const handleMove = (dragId: string, targetId: string) => {
    const findAndRemoveNode = (nodes: ModelNode[], id: string): [ModelNode[], ModelNode | null] => {
      let removedNode = null;
      const newNodes = nodes.filter(node => {
        if (node.id === id) {
          removedNode = node;
          return false;
        }
        const [newChildren, removed] = findAndRemoveNode(node.children, id);
        node.children = newChildren;
        if (removed) removedNode = removed;
        return true;
      });
      return [newNodes, removedNode];
    };

    const addNodeToTarget = (nodes: ModelNode[], targetId: string, nodeToAdd: ModelNode): boolean => {
      return nodes.some(node => {
        if (node.id === targetId) {
          if (node.type === 'Group') {
            node.children.push(nodeToAdd);
          }
          return true;
        }
        return addNodeToTarget(node.children, targetId, nodeToAdd);
      });
    };

    const [newNodes, removedNode] = findAndRemoveNode(nodes, dragId);
    if (removedNode) {
      if (!addNodeToTarget(newNodes, targetId, removedNode)) {
        newNodes.push(removedNode);
      }
      onNodesChange(newNodes);
    }
  };

  const handleDelete = (id: string) => {
    const deleteNode = (nodes: ModelNode[]): ModelNode[] => {
      return nodes.filter(node => {
        if (node.id === id) return false;
        node.children = deleteNode(node.children);
        return true;
      });
    };
    onNodesChange(deleteNode(nodes));
  };

  const handleRename = (id: string, newName: string) => {
    const renameNode = (nodes: ModelNode[]): ModelNode[] => {
      return nodes.map(node => {
        if (node.id === id) {
          return { ...node, name: newName };
        }
        return {
          ...node,
          children: renameNode(node.children),
        };
      });
    };
    onNodesChange(renameNode(nodes));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="model-tree">
        <button
          className="add-group-button"
          onClick={() => {
            const newGroup: ModelNode = {
              id: crypto.randomUUID(),
              name: 'New Group',
              type: 'Group',
              children: [],
              properties: {
                position: [0, 0, 0],
                rotation: [0, 0, 0],
                scale: [1, 1, 1],
              },
            };
            onNodesChange([...nodes, newGroup]);
          }}
        >
          Add Group
        </button>
        {nodes.map((node) => (
          <TreeNode
            key={node.id}
            node={node}
            isSelected={node.id === selectedNodeId}
            onSelect={onNodeSelect}
            onMove={handleMove}
            onDelete={handleDelete}
            onRename={handleRename}
            level={0}
          />
        ))}
      </div>
    </DndProvider>
  );
};

export default ModelTree; 
import React, { useCallback, useEffect } from 'react';

interface ResizeHandleProps {
  onResize: (newWidth: number) => void;
  minWidth?: number;
  maxWidth?: number;
}

const ResizeHandle: React.FC<ResizeHandleProps> = ({
  onResize,
  minWidth = 200,
  maxWidth = 600
}) => {
  const handleDrag = useCallback((e: MouseEvent) => {
    const newWidth = e.clientX;
    if (newWidth >= minWidth && newWidth <= maxWidth) {
      onResize(newWidth);
    }
  }, [onResize, minWidth, maxWidth]);

  const handleDragEnd = useCallback(() => {
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', handleDragEnd);
    document.body.style.cursor = 'default';
    document.body.style.userSelect = 'auto';
  }, [handleDrag]);

  const startResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', handleDragEnd);
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
  }, [handleDrag, handleDragEnd]);

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mouseup', handleDragEnd);
    };
  }, [handleDrag, handleDragEnd]);

  return (
    <div
      className="resize-handle"
      onMouseDown={startResize}
      title="Drag to resize"
    />
  );
};

export default ResizeHandle; 
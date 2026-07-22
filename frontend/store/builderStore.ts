import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export type ElementType = 'Container' | 'Widget';

export interface BuilderNode {
  id: string;
  type: ElementType;
  moduleName: string;
  properties: {
    // 1. Tab Content
    title?: string;
    content?: string;
    num?: string;
    boxType?: string;
    // 2. Tab Style
    color?: string;
    bg?: string;
    // 3. Tab Advanced (Flexbox, Margin, Padding)
    direction?: 'row' | 'column';
    gap?: string;
    padding?: string;
    margin?: string;
    border?: string;
    radius?: string;
    [key: string]: any;
  };
  children?: BuilderNode[];
}

interface BuilderState {
  rootNode: BuilderNode;
  selectedNodeId: string | null;
  setSelectedNode: (id: string | null) => void;
  updateNodeProps: (id: string, newProps: any) => void;
  removeNode: (id: string) => void;
  addNode: (parentId: string, newNode: Partial<BuilderNode>, index?: number) => void;
  moveNode: (sourceId: string, destinationParentId: string, destIndex: number) => void;
}

// Thuật toán đệ quy tìm Node
const findNode = (node: BuilderNode, targetId: string): BuilderNode | null => {
  if (node.id === targetId) return node;
  if (node.children) {
    for (const child of node.children) {
      const found = findNode(child, targetId);
      if (found) return found;
    }
  }
  return null;
};

export const useBuilderStore = create<BuilderState>((set) => ({
  rootNode: {
    id: 'root-canvas',
    type: 'Container',
    moduleName: 'Page',
    properties: { 
      paperSize: 'a4', margin: '1.5cm', font: 'Times New Roman', fontSize: '12pt',
      direction: 'column', gap: '15pt', padding: '0pt' // Thuộc tính của Page gốc
    },
    children: []
  },
  selectedNodeId: null,

  setSelectedNode: (id) => set({ selectedNodeId: id }),

  updateNodeProps: (id, newProps) => set((state) => {
    const newRoot = JSON.parse(JSON.stringify(state.rootNode)); // Deep Clone an toàn
    const node = findNode(newRoot, id);
    if (node) {
      node.properties = { ...node.properties, ...newProps };
    }
    return { rootNode: newRoot };
  }),

  removeNode: (id) => set((state) => {
    if (id === 'root-canvas') return state;
    const newRoot = JSON.parse(JSON.stringify(state.rootNode));

    const removeRecursive = (node: BuilderNode) => {
      if (node.children) {
        const idx = node.children.findIndex(c => c.id === id);
        if (idx !== -1) {
          node.children.splice(idx, 1);
          return true;
        }
        for (const child of node.children) {
          if (removeRecursive(child)) return true;
        }
      }
      return false;
    };
    removeRecursive(newRoot);

    return { rootNode: newRoot, selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId };
  }),

  addNode: (parentId, newNode, index) => set((state) => {
    const newRoot = JSON.parse(JSON.stringify(state.rootNode));
    const nodeToAdd: BuilderNode = {
      id: uuidv4(),
      type: newNode.type || 'Widget',
      moduleName: newNode.moduleName || 'Text',
      properties: newNode.properties || {},
      children: newNode.children
    };
    
    const parentNode = findNode(newRoot, parentId);
    if (parentNode && parentNode.type === 'Container') {
      if (!parentNode.children) parentNode.children = [];
      if (index !== undefined && index >= 0) {
        parentNode.children.splice(index, 0, nodeToAdd);
      } else {
        parentNode.children.push(nodeToAdd);
      }
    }
    return { rootNode: newRoot, selectedNodeId: nodeToAdd.id };
  }),

  moveNode: (sourceId, destinationParentId, destIndex) => set((state) => {
    const newRoot = JSON.parse(JSON.stringify(state.rootNode));

    // 1. Cắt Node ra khỏi vị trí cũ
    let nodeToMove: BuilderNode | null = null;
    const removeRecursive = (node: BuilderNode) => {
      if (node.children) {
        const idx = node.children.findIndex(c => c.id === sourceId);
        if (idx !== -1) {
          nodeToMove = node.children[idx];
          node.children.splice(idx, 1);
          return true;
        }
        for (const child of node.children) {
          if (removeRecursive(child)) return true;
        }
      }
      return false;
    };
    removeRecursive(newRoot);

    if (!nodeToMove) return state;

    // 2. Gắn Node vào vị trí mới
    const parentNode = findNode(newRoot, destinationParentId);
    if (parentNode && parentNode.type === 'Container') {
      if (!parentNode.children) parentNode.children = [];
      parentNode.children.splice(destIndex, 0, nodeToMove);
    }

    return { rootNode: newRoot };
  })
}));

export const useSelectedNode = () => {
  const { rootNode, selectedNodeId } = useBuilderStore();
  if (!selectedNodeId) return null;
  return findNode(rootNode, selectedNodeId);
};
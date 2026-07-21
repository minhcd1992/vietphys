import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { BuilderNode, ContainerNode, SectionNode, ModuleNode, RowNode } from '../types/builder';

interface BuilderState {
  rootNode: ContainerNode;
  selectedNodeId: string | null; // <--- TRẠNG THÁI MỚI: LƯU KHỐI ĐANG ĐƯỢC CHỌN

  setSelectedNode: (id: string | null) => void; // <--- ACTION MỚI
  updateNodeProps: (id: string, newProps: any) => void;
  removeNode: (id: string) => void;
  addNode: (parentId: string, newNode: SectionNode | RowNode | ModuleNode, index?: number) => void;
  reorderChildren: (parentId: string, startIndex: number, endIndex: number) => void;
}

const mapTree = (node: BuilderNode, targetId: string, updater: (n: BuilderNode) => BuilderNode | null): BuilderNode | null => {
  if (node.id === targetId) return updater(node);
  if ('children' in node && node.children) {
    const newChildren = node.children
      .map(child => mapTree(child, targetId, updater))
      .filter((child): child is BuilderNode => child !== null);
    return { ...node, children: newChildren } as BuilderNode;
  }
  return node;
};

// Thuật toán đệ quy để tìm một Node dựa vào ID
const findNode = (node: BuilderNode, targetId: string): BuilderNode | null => {
  if (node.id === targetId) return node;
  if ('children' in node && node.children) {
    for (const child of node.children) {
      const found = findNode(child, targetId);
      if (found) return found;
    }
  }
  return null;
};

export const useBuilderStore = create<BuilderState>((set, get) => ({
  rootNode: {
    id: 'root-container',
    type: 'Container',
    properties: { title: 'ĐỀ KIỂM TRA MÔN VẬT LÝ', subtitle: 'Thời gian làm bài: 45 phút', paperSize: 'a4' },
    children: []
  },
  selectedNodeId: null,

  setSelectedNode: (id) => set({ selectedNodeId: id }),

  updateNodeProps: (id, newProps) => set((state) => {
    const updatedRoot = mapTree(state.rootNode, id, (node) => ({
      ...node,
      properties: { ...node.properties, ...newProps }
    }));
    return { rootNode: updatedRoot as ContainerNode };
  }),

  removeNode: (id) => set((state) => {
    if (id === 'root-container') return state;
    const updatedRoot = mapTree(state.rootNode, id, () => null);
    // Nếu xóa đúng node đang chọn thì reset bảng thuộc tính
    return { rootNode: updatedRoot as ContainerNode, selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId };
  }),

  addNode: (parentId, newNode, index) => set((state) => {
    const nodeToAdd = { ...newNode, id: newNode.id || uuidv4() };
    const updatedRoot = mapTree(state.rootNode, parentId, (node) => {
      if ('children' in node) {
        const children = [...node.children];
        if (index !== undefined && index >= 0) children.splice(index, 0, nodeToAdd as any);
        else children.push(nodeToAdd as any);
        return { ...node, children } as BuilderNode;
      }
      return node;
    });
    return { rootNode: updatedRoot as ContainerNode, selectedNodeId: nodeToAdd.id }; // Tự động chọn khối vừa thêm
  }),

  reorderChildren: (parentId, startIndex, endIndex) => set((state) => {
    const updatedRoot = mapTree(state.rootNode, parentId, (node) => {
      if ('children' in node && node.children) {
        const newChildren = Array.from(node.children);
        const [removed] = newChildren.splice(startIndex, 1);
        newChildren.splice(endIndex, 0, removed);
        return { ...node, children: newChildren } as BuilderNode;
      }
      return node;
    });
    return { rootNode: updatedRoot as ContainerNode };
  }),
}));

// Export thêm hàm hook nhỏ để lấy node đang được chọn
export const useSelectedNode = () => {
  const { rootNode, selectedNodeId } = useBuilderStore();
  if (!selectedNodeId) return null;
  return findNode(rootNode, selectedNodeId);
};
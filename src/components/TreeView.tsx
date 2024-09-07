import * as React from 'react';
import Box from '@mui/material/Box';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import Button from '@mui/material/Button';

export default function TreeView() {
  const [tree, setTree] = React.useState(MUI_X_PRODUCTS);
  const index = React.useRef(0);
  const [selected, setSelected] = React.useState<string>('');

    const findItemById = (nodes: TreeViewBaseItem[], itemId: string): TreeViewBaseItem | null => {
    for (const node of nodes) {
      if (node.id === itemId) {
        return node;
      }
      if (node.children) {
        const found = findItemById(node.children, itemId);
        if (found) {
          return found;
        }
      }
    }
    return null;
  };

  const onSelect = (_: React.SyntheticEvent, itemId: string, _2: boolean) => {
    const item = findItemById(tree, itemId);
    // 子要素を持たない末端の要素だけ選択対象とする（長さ0も対象外）
    if (item === undefined || item === null || item.children !== undefined) {
      return;
    }
    setSelected(item.label);
  }

  const addTree = () => {
    const newTree = [...tree];
    const i = index.current;
    newTree.push({
      id: `new-${i}`,
      label: `new-${i}`,
      children: [
        { id: `new-community-${i}`, label: `new-community-${i}` },
      ],
    });
    setTree(newTree);
    index.current += 1;
  }

  return (
    <div>
      <p>
        <Button onClick={addTree}>
            要素追加
        </Button>
      </p>
      <Box sx={{ minHeight: 352, minWidth: 250 }}>
        <RichTreeView items={tree} onItemSelectionToggle={onSelect} />
      </Box>
      <p>
        Selected: {selected}
      </p>
    </div>
  );
}

const MUI_X_PRODUCTS: TreeViewBaseItem[] = [
  {
    id: 'grid',
    label: 'Data Grid',
    children: [
      { id: 'grid-community', label: '@mui/x-data-grid' },
      { id: 'grid-pro', label: '@mui/x-data-grid-pro' },
      { id: 'grid-premium', label: '@mui/x-data-grid-premium' },
    ],
  },
  {
    id: 'pickers',
    label: 'Date and Time Pickers',
    children: [
      { id: 'pickers-community', label: '@mui/x-date-pickers' },
      { id: 'pickers-pro', label: '@mui/x-date-pickers-pro' },
    ],
  },
  {
    id: 'charts',
    label: 'Charts',
    children: [{ id: 'charts-community', label: '@mui/x-charts' }],
  },
  {
    id: 'tree-view',
    label: 'Tree View',
    children: [{ id: 'tree-view-community', label: '@mui/x-tree-view' }],
  },
];

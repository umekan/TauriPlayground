import { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';

export class DrawerProps {
  items: { name: string, icon: JSX.Element }[];
  selectedPageIndex: number;
  onSelectPage: (page: number) => void;

  constructor(items: { name: string, icon: JSX.Element }[], selectedPage: number, onSelectPage: (page: number) => void) {
    this.items = items;
    this.selectedPageIndex = selectedPage;
    this.onSelectPage = onSelectPage;
  }
}

interface TemporaryDrawerProps {
  drawerProps: DrawerProps;
}

export function TemporaryDrawer(props: TemporaryDrawerProps) {
  const { items, selectedPageIndex, onSelectPage } = props.drawerProps;
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const handleListItemClick = (page: number) => {
    onSelectPage(page);
    setOpen(false);
  };

  const DrawerList = (
    <div>
      <Box sx={{ minWidth: 300 }}>
      <List>
        {items.map((page, index) => (
          <ListItem key={page.name} disablePadding>
            <ListItemButton selected={selectedPageIndex === index} onClick={() => handleListItemClick(index)}>
              {page.icon}
              <ListItemText primary={page.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      </Box>
    </div>
  );

  return (
    <div>
      <Button onClick={toggleDrawer(true)}>メニュー</Button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}

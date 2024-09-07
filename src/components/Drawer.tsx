import { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Box from '@mui/material/Box';

export class DrawerProps {
  items: string[];
  selectedPage: string;
  onSelectPage: (page: string) => void;

  constructor(items: string[], selectedPage: string, onSelectPage: (page: string) => void) {
    this.items = items;
    this.selectedPage = selectedPage;
    this.onSelectPage = onSelectPage;
  }
}

interface TemporaryDrawerProps {
  drawerProps: DrawerProps;
}

export function TemporaryDrawer(props: TemporaryDrawerProps) {
  const { items, selectedPage, onSelectPage } = props.drawerProps;
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const handleListItemClick = (page: string) => {
    onSelectPage(page);
    setOpen(false);
  };

  const DrawerList = (
    <div>
      <Box sx={{ minWidth: 300 }}>
      <List>
        {items.map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton selected={selectedPage === text} onClick={() => handleListItemClick(text)}>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
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

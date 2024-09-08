import "./App.css";
import { useState } from "react";
import { TemporaryDrawer, DrawerProps } from "./components/Drawer";
import FileSelectButton from "./components/FileSelectButton";
import Home from "./components/Home";
import TreeView from "./components/TreeView";
import SaveTest from "./components/SaveTest";
import HomeIcon from '@mui/icons-material/HomeSharp';
import FormatColorTextOutlinedIcon from '@mui/icons-material/FormatColorTextOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import SaveAsOutlinedIcon from '@mui/icons-material/SaveAsOutlined';

function App() {
  // アイコンも渡す
  const pageTypesWithIcons: { name: string, icon: JSX.Element }[] = [
    { name: 'Home', icon: <HomeIcon /> },
    { name: 'File List', icon: <FormatColorTextOutlinedIcon /> },
    { name: 'Tree View', icon: <AccountTreeOutlinedIcon /> },
    { name: 'Save Test', icon: <SaveAsOutlinedIcon /> }
  ];

  const [selectedPage, setSelectedPage] = useState(0);
  const drawerProps = new DrawerProps(pageTypesWithIcons, selectedPage, setSelectedPage);

  return (
    <div>
      <TemporaryDrawer drawerProps={drawerProps} />
      <h1>{pageTypesWithIcons[selectedPage].icon} {pageTypesWithIcons[selectedPage].name}</h1>
      {selectedPage === 0 && <Home />}
      {selectedPage === 1 && <FileSelectButton />}
      {selectedPage === 2 && <TreeView />}
      {selectedPage === 3 && <SaveTest />}
    </div>
  );
}

export default App;

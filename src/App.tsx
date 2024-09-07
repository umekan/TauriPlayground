import "./App.css";
import { useState } from "react";
import {TemporaryDrawer, DrawerProps} from "./components/Drawer";
import FileSelectButton from "./components/FileSelectButton";
import TreeView from "./components/TreeView";

function App() {
  const pageTypes: string[] = [
    'Home',
    'File List',
    'Tree View',
  ];

  const [selectedPage, setSelectedPage] = useState<string>(pageTypes[0]);
  const drawerProps = new DrawerProps(pageTypes, selectedPage, setSelectedPage);

  return (
    <div>
      <TemporaryDrawer drawerProps={drawerProps}/>
      <h1>{selectedPage}</h1>
      {selectedPage === 'Home' && <div>Home Component</div>}
      {selectedPage === 'Tree View' && <TreeView />}
      {selectedPage === 'File List' && <FileSelectButton />}
    </div>
  );
}

export default App;

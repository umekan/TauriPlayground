import { useState } from "react";
import MDEditor from '@uiw/react-md-editor';
import { Box, Button } from "@mui/material";

export default function App() {
  const [saveValue, setSaveValue] = useState('');
  const [value, setValue] = useState("**Hello world!!!**  <style>body{display:none;}</style> ");
  return (
    <div>
    <Box margin={'auto 0'} height={500}>
      <MDEditor
        value={value}
        height="100%"
        previewOptions={{
          disallowedElements: ['style'],
        }}
        visibleDragbar={false}
        onChange={(value) => setValue(value || '')}
      />
    </Box>
    <Button component="label" variant="contained" onClick={() => setSaveValue(value)}>保存</Button>
    <textarea value={saveValue} readOnly={true} style={{width: '100%', height: 200, backgroundColor:"black", color:"white"}}/>
    </div>
  );
}
import { useState } from "react";
import MDEditor from '@uiw/react-md-editor';
import { Box, Button } from "@mui/material";
import { tauri } from '@tauri-apps/api';

export default function App() {
  const [saveValue, setSaveValue] = useState('');
  const [value, setValue] = useState("**Hello world!!!**  <style>body{display:none;}</style> ");

  const insert_diary = async () => {
    const dateTime = new Date().toISOString();
    await tauri.invoke('insert_diary', {
      id:1,
      name: dateTime,
      content: value,
      description: '追加した日記だよ。これがちゃんと追加できてたら嬉しいな。C#コードのはずだよ。',
      languageId: 6 });
  }

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
      <Button component="label" variant="contained" onClick={() => {
        setSaveValue(value);
        insert_diary();
      }}>保存</Button>
      <textarea value={saveValue} readOnly={true} style={{ width: '100%', height: 200, backgroundColor: "black", color: "white" }} />
    </div>
  );
}
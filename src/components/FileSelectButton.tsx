import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { List, ListItem, ListItemText } from '@mui/material';
import { useState } from 'react';
import Box from '@mui/material/Box';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import { open } from '@tauri-apps/api/dialog';
import { tauri } from '@tauri-apps/api';


export default function InputFileUpload() {

  const [files, updateFiles] = useState<string[]>([]);
  const [concatenated, updateConcatenated] = useState<string>('');

  const handleFileSelect = async () => {
    const selected = await open({
      multiple: true,
      filters: [{
        name: 'Text files',
        extensions: ['txt']
      }]
    });
  
    if (Array.isArray(selected)) {
      updateFiles(selected);
    } else if (selected) {
      updateFiles([selected]);
    }
  };

  const handleFileRemove = (index: number) => {
    const newFilesList = files.filter((_, i) => i !== index);
    updateFiles(newFilesList);
  };

  const handleConcat = async (): Promise<string> => {
    // rust側では引数名はスネークケースなんだけど、tauriがキャメルケースに変換してしまう
    const concatenated = await tauri.invoke<string>('file_concat', { fullPaths: files });
    updateConcatenated(concatenated);
    return concatenated
  };

  const extractCharacters = async (): Promise<string> => {
    const extracted = await tauri.invoke<string>('extract_characters', { fullPaths: files });
    updateConcatenated(extracted);
    return extracted
  }

  return (
    <div>
      <p style={{ textAlign: 'center' }}>
        <Button component="label" role={undefined} variant="contained" tabIndex={-1} startIcon={<CloudUploadIcon />} sx={buttonSx}
          onClick={handleFileSelect}>
          Select files
        </Button>
        {files.length > 0 && <span>{files.length} files selected</span>}
      </p>
      <Box sx={{ minHeight: 200, minWidth: 600 }}>
        <List sx={listStyle} subheader={<li />}>
          {files.map((file, index) => (
            <ListItem key={`file-${index}`} sx={listItemStyle}>
              <ListItemText primary={`Path: ${file}`} sx={{margin: 'auto 10px'}}/>
              <Button onClick={() => handleFileRemove(index)}>
                DEL
              </Button>
            </ListItem>
          ))}
        </List>
      </Box>
      <p style={{ textAlign: 'center' }}>
      <Button component="label" role={undefined} variant="contained" tabIndex={-1} startIcon={<ContentPasteSearchIcon />} sx={buttonSx}
        onClick={handleConcat}>
        Concat
      </Button>
      <Button component="label" role={undefined} variant="contained" tabIndex={-1} startIcon={<ContentPasteSearchIcon />} sx={buttonSx}
        onClick={extractCharacters}>
        使用文字の抽出
      </Button>
      </p>
      <p>{concatenated}</p>
    </div>
  );
};

const buttonSx = {
  color: 'white',
  width: 400,
  marginRight: 2,
  backgroundColor: '#3f51b5',
  '&:hover': {
    backgroundColor: '#303f9f',
  },
}

const listStyle = {
  alignProperty: 'center',
  margin: 'auto 100px',
  height: 400,
  bgcolor: '#cccccc',
  maxHeight: 400,
  overflow: 'auto',
  padding: 3,
  '& ul': { padding: 0 },
};

const listItemStyle = {
  bgcolor: 'ff0000', // 背景色を少し明るく変更
  color: '#000000', // 文字色を変更
  marginBottom: '8px', // 各アイテムの間にスペースを追加
  borderRadius: '8px', // 角をさらに丸くする
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // ボックスシャドウを追加
  border: '1px solid #ddd', // ボーダーを追加
  transition: 'background-color 0.3s, box-shadow 0.3s', // トランジションを追加
  '&:hover': {
    bgcolor: '#e0e0e0', // マウスオーバー時の背景色を変更
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)', // ホバー時のボックスシャドウを変更
  },
  '& .MuiListItemText-primary': {
    fontWeight: 'bold', // プライマリテキストを太字にする
  },
  '& .MuiListItemText-secondary': {
    fontStyle: 'italic', // セカンダリテキストをイタリックにする
  },
};
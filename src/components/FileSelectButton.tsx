import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { List, ListItem, ListItemText } from '@mui/material';
import { useState } from 'react';
import Box from '@mui/material/Box';

export default function InputFileUpload() {

  const [files, updateFiles] = useState<File[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files;
    if (newFiles) {
      // 既存のファイルに追加する
      const newFilesList = files.concat(Array.from(newFiles));
      updateFiles(newFilesList);
    }
  };

  const handleFileRemove = (index: number) => {
    const newFilesList = files.filter((_, i) => i !== index);
    updateFiles(newFilesList);
  };

  return (
    <div>
      <p style={{textAlign: 'center' }}>
        <Button component="label" role={undefined} variant="contained" tabIndex={-1} startIcon={<CloudUploadIcon />} sx={buttonSx}>
          Upload files
          <VisuallyHiddenInput type="file" accept=".txt" onChange={(event) => handleFileUpload(event)} multiple/>
        </Button>
        {files.length > 0 && <span>{files.length} files selected</span>}
      </p>
      <Box sx={{ minHeight: 300, minWidth: 600 }}>
      <List style={{ margin: '0 auto' }} sx={listStyle} subheader={<li />}>
        {files.map((file, index) => (
          <ListItem key={`file-${index}`} sx={listItemStyle}>
            <ListItemText primary={`Name: ${file.name}`} secondary={`Size: ${file.size} bytes`}/>
            <Button onClick={() => handleFileRemove(index)}>
              DEL
            </Button>
          </ListItem>
        ))}
      </List>
      </Box>
    </div>
  );
};


const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

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
  maxWidth: 600,
  width: 800,
  height: 400,
  bgcolor: 'background.paper',
  maxHeight: 400,
  overflow: 'auto',
  '& ul': { padding: 0 },
};

const listItemStyle = {
  bgcolor: '#f9f9f9', // 背景色を少し明るく変更
  color: '#333', // 文字色を変更
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
import { Box, FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { Styles } from '../HighlightPatterns';
import { useState } from 'react';
import { InputLabel } from '@mui/material';

interface DiaryThumbnailProps {
    name: string;
    highlight_label: string;
    language: string;
    content: string;
    description: string;
}

export default function DiaryThumbnail(prop: DiaryThumbnailProps) {
    const [styleIndex, setStyleIndex] = useState(0);

    const handleStyleChange = (event: SelectChangeEvent) => {
        const value = event.target.value;
        const index = Styles.findIndex(style => style.name === value);
        setStyleIndex(index);
    };

    return (
        <div>
            <Box sx={{ width: 400, height: 500 }}>
                <Box sx={{ width: 400, height: 100 }}>
                    <h3>{prop.name} ({prop.language})</h3>
                    <FormControl fullWidth>
                        <InputLabel variant="standard" htmlFor="uncontrolled-native">{Styles[styleIndex].name}</InputLabel>
                        <Select
                            labelId="demo-simple-select-autowidth-label"
                            id="demo-simple-select-autowidth"
                            onChange={handleStyleChange}
                            autoWidth
                        >
                            {Styles.map((style, index) => (
                                <MenuItem key={index} value={style.name}>{style.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{ width: 400, height: 250, fontSize: 14, lineHeight: 1.1, overflow:'auto'}}>
                    <SyntaxHighlighter language={prop.highlight_label} style={Styles[styleIndex].style}>
                        {prop.content}
                    </SyntaxHighlighter>
                </Box>
                <Box sx={{ width: 400, height: 150, fontSize: 14, lineHeight: 1.1, overflow:'auto',
                    backgroundColor: 'gray', wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
                    {prop.description}
                </Box>
            </Box>
        </div>
    );
}

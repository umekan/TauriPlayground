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
            <Box sx={{ width: 400, height: 400 }}>
                <p>
                    <h2>{prop.name} ({prop.language})</h2>
                    <FormControl fullWidth>
                        <InputLabel variant="standard" htmlFor="uncontrolled-native">Style</InputLabel>
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
                </p>
                <Box sx={{ width: 400, height: 250 }}>
                    <SyntaxHighlighter language={prop.highlight_label} style={Styles[styleIndex].style}>
                        {prop.content}
                    </SyntaxHighlighter>
                </Box>
                <p>{prop.description}</p>
            </Box>
        </div>
    );
}

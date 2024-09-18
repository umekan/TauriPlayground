import { Box, Button, FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { Styles } from '../HighlightPatterns';
import { useState, useEffect } from 'react';
import { InputLabel } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';


interface DiaryThumbnailProps {
    name: string;
    highlight_label: string;
    language: string;
    content: string;
    description: string;
    onDelete: () => void;
}

export default function DiaryThumbnail(prop: DiaryThumbnailProps) {
    const [styleIndex, setStyleIndex] = useState(0);

    const [open, setOpen] = useState(false);
    const [countdown, setCountdown] = useState(0.0);
    const handleTooltipOpen = () => {
        setOpen(true);
        setCountdown(1); // カウントを1に設定
    };
    const handleTooltipClose = () => {
        setOpen(false);
    };

    const handleStyleChange = (event: SelectChangeEvent) => {
        const value = event.target.value;
        const index = Styles.findIndex(style => style.name === value);
        setStyleIndex(index);
    };

    const copyCode = async () => {
        navigator.clipboard.writeText(prop.content);
        handleTooltipOpen();
    };

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 0.1);
            }, 100); // 0.01秒ごとにカウントダウン

            return () => clearTimeout(timer); // クリーンアップ
        } else if (countdown <= 0 && open) {
            handleTooltipClose();
        }
    }, [countdown, open]);

    const deleteDiary = () => {
        prop.onDelete();
    }

    return (
        <div>
            <Box sx={{ width: 600, height: 500, backgroundColor: '#eeeeee', boxShadow: 10, borderRadius: 5, color: 'primary.main' }}>
                <Box sx={{ marginRight: 1, marginLeft: 1, paddingTop: 1, height: 70, fontWeight: 'bold' }}>
                    <span style={{ fontSize: 22 }}>
                        {prop.name}  ({prop.language})
                    </span>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FormControl fullWidth>
                            <InputLabel variant="standard" htmlFor="uncontrolled-native"></InputLabel>
                            <Select
                                onChange={handleStyleChange}
                                autoWidth
                                sx={{ backgroundColor: '#bbbbbb', height: 30 }}
                                value={Styles[styleIndex].name}
                            >
                                {Styles.map((style, index) => (
                                    <MenuItem key={index} value={style.name}>{style.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button variant="contained" color="success" size="small" sx={{ marginLeft: 'auto', margin: 1 }}>Edit</Button>
                        <div>
                            <Tooltip
                                PopperProps={{
                                    disablePortal: true,
                                }}
                                open={open}
                                disableFocusListener
                                disableHoverListener
                                disableTouchListener
                                title="Copied!"
                                placement='top'
                            >
                                <Button onClick={copyCode} variant="contained" color="primary" size="small" sx={{ margin: 1 }}>Copy</Button>
                            </Tooltip>
                        </div>
                        <Button onClick={deleteDiary} variant="contained" color="error" size="small" sx={{ margin: 1 }}>Delete</Button>
                    </Box>
                </Box>
                <Box sx={{ marginRight: 1, marginLeft: 1, height: 290, fontSize: 14, lineHeight: 1.1, overflow: 'auto' }}>
                    <SyntaxHighlighter language={prop.highlight_label} style={Styles[styleIndex].style}>
                        {prop.content}
                    </SyntaxHighlighter>
                </Box>
                <Box sx={{
                    height: 130, fontSize: 14, lineHeight: 1.1, overflow: 'auto', color: '#000000',
                    backgroundColor: 'primary', wordWrap: 'break-word', whiteSpace: 'pre-wrap', borderRadius: 5, padding: 1.5, boxShadow: 10
                }}>
                    {prop.description}
                </Box>
            </Box>
        </div>
    );
}

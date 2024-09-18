import { useState } from "react";
import MDEditor from '@uiw/react-md-editor';
import { Box, Button, SelectChangeEvent } from "@mui/material";
import { tauri } from '@tauri-apps/api';
import { Language, Tag } from './DiaryRoot';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Styles } from '../HighlightPatterns';
import SyntaxHighlighter from "react-syntax-highlighter";

interface Prop {
    languages: Language[];
    tags: Tag[];
}

export default function App(prop: Prop) {
    const [content, setContent] = useState("");
    const [description, setDescription] = useState("");
    const [styleIndex, setStyleIndex] = useState(0);
    const [languageIndex, setLanguageIndex] = useState(0);

    const insert_diary = async () => {
        const dateTime = new Date().toISOString();
        const randomId = Math.floor(Math.random() * 1000000);
        await tauri.invoke('insert_diary', {
            id: randomId,
            name: dateTime,
            content: content,
            description: description,
            languageId: prop.languages[languageIndex].language_id
        });
    }

    const handleLanguageChange = (event: SelectChangeEvent) => {
        const value = event.target.value;
        const index = prop.languages.findIndex(language => language.name === value);
        setLanguageIndex(index);
    }

    const handleStyleChange = (event: SelectChangeEvent) => {
        const value = event.target.value;
        const index = Styles.findIndex(style => style.name === value);
        setStyleIndex(index);
    }

    const updateContent = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(event.target.value);
    }

    return (
        <div>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <FormControl sx={{width:300}}>
                <InputLabel variant="standard" htmlFor="uncontrolled-native"></InputLabel>
                <Select
                    onChange={handleLanguageChange}
                    autoWidth
                    sx={{ backgroundColor: '#bbbbbb', height: 30 }}
                    value={prop.languages[languageIndex].name}
                >
                    {prop.languages.map((language, index) => (
                        <MenuItem key={index} value={language.name}>{language.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl sx={{width:300}}>
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
            </Box>
            <h2>本文</h2>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', margin:'auto 0', height:300 }}>
                <textarea style={{ width:'50%', backgroundColor: "black", color: "white", marginRight:10 }} onChange={updateContent}></textarea>
                <SyntaxHighlighter language={prop.languages[languageIndex].highlight_label} style={Styles[styleIndex].style}>
                    {content}
                </SyntaxHighlighter>
            </Box>
            <h2>コメント</h2>
            <Box margin={'auto 0'} height={300}>
                <MDEditor
                    value={description}
                    height="100%"
                    previewOptions={{
                        disallowedElements: ['style'],
                    }}
                    visibleDragbar={false}
                    onChange={(value) => setDescription(value || '')}
                />
            </Box>
            <Box height={30}></Box>
            <Button component="label" variant="contained" fullWidth onClick={() => {
                insert_diary();
            }}>保存</Button>
        </div>
    );
}
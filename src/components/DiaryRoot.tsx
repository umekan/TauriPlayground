import { useState } from 'react';
import Diaries from './Diaries';
import DiaryEdit from './DiaryEdit';
import { ToggleButtonGroup, ToggleButton, Button } from '@mui/material';
import { useEffect } from 'react';
import { tauri } from '@tauri-apps/api';
import Papa from 'papaparse';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

enum DisplayMode {
    List,
    Edit
}

export type Diary = {
    id: number;
    name: string;
    content: string;
    description: string;
    language_id: number;
}

export type Language = {
    language_id: number;
    highlight_label: string;
    name: string;
}

export type Tag = {
    id: number;
    name: string;
}

export type DiaryTag = {
    diary_id: number;
    tag_id: number;
}

export default function DiaryRoot() {
    const [mode, setMode] = useState(DisplayMode.List);

    const [diaries, setDiaries] = useState<Array<Diary>>([]);
    const [languages, setLanguages] = useState<Array<Language>>([]);
    const [tags, setTags] = useState<Array<Tag>>([]);
    const [tagMap, setTagMap] = useState<Array<DiaryTag>>([]);
    const [deleteDiaryIndex, setDeleteDiaryIndex] = useState<number | null>(null)

    const selectAllData = async () => {
        await loadLanguages();
        const diaries = await tauri.invoke<Array<Diary>>('get_all_diaries');
        const tags = await tauri.invoke<Array<Tag>>('get_tag_list');
        const tagMap = await tauri.invoke<Array<DiaryTag>>('get_all_diary_tag_relations');
        setDiaries(diaries);
        setTags(tags);
        setTagMap(tagMap);
    }

    const loadLanguages = async () => {
        const response = await fetch('/language.csv');
        const reader = response.body?.getReader();
        const result = await reader?.read();
        const decoder = new TextDecoder('utf-8');
        const csv = decoder.decode(result?.value);
        const parsedData = Papa.parse(csv, { header: true });
        setLanguages(parsedData.data as Array<Language>);
    }

    const handleDeleteDiary = (index: number) => {
        setDeleteDiaryIndex(index);
        handleClickOpen();
    }

    const confirmDeleteDiary = async () => {
        if (deleteDiaryIndex !== null) {
            //await tauri.invoke('delete_diary', { index: deleteIndex });
            setDiaries(diaries.filter((_, i) => i !== deleteDiaryIndex));
            setDeleteDiaryIndex(null);
            handleClose();
        }
    }

    useEffect(() => {
        selectAllData();
    }, []);

    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginRight: 30 }}>
                <ToggleButtonGroup
                    value={mode}
                    exclusive
                    onChange={(_, newMode) => setMode(newMode)}
                    aria-label="text alignment"
                    sx={{ backgroundColor: '#eeeeee' }}
                >
                    <ToggleButton value={DisplayMode.List} aria-label="left aligned">
                        List
                    </ToggleButton>
                    <ToggleButton value={DisplayMode.Edit} aria-label="right aligned">
                        Edit
                    </ToggleButton>
                </ToggleButtonGroup>
            </div>
            {mode === DisplayMode.List && <Diaries
                diaries={diaries} languages={languages} tags={tags} tagMap={tagMap}
                onDeleteDiary={handleDeleteDiary} />}
            {mode === DisplayMode.Edit && <DiaryEdit languages={languages} tags={tags} />}
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"本当に削除しますか？"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        削除すると元に戻せません。
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} autoFocus color="primary">考え直す</Button>
                    <Button onClick={confirmDeleteDiary} color="error">削除</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

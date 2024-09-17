import { useEffect, useState } from "react";
import DiaryThumbnail from "./DiaryThumbnail";
import { tauri } from '@tauri-apps/api';
import Papa from 'papaparse';

type Diary = {
    id: number;
    name: string;
    content: string;
    description: string;
    language_id: number;
}

type Language = {
    language_id: number;
    highlight_label: string;
    name: string;
}

export default function Diaries() {
    const [diaries, setDiaries] = useState<Array<Diary>>([]);
    const [languages, setLanguages] = useState<Array<Language>>([]);
    const getAllDiaries = async () => {
        await loadLanguages();
        const diaries = await tauri.invoke<Array<Diary>>('get_all_diaries');
        setDiaries(diaries);
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

    useEffect(() => {
        getAllDiaries();
    }, []);

    return (
        <>
            <style>{gridStyle}</style>
            <div className="diaries-grid">
                {diaries.map(diary => {
                    const language = languages.length > diary.language_id ? languages[diary.language_id] : undefined;
                    const highlighterLabel = language ? language.highlight_label : 'plaintext';
                    const name = language ? language.name : 'Unknown';
                    return (
                        <DiaryThumbnail
                            key={diary.id} // keyを追加
                            name={diary.name}
                            highlight_label={highlighterLabel}
                            language={name}
                            content={diary.content}
                            description={diary.description}
                        />
                    );
                })}
            </div>
        </>
    );
}

// CSSを外に定義
const gridStyle = `
    .diaries-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
        gap: 8px;
        padding: 16px;
    }
`;
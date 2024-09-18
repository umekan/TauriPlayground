import DiaryThumbnail from "./DiaryThumbnail";
import { Diary, Language, Tag, DiaryTag } from "./DiaryRoot";

interface Prop {
    diaries: Diary[];
    languages: Language[];
    tags: Tag[];
    tagMap: DiaryTag[];
    onDeleteDiary: (index: number) => void;
}

export default function Diaries(prop: Prop) {
    return (
        <>
            {prop.diaries.length === 0 && <div>日記がありません。</div>}
            {prop.diaries.length > 0 && <div>日記が{prop.diaries.length}件あります。</div>}
            <div style={{ overflow: 'auto', height: 'calc(100vh - 200px)' }}>
                <style>{gridStyle}</style>
                <div className="diaries-grid">
                    {prop.diaries.map((diary, index) => {
                        const language = prop.languages.length > diary.language_id ? prop.languages[diary.language_id] : undefined;
                        const highlighterLabel = language ? language.highlight_label : 'plaintext';
                        const name = language ? language.name : 'Unknown';
                        return (
                            <DiaryThumbnail
                                key={index}
                                name={diary.name}
                                highlight_label={highlighterLabel}
                                language={name}
                                content={diary.content}
                                description={diary.description}
                                onDelete={() => prop.onDeleteDiary(index)}
                            />
                        );
                    })}
                </div>
            </div>
        </>
    );
}

// CSSを外に定義
const gridStyle = `
    .diaries-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(600px, 0fr));
        gap: 8px;
        padding: 16px;
    }`;
use std::collections::HashSet;
use std::fs::File;
use std::io::Read;
use encoding_rs::UTF_8;
use encoding_rs_io::DecodeReaderBytesBuilder;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
pub fn file_concat(full_paths: Vec<String>) -> String {
    let mut result = String::new();
    for path in full_paths {
        let content = std::fs::read_to_string(path).unwrap();
        result.push_str(&content);
    }
    result
}

#[tauri::command]
pub fn extract_characters(full_paths: Vec<String>) -> String {
    let mut result = String::new();
    let mut unique_chars = HashSet::new();

    for path in full_paths {
        let content = read_file_with_encoding(&path).unwrap();
        for ch in content.chars() {
            unique_chars.insert(ch);
        }
    }

    let mut unique_chars_vec: Vec<char> = unique_chars.into_iter().collect();
    unique_chars_vec.sort_unstable();

    for ch in unique_chars_vec {
        result.push(ch);
    }

    result
}

// 文字コードを考慮して、UTFに変換してファイルを読み込む
fn read_file_with_encoding(path: &str) -> Result<String, std::io::Error> {
    let file = File::open(path)?;
    let mut decoder = DecodeReaderBytesBuilder::new()
        .encoding(Some(UTF_8))
        .build(file);
    let mut content = String::new();
    decoder.read_to_string(&mut content)?;
    Ok(content)
}
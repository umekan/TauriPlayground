use std::collections::HashSet;

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
        let content = std::fs::read_to_string(path).unwrap();
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
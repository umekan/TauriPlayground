// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
pub fn file_concat(full_pathes: Vec<String>) -> String {
    let mut result = String::new();
    for path in full_pathes {
        let content = std::fs::read_to_string(path).unwrap();
        result.push_str(&content);
    }
    result
}
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::path::PathBuf;
use rusqlite::{ Connection, Result, params };
use lazy_static::lazy_static;
use parking_lot::RwLock;
use std::sync::Arc;

const LOCAL_DB_FILE_NAME:&str = "local.db";

lazy_static! {
    pub static ref LOCAL_DB_FILE_PATH: Arc<RwLock<String>> = Arc::new(RwLock::new(String::new()));
}

pub fn set_local_db_file_path(directory: PathBuf) {

    let path = directory.join(LOCAL_DB_FILE_NAME).to_str().unwrap().to_string();
    let mut db_file_path = LOCAL_DB_FILE_PATH.write();
    *db_file_path = path;
}

// データベースとテーブルを作成する関数
pub fn create_db_and_table_if_needed() -> Result<()> {
    let connection = Connection::open(LOCAL_DB_FILE_PATH.read().clone())?;

    // Diaryテーブル
    let columns = [
        ("id", "INTEGER PRIMARY KEY AUTOINCREMENT"),
        ("name", "TEXT"),
        ("content", "TEXT"),
        ("language_id", "INTEGER"),
    ];
    create_table(&connection, "Diary", &columns)?;

    // Diary-Tagテーブル
    let columns = [
        ("diary_id", "INTEGER"),
        ("tag_id", "INTEGER"),
    ];
    create_table(&connection, "DiaryTagRelation", &columns)?;

    // Tagテーブル
    let columns = [
        ("id", "INTEGER PRIMARY KEY AUTOINCREMENT"),
        ("name", "TEXT"),
    ];
    create_table(&connection, "Tag", &columns)?;
    Ok(())
}

fn create_table(connection: &Connection, table_name: &str, columns: &[(&str, &str)]) -> Result<()> {
    let mut query = format!("CREATE TABLE IF NOT EXISTS {} (", table_name);
    for (i, (col_name, col_type)) in columns.iter().enumerate() {
        if i > 0 {
            query.push_str(", ");
        }
        query.push_str(&format!("{} {}", col_name, col_type));
    }
    query.push_str(");");

    connection.execute(&query, [])?;
    Ok(())
}

#[tauri::command]
pub fn insert_diary(name: &str, content: &str, language_id: i64) {
    let connection = Connection::open(LOCAL_DB_FILE_PATH.read().clone()).unwrap();
    connection.execute(
        "INSERT INTO Diary (name, content, language_id) VALUES (?1, ?2, ?3)",
        params![name, content, language_id],
    ).unwrap();
}

pub fn insert_tag(name: &str) {
    let connection = Connection::open(LOCAL_DB_FILE_PATH.read().clone()).unwrap();
    connection.execute(
        "INSERT INTO Tag (name) VALUES (?1)",
        params![name],
    ).unwrap();
}
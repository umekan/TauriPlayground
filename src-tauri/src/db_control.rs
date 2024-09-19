#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::path::PathBuf;
use rusqlite::{ Connection, Result, params };
use lazy_static::lazy_static;
use parking_lot::RwLock;
use std::sync::Arc;

#[derive(serde::Serialize)]
#[serde(tag = "type")]
pub struct Diary{
    id: i64,
    name: String,
    content: String,
    description: String,
    language_id: i64,
}

#[derive(serde::Serialize)]
#[serde(tag = "type")]
pub struct Tag{
    id: i64,
    name: String,
}

#[derive(serde::Serialize)]
#[serde(tag = "type")]
pub struct ProgramingLanguage{
    id: i64,
    name: String,
}

#[derive(serde::Serialize)]
#[serde(tag = "type")]
pub struct TagRelation{
    diary_id: i64,
    tag_id: i64,
}

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
        ("id", "INTEGER PRIMARY KEY"),
        ("name", "TEXT"),
        ("content", "TEXT"),
        ("description", "TEXT"),
        ("language_id", "INTEGER"),
    ];
    create_fts_table(&connection, "Diary", &columns)?;

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

fn create_fts_table(connection: &Connection, table_name: &str, columns: &[(&str, &str)]) -> Result<()> {
    let mut query = format!("CREATE VIRTUAL TABLE IF NOT EXISTS {} USING fts5(", table_name);
    for (i, (col_name, _)) in columns.iter().enumerate() {
        if i > 0 {
            query.push_str(", ");
        }
        query.push_str(col_name);
    }
    query.push_str(");");

    connection.execute(&query, [])?;
    Ok(())
}

/// 新しい日記を追加する
#[tauri::command]
pub fn insert_diary(id: i64, name: &str, content: &str, description: &str, language_id: i64) {
    let connection = Connection::open(LOCAL_DB_FILE_PATH.read().clone()).unwrap();
    connection.execute(
        "INSERT INTO Diary (id, name, content, description, language_id) VALUES (?1, ?2, ?3, ?4, ?5)",
        params![id, name, content, description, language_id],
    ).unwrap();
}

/// 全ての日記を取得する
#[tauri::command]
pub fn get_all_diaries() -> Vec<Diary> {
    let connection = Connection::open(LOCAL_DB_FILE_PATH.read().clone()).unwrap();
    let mut statement = connection.prepare("SELECT id, name, content, description, language_id FROM Diary").unwrap();
    let diary_iter = statement.query_map([], |row| {
        Ok(Diary {
            id: row.get(0)?,
            name: row.get(1)?,
            content: row.get(2)?,
            description: row.get(3)?,
            language_id: row.get(4)?,
        })
    }).unwrap();
    diary_iter.map(|diary| diary.unwrap()).collect()
}

/// 日記IDに紐づく日記を更新する
#[tauri::command]
pub fn update_diary(id: i64, name: &str, content: &str, description: &str, language_id: i64) {
    let connection = Connection::open(LOCAL_DB_FILE_PATH.read().clone()).unwrap();
    connection.execute(
        "UPDATE Diary SET name = ?1, content = ?2, description = ?3 language_id = ?4 WHERE id = ?5",
        params![name, content, description, language_id, id],
    ).unwrap();
}

/// タグを追加する
#[tauri::command]
pub fn insert_tag(name: &str) {
    let connection = Connection::open(LOCAL_DB_FILE_PATH.read().clone()).unwrap();
    connection.execute(
        "INSERT INTO Tag (name) VALUES (?1)",
        params![name],
    ).unwrap();
}

/// タグ一覧を取得する
#[tauri::command]
pub fn get_tag_list() -> Vec<Tag> {
    let connection = Connection::open(LOCAL_DB_FILE_PATH.read().clone()).unwrap();
    let mut statement = connection.prepare("SELECT id, name FROM Tag").unwrap();
    let tag_iter = statement.query_map([], |row| {
        Ok(Tag {
            id: row.get(0)?,
            name: row.get(1)?,
        })
    }).unwrap();
    tag_iter.map(|tag| tag.unwrap()).collect()
}

/// 日記IDに紐づくタグを設定する
#[tauri::command]
pub fn insert_diary_tag_relation(diary_id: i64, tag_id: i64) {
    let connection = Connection::open(LOCAL_DB_FILE_PATH.read().clone()).unwrap();
    connection.execute(
        "INSERT INTO DiaryTagRelation (diary_id, tag_id) VALUES (?1, ?2)",
        params![diary_id, tag_id],
    ).unwrap();
}

/// 全ての日記とタグの関連を取得する
#[tauri::command]
pub fn get_all_diary_tag_relations() -> Vec<TagRelation> {
    let connection = Connection::open(LOCAL_DB_FILE_PATH.read().clone()).unwrap();
    let mut statement = connection.prepare("SELECT diary_id, tag_id FROM DiaryTagRelation").unwrap();
    let tag_relation_iter = statement.query_map([], |row| {
        Ok(TagRelation {
            diary_id: row.get(0)?,
            tag_id: row.get(1)?,
        })
    }).unwrap();
    tag_relation_iter.map(|tag_relation| tag_relation.unwrap()).collect()
}

/// タグIDから紐づく日記を取得する
#[tauri::command]
pub fn get_diaries_by_tag_id(tag_id: i64) -> Vec<Diary> {
    let connection = Connection::open(LOCAL_DB_FILE_PATH.read().clone()).unwrap();
    let mut statement = connection.prepare("SELECT d.id, d.name, d.content, d.language_id FROM Diary d JOIN DiaryTagRelation r ON d.id = r.diary_id WHERE r.tag_id = ?1").unwrap();
    let diary_iter = statement.query_map(params![tag_id], |row| {
        Ok(Diary {
            id: row.get(0)?,
            name: row.get(1)?,
            content: row.get(2)?,
            description: row.get(3)?,
            language_id: row.get(4)?,
        })
    }).unwrap();
    diary_iter.map(|diary| diary.unwrap()).collect()
}

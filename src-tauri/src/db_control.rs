#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::path::PathBuf;
use rusqlite::{ Connection, Result };

const LOCAL_DB_FILE_NAME:&str = "local.db";

static mut local_db_file_path: String = String::new();

pub fn set_local_db_file_path(directory: PathBuf) {
    unsafe {
        local_db_file_path = directory.join(LOCAL_DB_FILE_NAME).to_str().unwrap().to_string();
    }
}

// データベースとテーブルを作成する関数
pub fn create_db_and_table_if_needed() -> Result<()> {
    let connection = Connection::open("local.db")?;

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


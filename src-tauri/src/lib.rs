use std::fs::File;
use std::io::BufReader;
use std::path::{Path, PathBuf};
use flate2::read::GzDecoder;
use tar::Archive;

#[tauri::command]
fn extract_unitypackage(
    file_path: String,
    output_dir: Option<String>,
) -> Result<String, String> {
    let path = Path::new(&file_path);
    let file = File::open(path).map_err(|e| e.to_string())?;
    let buf = BufReader::new(file);

    let gz = GzDecoder::new(buf);
    let mut archive = Archive::new(gz);

    let out_dir = if let Some(dir) = output_dir {
        PathBuf::from(dir)
    } else {
        let parent = path.parent().unwrap_or_else(|| Path::new("."));
        let stem = path
            .file_stem()
            .ok_or("無効なファイル名")?
            .to_string_lossy();
        parent.join(stem.as_ref())
    };

    if let Err(e) = archive.unpack(&out_dir) {
        return Err(format!("展開エラー: {}", e));
    }
    
    Ok(out_dir.to_string_lossy().to_string())
}

pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![extract_unitypackage])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
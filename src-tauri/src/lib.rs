use std::fs::File;
use std::io::BufReader;
use std::path::Path;
use flate2::read::GzDecoder;
use tar::Archive;

#[tauri::command]
fn extract_unitypackage(
    file_path: String,
    output_dir: String,
) -> Result<(), String> {
    let path = Path::new(&file_path);
    let file = File::open(path).map_err(|e| e.to_string())?;
    let buf = BufReader::new(file);

    let gz = GzDecoder::new(buf);
    let mut archive = Archive::new(gz);

    archive
        .unpack(output_dir)
        .map_err(|e| e.to_string())?;
    
    Ok(())
}

pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![extract_unitypackage])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {
  const [filePath, setFilePath] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    console.log("drop");
    event.preventDefault();
    const files = event.dataTransfer.files
    if (files.length > 0) {
      const file = files[0] as any;
      const path = file.path || file.name;
      console.log("dropped file path:", path);
      setFilePath(path);
    }
  };

  const handleClick = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("click");
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0] as any;
      const path = file.path || file.name;
      console.log("selected file path:", path);
      setFilePath(path);
    }
  };

  const extract = async () => {
    if (!filePath) return;
    setStatus("展開中...");
    try {
      const folder = await invoke<string>("extract_unitypackage", {
        filePath,
      })
      setStatus("完了！ フォルダ: " + folder);
    } catch (error) {
      console.error("Error extracting unitypackage:", error);
      setStatus("エラーが発生しました: " + (error as any)?.message || (error as any)?.toString() || "不明なエラー");
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="h-screen flex flex-col items-center justify-center border-2 border-dashed border-gray-400 cursor-pointer p-4"
    > 
      <input
        type="file"
        accept=".unitypackage"
        onChange={handleClick}
        className="mb-4"
      />
      
      <p className="mb-4">
        {filePath 
          ? `選択ファイル: ${filePath}`  
          : "ここに .unitypackage をドラッグ&ドロップ またはクリックして選択"
        }
      </p>

      {filePath && (
        <button
          onClick={extract}
          disabled={status === "展開中..."}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          展開
        </button>
      )}
      <p className="mt-4">{status}</p>
    </div>
  );
}

export default App;

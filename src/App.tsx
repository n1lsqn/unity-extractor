import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import "./App.css";

function App() {
  const [filePath, setFilePath] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files
    if (file.length > 0) {
      setFilePath((file[0] as any).path);
    }
  };

  const extract = async () => {
    if (!filePath) return;

    const dir = await open({ directory: true});
    if (!dir) return;

    setStatus("展開中...");
    try {
      await invoke("extract_unitypackage", {
        filePath,
        outputDir: dir,
      })
      setStatus("完了！");
    } catch (error) {
      setStatus("エラー: " + (error as Error).message);
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="h-screen flex flex-col items-center justify-center border-2 border-dashed border-gray-400"
    >
      <p className="mb-4">
        {filePath ? `選択ファイル: ${filePath}` : "ここに .unitypackage をドラッグ&ドロップ"}
      </p>
      {filePath && (
        <button
          onClick={extract}
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

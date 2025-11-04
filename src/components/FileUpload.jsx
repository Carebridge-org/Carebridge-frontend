import { useRef } from "react";

export default function FileUpload ({ files, setFiles }) {
    const fileInputRef = useRef(null);

    function handleFilesChange(e) {
        const selectedFiles = Array.from(e.target.files);
        setFiles([...files, ...selectedFiles]);
    }

    function removeFile(index) {
        const newFiles = files.filter((_, i) => i !== index);
        setFiles(newFiles);
    }

    function handleDrop(e) {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files);
        setFiles([... files, ...droppedFiles]);
    }

    function handleDragOver(e) {
        e.preventDefault();
    }

    return (
    <div>
      <label className="block font-medium mb-1">Vedhæft filer</label>
      <div
        className="border-dashed border-2 border-gray-400 rounded p-4 text-center cursor-pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current.click()}
      >
        Træk filer her eller klik for at vælge
      </div>

      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={handleFilesChange}
        className="hidden"
      />

      {/* Preview */}
      {files.length > 0 && (
        <ul className="mt-2 space-y-1">
          {files.map((file, index) => (
            <li key={index} className="flex justify-between items-center border p-1 rounded">
              <span>{file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-red-600 hover:text-red-800"
              >
                Fjern
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
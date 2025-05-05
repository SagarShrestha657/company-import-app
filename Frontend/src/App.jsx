import React, { useState } from "react";
import './App.css'
import { axiosInstance } from "./lib/axios";
import { toast, ToastContainer } from "react-toastify";
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

function App() {
  const [file, setFile] = useState(null);
  const [mode, setMode] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return toast.error("Please select a file");
    if (!mode) return toast.error("Please select a mode");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("mode", mode);

    try {
      NProgress.start();
      setLoading(true);
      const response = await axiosInstance.post("/api/import", formData);
      setResult(response.data);
    } catch (err) {
      toast.error("Upload failed");
      console.error(err);
    }
    setLoading(false);
    NProgress.done();
  };

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-8 space-y-6">
          <h1 className="text-3xl font-bold text-center text-gray-800">📦 Company Import Tool</h1>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Upload File (.csv, .xlsx)</label>
            <input
              type="file"
              accept=".csv,.xlsx"
              onChange={(e) => setFile(e.target.files[0])}
              className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 file:bg-blue-600 file:text-white file:font-medium file:border-none file:rounded-md file:px-4 file:py-2 hover:file:bg-blue-700"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Import Mode</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
            >
              <option value=""> Select Import Mode </option>
              <option value="1">1  Create New Only</option>
              <option value="2">2  Create + Update Empty Fields</option>
              <option value="3">3  Create + Overwrite All Fields</option>
              <option value="4">4  Update Existing (No Overwrite)</option>
              <option value="5">5  Update Existing (Overwrite All)</option>
            </select>
          </div>

          <button
            onClick={handleUpload}
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload & Import"}
          </button>

          {result && (
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-green-800">
              <h2 className="font-semibold mb-2">✅ Import Result</h2>
              <ul className="space-y-1 text-sm">
                <li>📥 Inserted: <strong>{result.inserted}</strong></li>
                <li>♻️ Updated: <strong>{result.updated}</strong></li>
                <li>⏭️ Skipped: <strong>{result.skipped}</strong></li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
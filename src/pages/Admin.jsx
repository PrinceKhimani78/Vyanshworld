import React, { useState, useRef } from 'react';
import { UploadCloud, ShieldCheck, FileImage, Lock, User, FolderHeart, ListPlus } from 'lucide-react';
import imageCompression from 'browser-image-compression';

function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  const [isCompressing, setIsCompressing] = useState(false);
  const [category, setCategory] = useState('Random (Too cute to categorize)');
  const [logs, setLogs] = useState([]);
  const [compressedImage, setCompressedImage] = useState(null); 

  const fileInputRef = useRef(null);

  // Using the new dedicated subdomain for Vyansh!
  const API_URL = 'https://vyansh-api.mutanttechnologies.com/vyanshworldapi.php'; 

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'vyansh2026') {
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const addLog = (msg) => {
    setLogs(prev => [...prev, String(msg)]);
  };

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setIsCompressing(true);
    setLogs([]);
    addLog(`Filing under: ${category}`);
    addLog(`Starting batch upload of ${files.length} memory(s)...`);
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        addLog(`[${i+1}/${files.length}] Processing: ${file.name}...`);
        
        try {
            const options = {
                maxSizeMB: 0.5,
                maxWidthOrHeight: 1920,
                useWebWorker: false, 
            };

            const compressedFile = await imageCompression(file, options);
            const compressedSizeMB = (compressedFile.size / 1024 / 1024).toFixed(2);
            setCompressedImage(URL.createObjectURL(compressedFile)); 

            const formData = new FormData();
            formData.append('image', compressedFile, file.name);
            formData.append('category', category);

            addLog(`[${i+1}/${files.length}] Uploading (${compressedSizeMB} MB)...`);
            const response = await fetch(API_URL, {
                method: 'POST',
                body: formData
            });
            
            const textResponse = await response.text();
            
            try {
                const result = JSON.parse(textResponse);
                if (result.success) {
                    addLog(`✅ [${i+1}/${files.length}] ${result.message}`);
                } else {
                    addLog(`❌ [${i+1}/${files.length}] Server error: ${result.error}`);
                }
            } catch (jsonError) {
                addLog(`❌ [${i+1}/${files.length}] Server returned non-JSON!`);
                console.error("Server Response:", textResponse);
            }

        } catch (error) {
            console.error('Error compressing/uploading image:', error);
            addLog(`❌ [${i+1}/${files.length}] Failed: ${error?.message || 'Unknown error'}`);
        }
    }
    
    addLog(`🎉 All done! Processed ${files.length} file(s).`);
    setIsCompressing(false);
    
    if (fileInputRef.current) {
        fileInputRef.current.value = ''; 
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
          <div className="bg-slate-900 text-white p-6 text-center">
            <Lock size={40} className="mx-auto mb-3 text-emerald-400" />
            <h1 className="text-2xl font-bold">Top Secret Vault</h1>
            <p className="text-slate-400 text-sm mt-1">(If you don't know the password, you probably didn't change enough diapers).</p>
          </div>
          
          <form onSubmit={handleLogin} className="p-8 space-y-6">
            {loginError && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center font-bold">
                Nice try! Wrong username or password.
              </div>
            )}
            <div>
              <label className="block text-slate-700 font-bold mb-2 text-sm">Username</label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="Enter username" required />
              </div>
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-2 text-sm">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="Enter password" required />
              </div>
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition-colors">
              Unlock Vault
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8 font-sans">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck size={28} className="text-emerald-400" />
            <div>
              <h1 className="text-2xl font-bold">Vyansh's Control Room</h1>
              <p className="text-slate-400 text-sm">Parental Clearance Required</p>
            </div>
          </div>
          <button onClick={() => setIsAuthenticated(false)} className="text-sm bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg font-bold transition-colors">
            Lock Vault
          </button>
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Upload More Paparazzi Shots 📸</h2>
          
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-10 hover:bg-slate-50 transition-colors">
            
            <div className="max-w-md mx-auto mb-8 text-left bg-white p-4 rounded-xl shadow-sm border border-slate-100">
              <label className="flex items-center gap-2 text-slate-700 font-bold mb-3 text-sm">
                <FolderHeart size={18} className="text-pink-500" />
                Which era of cuteness is this from?
              </label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-pink-400 font-medium">
                <option value="Random (Too cute to categorize)">Random (Too cute to categorize)</option>
                <option value="1st Month">1st Month</option>
                <option value="2nd Month">2nd Month</option>
                <option value="3rd Month">3rd Month</option>
                <option value="4th Month">4th Month</option>
                <option value="5th Month">5th Month</option>
                <option value="6th Month">6th Month</option>
                <option value="7th Month">7th Month</option>
                <option value="8th Month">8th Month</option>
                <option value="9th Month">9th Month</option>
                <option value="10th Month">10th Month</option>
                <option value="11th Month">11th Month</option>
                <option value="12th Month">12th Month</option>
              </select>
            </div>

            <div className="text-center">
              <UploadCloud size={48} className="text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 mb-6 font-medium">
                Select one or MULTIPLE photos to add to the gallery. <br/> 
                <span className="text-sm text-slate-400 font-normal">(Don't worry, my robot assistant will automatically shrink the file size so you don't blow up the server).</span>
              </p>
              
              <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold shadow-md transition-colors inline-flex items-center gap-3">
                <ListPlus size={22} />
                {isCompressing ? 'Processing Batch...' : 'Select Masterpieces (Batch)'}
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple
                  ref={fileInputRef}
                  className="hidden" 
                  onChange={handleFileUpload} 
                  disabled={isCompressing} 
                />
              </label>
            </div>
          </div>

          {logs.length > 0 && (
            <div className="mt-8 bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <h3 className="font-bold text-slate-700 mb-3">Robot Assistant Log</h3>
                <ul className="text-sm font-mono text-slate-600 space-y-2 h-64 overflow-y-auto p-4 bg-white rounded border border-slate-200">
                  {logs.map((log, i) => {
                    const strLog = String(log);
                    const isSuccess = strLog.includes('✅') || strLog.includes('Success') || strLog.includes('🎉');
                    const isError = strLog.includes('❌');
                    return (
                      <li key={i} className={isSuccess ? 'text-emerald-600 font-bold' : isError ? 'text-red-600 font-bold' : ''}>
                        &gt; {strLog}
                      </li>
                    );
                  })}
                </ul>
              </div>

              {compressedImage && (
                <div className="w-48 shrink-0">
                  <h3 className="font-bold text-slate-700 mb-3 text-center">Latest Preview</h3>
                  <img src={compressedImage} alt="Compressed Preview" className="w-full rounded-lg shadow-md border-4 border-white" />
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Admin;

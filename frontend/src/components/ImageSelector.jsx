import React, { useRef, useState } from 'react';
import { UploadCloud, X, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import api from '../services/api';

const ImageSelector = ({
  label = "IMAGE",
  value = "",
  onChange,
  required = false,
  helperText = "Supporting image formats: jpg, jpeg, png, webp",
}) => {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState('file'); // 'file' | 'url'
  const [fileName, setFileName] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    const ext = file.name.split('.').pop()?.toLowerCase();
    const validExts = ['jpg', 'jpeg', 'png', 'webp'];
    const validMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (!validExts.includes(ext) || (!validMimes.includes(file.type) && file.type)) {
      setError('Invalid format! Only JPG, JPEG, PNG, and WEBP image files are allowed.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit!');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setUploading(true);
    setFileName(file.name);

    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.imageUrl) {
        onChange(res.data.imageUrl);
      } else {
        // Fallback to Base64 data URL
        const reader = new FileReader();
        reader.onload = () => {
          onChange(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.warn('Backend upload fallback to data URL:', err);
      const reader = new FileReader();
      reader.onload = () => {
        onChange(reader.result);
      };
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleClear = () => {
    onChange('');
    setFileName('');
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-slate-700 font-bold uppercase tracking-wider text-[11px]">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        
        {/* Switch between file manager select and web URL */}
        <div className="flex items-center gap-1.5 text-[11px]">
          <button
            type="button"
            onClick={() => setMode('file')}
            className={`px-2 py-0.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              mode === 'file'
                ? 'bg-slate-300 text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            File Manager
          </button>
          <span className="text-slate-400">·</span>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2 py-0.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              mode === 'url'
                ? 'bg-slate-300 text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Web URL
          </button>
        </div>
      </div>

      {error && (
        <div className="p-2 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-1.5 animate-fadeIn">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Hidden file input supporting JPG, JPEG, PNG, WEBP */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* 1. When an image is selected: Show Image Selection Bar with "X" button at top right */}
      {value ? (
        <div className="relative p-2.5 rounded-2xl bg-white border border-slate-300 shadow-sm flex items-center gap-3 group">
          {/* "x" button at the top right of the image selection bar */}
          <button
            type="button"
            onClick={handleClear}
            title="Remove image"
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-slate-100 hover:bg-red-500 hover:text-white text-slate-600 flex items-center justify-center transition-colors border border-slate-200 cursor-pointer shadow-sm z-10"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          {/* Image Thumbnail */}
          <div className="relative w-16 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
            <img
              src={value}
              alt="Selected Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80';
              }}
            />
          </div>

          {/* Metadata */}
          <div className="flex-1 pr-7 min-w-0">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <p className="text-xs font-bold text-slate-800 truncate">
                {fileName || (value.startsWith('data:') ? 'Selected from File Manager' : value.split('/').pop() || 'Image attached')}
              </p>
            </div>
            <div className="flex items-center gap-2 mt-1">
              {value.includes('cloudinary') ? (
                <span className="text-[10px] uppercase font-bold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded flex items-center gap-1">
                  ☁️ Cloudinary
                </span>
              ) : (
                <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                  JPG · PNG · WEBP
                </span>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[10px] text-blue-600 hover:text-blue-800 font-semibold underline cursor-pointer"
              >
                Change Image
              </button>
            </div>
          </div>
        </div>
      ) : mode === 'file' ? (
        /* 2. File manager selection bar (no image selected yet) */
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 hover:border-gold-500 bg-white hover:bg-gold-50/20 rounded-2xl p-4 text-center cursor-pointer transition-all group"
        >
          {uploading ? (
            <div className="py-2 text-slate-600 flex flex-col items-center">
              <RefreshCw className="w-5 h-5 text-gold-600 animate-spin mb-1.5" />
              <p className="text-xs font-semibold">Processing image file...</p>
            </div>
          ) : (
            <div>
              <div className="w-9 h-9 mx-auto rounded-full bg-slate-100 group-hover:bg-gold-100 flex items-center justify-center text-slate-500 group-hover:text-gold-700 transition-colors mb-1.5">
                <UploadCloud className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-800 group-hover:text-gold-800 transition-colors">
                Select Image from File Manager
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Supporting image formats: <strong className="text-slate-700">jpg, jpeg, png</strong>
              </p>
            </div>
          )}
        </div>
      ) : (
        /* 3. URL input fallback */
        <div>
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="w-full px-3 py-2 text-sm rounded-xl bg-white border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
          <p className="text-[10px] text-slate-500 mt-1">
            Enter an online image link or switch to File Manager above.
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageSelector;

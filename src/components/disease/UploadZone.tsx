import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface UploadZoneProps {
  image: File | null;
  preview: string | null;
  onImageSelect: (file: File | null, preview: string | null) => void;
}

const UploadZone = ({ image, preview, onImageSelect }: UploadZoneProps) => {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    onImageSelect(file, url);
  }, [onImageSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith('image/')) handleFile(f);
  }, [handleFile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const remove = () => {
    onImageSelect(null, null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div
      className="relative rounded-3xl transition-all cursor-pointer"
      style={{
        width: '100%',
        maxWidth: 400,
        height: 300,
        margin: '0 auto',
        border: dragging
          ? '2px dashed #c8a84b'
          : preview
            ? '2px solid rgba(200,168,75,0.6)'
            : '2px dashed rgba(200,168,75,0.4)',
        background: dragging
          ? 'rgba(200,168,75,0.08)'
          : preview
            ? 'transparent'
            : 'rgba(255,255,255,0.04)',
        overflow: 'hidden',
        ...(preview ? { boxShadow: '0 0 30px rgba(200,168,75,0.2)' } : {}),
      }}
      onClick={() => !preview && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleChange} />

      <AnimatePresence mode="wait">
        {preview ? (
          <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative w-full h-full">
            <img src={preview} alt="Leaf preview" className="w-full h-full object-cover" />
            <button
              onClick={(e) => { e.stopPropagation(); remove(); }}
              className="absolute top-3 right-3 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-body"
              style={{ background: 'rgba(0,0,0,0.7)', color: '#ef4444', backdropFilter: 'blur(8px)' }}
            >
              <X className="w-3 h-3" /> Remove
            </button>
            {image && (
              <div className="absolute bottom-3 left-3 right-3 text-xs font-body truncate px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(0,0,0,0.6)', color: 'rgba(232,245,232,0.7)', backdropFilter: 'blur(8px)' }}>
                {image.name}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-full gap-3 px-4 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-2"
              style={{ background: 'rgba(200,168,75,0.1)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M17 8L12 3M12 3L7 8M12 3V15" stroke="#c8a84b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="font-heading text-lg" style={{ color: '#e8f5e8' }}>
              Drag & drop leaf photo here
            </p>
            <p className="font-body text-sm" style={{ color: '#c8a84b' }}>
              or click to browse from your device
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UploadZone;

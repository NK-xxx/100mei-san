import React, { useState, useEffect, useRef } from 'react';
import { Mountain, ClimbRecord } from '../types';

interface StampModalProps {
  mountain: Mountain | null;
  climbRecord: ClimbRecord | null;
  onClose: () => void;
  onStamp: (id: number, record: ClimbRecord) => void;
  onRemoveStamp: (id: number) => void;
}

const StampModal: React.FC<StampModalProps> = ({ mountain, climbRecord, onClose, onStamp, onRemoveStamp }) => {
  const [date, setDate] = useState('');
  const [comment, setComment] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (climbRecord) {
      setDate(climbRecord.climbDate);
      setComment(climbRecord.comment || '');
      setPhoto(climbRecord.photo || null);
    } else {
      // Set defaults for a new record
      setDate(new Date().toISOString().split('T')[0]);
      setComment('');
      setPhoto(null);
    }
  }, [climbRecord]);

  if (!mountain) return null;

  const handleStamp = () => {
    const record: ClimbRecord = { climbDate: date };
    if (comment.trim()) record.comment = comment.trim();
    if (photo) record.photo = photo;
    onStamp(mountain.id, record);
    onClose();
  };
  
  const handleRemove = () => {
    onRemoveStamp(mountain.id);
    onClose();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhoto(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-zinc-800 rounded-xl shadow-2xl w-full max-w-md p-6 md:p-8 animate-slide-up max-h-[90vh] overflow-y-auto border border-zinc-700" onClick={(e) => e.stopPropagation()}>
        <div className="text-center">
            <p className="text-sm text-zinc-400">{mountain.region} - {mountain.prefecture}</p>
            <h2 className="text-3xl font-bold text-emerald-300 mt-1">{mountain.name}</h2>
            <p className="text-lg text-zinc-300 mt-1">{mountain.elevation}m</p>
        </div>
        
        <div className="my-6 space-y-6">
            <div>
              <label htmlFor="climbDate" className="block text-sm font-medium text-zinc-400 mb-2">登頂日 (Climb Date)</label>
              <input
                  type="date"
                  id="climbDate"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-zinc-700 border border-zinc-600 rounded-md p-3 text-zinc-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
              />
            </div>
            
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-zinc-400 mb-2">コメント (Comment)</label>
              <textarea
                  id="comment"
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="登山の思い出..."
                  className="w-full bg-zinc-700 border border-zinc-600 rounded-md p-3 text-zinc-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">写真 (Photo)</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-zinc-600 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  {photo ? (
                    <img src={photo} alt="Climb preview" className="max-h-40 mx-auto rounded-md shadow-lg" />
                  ) : (
                    <>
                      <svg className="mx-auto h-12 w-12 text-zinc-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className="text-xs text-zinc-500">PNG, JPG, GIF</p>
                    </>
                  )}
                  <div className="flex text-sm text-zinc-400 justify-center mt-2">
                    <button type="button" onClick={triggerFileInput} className="font-medium text-emerald-400 hover:text-emerald-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-zinc-800 focus-within:ring-emerald-500 rounded-md">
                      <span>Upload a file</span>
                    </button>
                    <input ref={fileInputRef} id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handlePhotoChange} />
                  </div>
                  {photo && (
                     <button type="button" onClick={() => setPhoto(null)} className="mt-2 text-xs text-red-400 hover:text-red-300">
                        写真を削除 (Remove photo)
                     </button>
                  )}
                </div>
              </div>
            </div>
        </div>

        <div className="flex flex-col space-y-3">
             <button onClick={handleStamp} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105">
                {climbRecord ? '記録を更新 (Update Record)' : 'スタンプを押す (Stamp It!)'}
            </button>
            {climbRecord && (
                 <button onClick={handleRemove} className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105">
                    スタンプを削除 (Remove Stamp)
                </button>
            )}
            <button onClick={onClose} className="w-full bg-zinc-600 hover:bg-zinc-500 text-zinc-200 font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105">
                キャンセル (Cancel)
            </button>
        </div>
      </div>
    </div>
  );
};

export default StampModal;
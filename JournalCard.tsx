import React, { useState, useRef } from 'react';
import { format } from 'date-fns';
import { Trash2, Edit2, X } from 'lucide-react';
import type { JournalEntry } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  entry: JournalEntry;
  onDelete: (id: string) => void;
  onEdit: (entry: JournalEntry) => void;
}

export const JournalCard: React.FC<Props> = ({ entry, onDelete, onEdit }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const timerRef = useRef<any>(null);

  const handleTouchStart = () => {
    timerRef.current = setTimeout(() => {
      setShowMobileMenu(true);
      if (window.navigator.vibrate) {
        window.navigator.vibrate(50);
      }
    }, 500);
  };

  const handleTouchEnd = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="masonry-item relative p-6 sm:p-7 rounded-[2rem] shadow-soft hover:shadow-hover transition-shadow duration-300 group overflow-hidden touch-none"
      style={{ backgroundColor: entry.backgroundColor }}
      onPointerDown={handleTouchStart}
      onPointerUp={handleTouchEnd}
      onPointerLeave={handleTouchEnd}
    >
      {/* Desktop Actions */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:flex gap-1 z-10">
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(entry); }}
          className="p-2 bg-black/5 rounded-full hover:bg-black/10 text-textDark/40 hover:text-textDark/80 transition-colors"
          aria-label="Edit entry"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(entry.id); }}
          className="p-2 bg-black/5 rounded-full hover:bg-black/10 text-textDark/40 hover:text-red-500 transition-colors"
          aria-label="Delete entry"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Mobile Actions Overlay */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white/80 backdrop-blur-md flex items-center justify-center gap-6 z-20 sm:hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => { onEdit(entry); setShowMobileMenu(false); }}
              className="flex flex-col items-center gap-1.5 text-textDark"
            >
              <div className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center text-textDark">
                <Edit2 className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider">Edit</span>
            </button>
            
            <button
              onClick={() => { onDelete(entry.id); setShowMobileMenu(false); }}
              className="flex flex-col items-center gap-1.5 text-red-500"
            >
              <div className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center text-red-500">
                <Trash2 className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider">Delete</span>
            </button>

            <button
              onClick={() => setShowMobileMenu(false)}
              className="absolute top-3 right-3 p-1.5 text-textDark/30 bg-black/5 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      <p className="text-textDark font-medium text-[15px] leading-relaxed whitespace-pre-wrap mt-1 mb-10">
        {entry.content}
      </p>
      
      <div className="absolute bottom-5 left-6 sm:left-7">
        <span className="text-[11px] font-bold text-textDark/30 uppercase tracking-widest">
          {format(entry.createdAt, 'MMM d, yyyy')}
        </span>
      </div>
    </motion.div>
  );
};

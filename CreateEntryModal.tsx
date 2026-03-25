import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { JournalEntry } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: JournalEntry) => void;
  initialEntry?: JournalEntry | null;
}

const PASTEL_COLORS = [
  '#F0FFF0', '#FFF0F5', '#F0F8FF', '#FFFFF0', '#FDF5E6', '#E6E6FA',
];

export const CreateEntryModal: React.FC<Props> = ({ isOpen, onClose, onSave, initialEntry }) => {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialEntry) {
        setContent(initialEntry.content);
      } else {
        setContent('');
      }
      setTimeout(() => {
        textareaRef.current?.focus();
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.value.length;
          textareaRef.current.selectionEnd = textareaRef.current.value.length;
        }
      }, 100);
    }
  }, [isOpen, initialEntry]);

  const handleSave = () => {
    if (!content.trim()) return;
    
    if (initialEntry) {
      onSave({
        ...initialEntry,
        content: content.trim()
      });
    } else {
      const randomColor = PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)];
      onSave({
        id: uuidv4(),
        content: content.trim(),
        createdAt: Date.now(),
        backgroundColor: randomColor,
      });
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          />
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className="w-full max-w-lg bg-card rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-6 sm:p-8 pointer-events-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium text-textDark">
                  {initialEntry ? 'Edit Entry' : 'New Entry'}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 text-textSoft hover:bg-black/5 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full h-40 resize-none outline-none text-textDark text-[15px] leading-relaxed placeholder:text-textSoft/50 bg-transparent font-medium"
                spellCheck="false"
              />
              
              <div className="flex justify-end mt-8">
                <button
                  onClick={handleSave}
                  disabled={!content.trim()}
                  className="px-6 py-2.5 bg-textDark text-white font-medium text-sm rounded-full hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {initialEntry ? 'Save Changes' : 'Save Entry'}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

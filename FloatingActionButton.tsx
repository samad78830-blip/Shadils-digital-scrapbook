import React from 'react';
import { Plus } from 'lucide-react';

interface Props {
  onClick: () => void;
}

export const FloatingActionButton: React.FC<Props> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 w-14 h-14 bg-textDark text-white rounded-full flex items-center justify-center shadow-[0_10px_40px_rgba(0,0,0,0.15)] hover:scale-105 hover:shadow-[0_15px_45px_rgba(0,0,0,0.2)] transition-all duration-300 z-50 group"
      aria-label="Add new entry"
    >
      <Plus className="w-6 h-6 transition-transform duration-300 group-hover:rotate-90" />
    </button>
  );
};

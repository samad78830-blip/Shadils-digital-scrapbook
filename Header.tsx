import React from 'react';
import { Search } from 'lucide-react';
import type { UserProfile } from '../types';

interface Props {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  user: UserProfile | null;
  onProfileClick: () => void;
}

export const Header: React.FC<Props> = ({ searchQuery, onSearchChange, user, onProfileClick }) => {
  return (
    <header className="w-full pt-16 pb-12 flex flex-col items-center justify-center bg-transparent select-none relative">
      {user && (
        <div 
          onClick={onProfileClick}
          className="fixed sm:absolute bottom-8 left-8 sm:bottom-auto sm:top-8 sm:left-0 flex items-center gap-3 z-50 cursor-pointer group/profile"
        >
          <div className="w-10 h-10 rounded-2xl bg-white shadow-soft flex items-center justify-center overflow-hidden group-hover/profile:shadow-hover transition-all">
            {user.avatar.startsWith('http') ? (
              <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl">{user.avatar}</span>
            )}
          </div>
          <span className="text-sm font-medium text-textDark tracking-tight opacity-70 bg-white/50 sm:bg-transparent px-2 py-1 rounded-lg backdrop-blur-sm sm:backdrop-blur-none sm:p-0 group-hover/profile:opacity-100 transition-opacity">
            {user.username}
          </span>
        </div>
      )}

      <h1 className="text-4xl sm:text-5xl font-light text-textDark tracking-tight transition-all duration-300 italic">
        SoulJournal
      </h1>
      <p className="mt-3 text-sm sm:text-base text-textSoft font-normal tracking-wide opacity-80 mb-10">
        Your digital scrapbook.
      </p>
      
      <div className="relative w-full max-w-md group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-textSoft/50 group-focus-within:text-textDark transition-colors" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search your soul..."
          className="w-full pl-12 pr-4 py-3 bg-white/50 border border-black/5 rounded-2xl outline-none text-sm text-textDark placeholder:text-textSoft/40 focus:bg-white focus:border-black/10 focus:shadow-soft transition-all"
        />
      </div>
    </header>
  );
};

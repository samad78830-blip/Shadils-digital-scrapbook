import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { JournalCard } from './components/JournalCard';
import { FloatingActionButton } from './components/FloatingActionButton';
import { CreateEntryModal } from './components/CreateEntryModal';
import { Onboarding } from './components/Onboarding';
import type { JournalEntry, UserProfile } from './types';
import { getEntries, addEntry, deleteEntry, updateEntry, getUser, saveUser, logoutUser } from './lib/storage';
import { AnimatePresence, motion } from 'framer-motion';
import { LogOut } from 'lucide-react';

function App() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setEntries(getEntries());
    setUser(getUser());
    setIsLoading(false);
  }, []);

  const handleOnboardingComplete = (userData: UserProfile) => {
    saveUser(userData);
    setUser(userData);
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setIsLogoutModalOpen(false);
  };

  const handleSaveEntry = (entry: JournalEntry) => {
    const isUpdate = entries.some(e => e.id === entry.id);
    let updated: JournalEntry[];
    
    if (isUpdate) {
      updated = updateEntry(entry);
    } else {
      updated = addEntry(entry);
    }
    
    setEntries(updated);
    setEditingEntry(null);
  };

  const handleDeleteEntry = (id: string) => {
    const updated = deleteEntry(id);
    setEntries(updated);
  };

  const handleEditEntry = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setEditingEntry(null), 300);
  };

  const filteredEntries = entries.filter(entry => 
    entry.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) return null;

  if (!user) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen relative max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 pb-32">
      <Header 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery} 
        user={user} 
        onProfileClick={() => setIsLogoutModalOpen(true)}
      />
      
      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-32 opacity-40 select-none">
          <p className="text-textDark font-medium text-xl tracking-tight italic">It's quiet here...</p>
          <p className="text-textSoft text-[15px] mt-2 font-normal">Tap the + button to add your first thought.</p>
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-32 opacity-40 select-none">
          <p className="text-textDark font-medium text-xl tracking-tight">No matching entries found.</p>
          <p className="text-textSoft text-[15px] mt-2 font-normal">Try a different search term.</p>
        </div>
      ) : (
        <div className="masonry-grid mt-4">
          <AnimatePresence mode="popLayout">
            {filteredEntries.map(entry => (
              <JournalCard
                key={entry.id}
                entry={entry}
                onDelete={handleDeleteEntry}
                onEdit={handleEditEntry}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <FloatingActionButton onClick={() => setIsModalOpen(true)} />
      
      {/* Bottom Shade */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-40" />
      
      {/* Logout Confirmation Bottom Sheet */}
      <AnimatePresence>
        {isLogoutModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLogoutModalOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[2rem] p-6 pb-10 z-[70] shadow-2xl max-w-md mx-auto"
            >
              <div className="w-10 h-1 bg-black/5 rounded-full mx-auto mb-6" />
              
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                  <LogOut className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-medium text-textDark mb-1 tracking-tight">Logging out?</h3>
                <p className="text-sm text-textSoft/70 mb-8 max-w-[240px]">Your entries are safe. You can sign back in anytime.</p>
                
                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setIsLogoutModalOpen(false)}
                    className="flex-1 py-3 bg-black/5 text-textDark font-bold rounded-xl hover:bg-black/10 transition-colors text-xs uppercase tracking-widest"
                  >
                    Stay
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 shadow-md shadow-red-500/20 transition-colors text-xs uppercase tracking-widest"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      <CreateEntryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEntry}
        initialEntry={editingEntry}
      />
    </div>
  );
}

export default App;

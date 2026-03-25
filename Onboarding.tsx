import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import type { UserProfile } from '../types';

interface Props {
  onComplete: (user: UserProfile) => void;
}

const AVATARS = [
  'https://api.dicebear.com/9.x/thumbs/svg?seed=Felix',
  'https://api.dicebear.com/9.x/thumbs/svg?seed=Aneka',
  'https://api.dicebear.com/9.x/thumbs/svg?seed=Mia',
  'https://api.dicebear.com/9.x/thumbs/svg?seed=Jack',
  'https://api.dicebear.com/9.x/thumbs/svg?seed=Oliver',
  'https://api.dicebear.com/9.x/thumbs/svg?seed=Sasha',
  'https://api.dicebear.com/9.x/thumbs/svg?seed=Toby',
  'https://api.dicebear.com/9.x/thumbs/svg?seed=Lily'
];

export const Onboarding: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('');

  const nextStep = () => setStep(prev => prev + 1);

  const handleFinish = () => {
    if (username && avatar) {
      onComplete({ username, avatar });
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 500 : -500,
      opacity: 0
    })
  };

  return (
    <div className="fixed inset-0 bg-background z-[100] flex items-center justify-center p-6 overflow-hidden">
      <div className="w-full max-w-md relative h-[450px]">
        <AnimatePresence mode="wait" custom={1}>
          {step === 1 && (
            <motion.div
              key="step1"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center"
            >
              <h1 className="text-3xl font-light text-textDark mb-4 italic">Welcome to Soul Journal.</h1>
              <p className="text-textSoft mb-10">Choose a name for your private space.</p>
              
              <div className="w-full relative group">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Your username..."
                  className="w-full px-6 py-4 bg-white border border-black/5 rounded-[2rem] outline-none text-textDark placeholder:text-textSoft/30 focus:border-black/10 focus:shadow-soft transition-all text-center text-lg"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && username && nextStep()}
                />
              </div>

              <button
                disabled={!username.trim()}
                onClick={nextStep}
                className="mt-10 w-14 h-14 bg-textDark text-white rounded-full flex items-center justify-center shadow-soft hover:scale-105 disabled:opacity-30 transition-all group"
              >
                <ArrowRight className="w-6 h-6" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center"
            >
              <h2 className="text-2xl font-light text-textDark mb-2 italic">Hi, {username}.</h2>
              <p className="text-textSoft mb-10">Pick a soul avatar.</p>
              
              <div className="grid grid-cols-4 gap-4 w-full px-4">
                {AVATARS.map((url) => (
                  <button
                    key={url}
                    onClick={() => setAvatar(url)}
                    className={`relative w-16 h-16 flex items-center justify-center rounded-3xl overflow-hidden transition-all duration-300 ${
                      avatar === url 
                        ? 'bg-textDark scale-110 shadow-lg' 
                        : 'bg-white hover:bg-black/5 hover:scale-105'
                    }`}
                  >
                    <img 
                      src={url} 
                      alt="Avatar" 
                      className={`w-full h-full object-cover transition-all ${avatar === url ? 'brightness-110' : ''}`}
                    />
                  </button>
                ))}
              </div>

              <button
                disabled={!avatar}
                onClick={handleFinish}
                className="mt-10 w-14 h-14 bg-textDark text-white rounded-full flex items-center justify-center shadow-soft hover:scale-105 disabled:opacity-30 transition-all"
              >
                <Check className="w-6 h-6" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress dots */}
      <div className="fixed bottom-12 flex gap-2">
        {[1, 2].map((i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              step === i ? 'bg-textDark w-6' : 'bg-textDark/20'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

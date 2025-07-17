import React from 'react';
import { Mountain } from '../types';

interface MountainCardProps {
  mountain: Mountain;
  isClimbed: boolean;
  climbDate: string | null;
  onSelect: () => void;
  hasComment: boolean;
  hasPhoto: boolean;
}

const StampIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
        <path d="m9 12 2 2 4-4"></path>
    </svg>
);

const UnclimbedMountainIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500">
        <path d="m8 3 4 8 5-5 5 15H2L8 3z"></path>
    </svg>
);

const CommentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-zinc-400 group-hover:text-zinc-300 transition" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.08-3.242A7.998 7.998 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM4.812 14.12A6.02 6.02 0 004 10c0-2.651 2.686-5 6-5s6 2.349 6 5-2.686 5-6 5c-1.13 0-2.176-.32-3.054-.88l-.299-.182-.107.321L4.812 14.12z" clipRule="evenodd" />
    </svg>
);

const PhotoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-zinc-400 group-hover:text-zinc-300 transition" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
    </svg>
);

const DifficultyIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-colors duration-300 ${filled ? 'text-amber-400 fill-amber-400/30 stroke-amber-500' : 'text-zinc-600 fill-transparent stroke-zinc-600'}`}>
    <path d="m8 3 4 8 5-5 5 15H2L8 3z"></path>
  </svg>
);

const DifficultyRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center gap-1 mt-2">
    {Array.from({ length: 5 }, (_, i) => (
      <DifficultyIcon key={i} filled={i < rating} />
    ))}
  </div>
);


const MountainCard: React.FC<MountainCardProps> = ({ mountain, isClimbed, climbDate, onSelect, hasComment, hasPhoto }) => {
  return (
    <div
      onClick={onSelect}
      className={`relative rounded-lg p-4 cursor-pointer transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl group ${
        isClimbed
          ? 'bg-zinc-800 border-emerald-500/50 border hover:shadow-emerald-500/20'
          : 'bg-zinc-800/50 border-zinc-700/50 border hover:shadow-zinc-500/10'
      }`}
    >
        <div className="flex justify-between items-start">
            <div className="flex-1 pr-4">
                <p className="text-xs text-zinc-400">{mountain.region} - {mountain.prefecture}</p>
                <h3 className={`text-lg font-bold mt-1 ${isClimbed ? 'text-emerald-300' : 'text-zinc-100'}`}>{mountain.name}</h3>
                <p className="text-sm text-zinc-400">{mountain.elevation}m</p>
                <DifficultyRating rating={mountain.difficulty} />
            </div>
            <div className={`transition-opacity duration-500 ${isClimbed ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'}`}>
                {isClimbed ? <StampIcon/> : <UnclimbedMountainIcon/>}
            </div>
        </div>
      
        {isClimbed && climbDate && (
            <div className="absolute bottom-2 right-3 text-xs text-emerald-400 font-mono animate-fade-in">
                {climbDate}
            </div>
        )}

        {isClimbed && (
            <div className="absolute bottom-2 left-3 flex items-center gap-2 animate-fade-in">
                {hasPhoto && <PhotoIcon />}
                {hasComment && <CommentIcon />}
            </div>
        )}
    </div>
  );
};

export default MountainCard;
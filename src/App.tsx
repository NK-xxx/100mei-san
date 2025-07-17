import React, { useState, useMemo, useCallback } from 'react';
import { Mountain, ClimbedRecords, ClimbRecord } from './types';
import { MOUNTAINS } from './data/mountains';
import { REGIONS } from './constants';
import useLocalStorage from './hooks/useLocalStorage';
import MountainCard from './components/MountainCard';
import StampModal from './components/StampModal';

const App: React.FC = () => {
  const [climbedRecords, setClimbedRecords] = useLocalStorage<ClimbedRecords>('climbedMountains', {});
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [selectedMountain, setSelectedMountain] = useState<Mountain | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const climbedCount = useMemo(() => Object.keys(climbedRecords).length, [climbedRecords]);
  const progress = useMemo(() => (climbedCount / MOUNTAINS.length) * 100, [climbedCount]);

  const filteredMountains = useMemo(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    
    return MOUNTAINS
      .filter(m => {
        // Region filter
        if (activeFilter) {
          return m.region === activeFilter;
        }
        return true;
      })
      .filter(m => {
        // Search filter
        if (!lowercasedQuery) {
          return true;
        }
        const mountainName = m.name.toLowerCase();
        const climbComment = climbedRecords[m.id]?.comment?.toLowerCase() || '';

        return mountainName.includes(lowercasedQuery) || climbComment.includes(lowercasedQuery);
      });
  }, [activeFilter, searchQuery, climbedRecords]);

  const regionalProgress = useMemo(() => {
    return REGIONS.map(region => {
      const totalInRegion = MOUNTAINS.filter(m => m.region === region).length;
      const climbedInRegion = MOUNTAINS.filter(m => m.region === region && climbedRecords[m.id]).length;
      return {
        region,
        climbed: climbedInRegion,
        total: totalInRegion,
        percentage: totalInRegion > 0 ? (climbedInRegion / totalInRegion) * 100 : 0
      };
    });
  }, [climbedRecords]);

  const handleSelectMountain = useCallback((mountain: Mountain) => {
    setSelectedMountain(mountain);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedMountain(null);
  }, []);

  const handleStampMountain = useCallback((id: number, record: ClimbRecord) => {
    setClimbedRecords(prev => ({ ...prev, [id]: record }));
  }, [setClimbedRecords]);

  const handleRemoveStamp = useCallback((id: number) => {
    setClimbedRecords(prev => {
        const newRecords = {...prev};
        delete newRecords[id];
        return newRecords;
    });
  }, [setClimbedRecords]);

  return (
    <div className="min-h-screen bg-zinc-900 font-sans">
      <header 
        className="relative h-60 bg-cover bg-center text-white"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1578637387935-4504b2765b84?q=80&w=2071&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/70 to-transparent"></div>
        <div className="relative z-10 flex flex-col justify-end h-full p-4 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">日本百名山スタンプラリー</h1>
            <p className="text-zinc-300 mt-1 drop-shadow-md">100 Famous Japanese Mountains Stamp Rally</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="bg-zinc-800/50 rounded-lg p-6 mb-8 border border-zinc-700/50">
          <h2 className="text-xl font-semibold text-emerald-300">進捗 (Your Progress)</h2>
          <div className="flex items-center mt-4">
            <div className="w-full bg-zinc-700 rounded-full h-4">
              <div className="bg-emerald-500 h-4 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>
            <span className="ml-4 font-bold text-lg whitespace-nowrap">{climbedCount} / 100</span>
          </div>
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mt-6">
                {regionalProgress.map(r => (
                    <div key={r.region} className="text-center">
                        <p className="text-sm text-zinc-400">{r.region}</p>
                        <p className="font-bold text-lg">{r.climbed} / {r.total}</p>
                        <div className="w-full bg-zinc-600 rounded-full h-1.5 mt-1">
                            <div className="bg-emerald-500 h-1.5 rounded-full" style={{width: `${r.percentage}%`}}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        
        <div className="space-y-4 mb-6">
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="h-5 w-5 text-zinc-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                </span>
                <input
                    type="text"
                    placeholder="山名、またはコメントで検索 (Search by name or comment...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-zinc-700/80 border border-zinc-600 rounded-full text-zinc-100 placeholder-zinc-400 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition"
                />
            </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveFilter(null)}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition ${!activeFilter ? 'bg-emerald-500 text-white shadow-emerald-500/20 shadow-md' : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'}`}
            >
              すべて (All)
            </button>
            {REGIONS.map(region => (
              <button
                key={region}
                onClick={() => setActiveFilter(region)}
                className={`px-4 py-2 text-sm font-semibold rounded-full transition ${activeFilter === region ? 'bg-emerald-500 text-white shadow-emerald-500/20 shadow-md' : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'}`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredMountains.map(mountain => (
            <MountainCard
              key={mountain.id}
              mountain={mountain}
              isClimbed={!!climbedRecords[mountain.id]}
              climbDate={climbedRecords[mountain.id]?.climbDate || null}
              hasComment={!!climbedRecords[mountain.id]?.comment}
              hasPhoto={!!climbedRecords[mountain.id]?.photo}
              onSelect={() => handleSelectMountain(mountain)}
            />
          ))}
        </div>
      </main>
      
      {selectedMountain && (
        <StampModal
            mountain={selectedMountain}
            climbRecord={climbedRecords[selectedMountain.id] || null}
            onClose={handleCloseModal}
            onStamp={handleStampMountain}
            onRemoveStamp={handleRemoveStamp}
        />
      )}
      
      <style>{`
          .animate-fade-in { animation: fadeIn 0.3s ease-in-out; }
          .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>
    </div>
  );
};

export default App;
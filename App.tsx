import React, { useState } from 'react';
import Visualizer from './components/Visualizer';
import WorksheetGenerator from './components/WorksheetGenerator';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'learn' | 'print'>('learn');

  return (
    <div className="min-h-screen bg-slate-100 pb-12">
      {/* Header - Hidden when printing */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 print:hidden">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xl shadow-lg">
               🧮
             </div>
             <h1 className="text-xl font-black text-slate-800 tracking-tight hidden md:block">
               Kids Math <span className="text-indigo-600">Explorer</span>
             </h1>
          </div>

          <nav className="flex bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab('learn')}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'learn' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Learn & Visuals
            </button>
            <button 
              onClick={() => setActiveTab('print')}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'print' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Print Worksheets
            </button>
          </nav>
        </div>
      </header>

      <main className="pt-6">
        {activeTab === 'learn' ? <Visualizer /> : <WorksheetGenerator />}
      </main>
    </div>
  );
};

export default App;
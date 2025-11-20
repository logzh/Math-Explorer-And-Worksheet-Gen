import React, { useState, useMemo } from 'react';
import { Operation } from '../types';
import { explainMathConcept } from '../services/geminiService';

const Visualizer: React.FC = () => {
  const [num1, setNum1] = useState<number>(3);
  const [num2, setNum2] = useState<number>(4);
  const [operation, setOperation] = useState<Operation>(Operation.MULTIPLY);
  const [explanation, setExplanation] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Determine operands for display based on operation
  // For Division: We want Integer results. So if user picks A and B, we treat it as:
  // Total = A * B, Groups = A, Result = B.
  // Display: (A*B) / A = B
  const displayData = useMemo(() => {
    if (operation === Operation.MULTIPLY) {
      return {
        a: num1,
        b: num2,
        result: num1 * num2,
        symbol: '×',
        label: `${num1} groups of ${num2}`
      };
    } else {
      // For division visualization, we treat num1 as "groups" and num2 as "items per group"
      // to construct a clean division problem: (num1 * num2) ÷ num1 = num2
      const total = num1 * num2;
      return {
        a: total,
        b: num1,
        result: num2,
        symbol: '÷',
        label: `${total} shared by ${num1}`
      };
    }
  }, [num1, num2, operation]);

  const handleAskAI = async () => {
    setLoading(true);
    setExplanation("");
    try {
      const text = await explainMathConcept(displayData.a, displayData.b, operation === Operation.MULTIPLY ? Operation.MULTIPLY : Operation.DIVIDE);
      setExplanation(text);
    } catch (e) {
      setExplanation("Something went wrong asking the AI.");
    } finally {
      setLoading(false);
    }
  };

  // Generate visual items
  const renderVisuals = () => {
    const items = [];
    const groups = operation === Operation.MULTIPLY ? displayData.a : displayData.b; // Number of groups
    const itemsPerGroup = operation === Operation.MULTIPLY ? displayData.b : displayData.result; 

    const colors = ['bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-purple-400', 'bg-pink-400'];

    for (let i = 0; i < groups; i++) {
      const groupItems = [];
      for (let j = 0; j < itemsPerGroup; j++) {
        groupItems.push(
          <div key={`item-${i}-${j}`} className="w-6 h-6 md:w-8 md:h-8 text-white flex items-center justify-center">
             <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full drop-shadow-sm">
               <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
             </svg>
          </div>
        );
      }
      items.push(
        <div key={`group-${i}`} className={`p-3 rounded-xl ${colors[i % colors.length]} bg-opacity-20 border-2 border-${colors[i % colors.length].replace('bg-', '')} flex flex-wrap gap-1 items-center justify-center min-w-[80px]`}>
          {groupItems}
        </div>
      );
    }
    return items;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
        <div className="p-6 bg-indigo-600 text-white">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-3xl">🎓</span> Learn Together
          </h2>
          <p className="text-indigo-100 opacity-90">Adjust the numbers to see how math works!</p>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          {/* Controls */}
          <div className="flex flex-wrap gap-6 justify-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
             <div className="flex flex-col gap-2">
                <label className="font-bold text-slate-600 text-sm uppercase tracking-wide">Operation</label>
                <div className="flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
                  <button 
                    onClick={() => setOperation(Operation.MULTIPLY)}
                    className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${operation === Operation.MULTIPLY ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    Multiply (×)
                  </button>
                  <button 
                    onClick={() => setOperation(Operation.DIVIDE)}
                    className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${operation === Operation.DIVIDE ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    Divide (÷)
                  </button>
                </div>
             </div>

             <div className="flex flex-col gap-2 w-32">
                <label className="font-bold text-slate-600 text-sm uppercase tracking-wide">
                  {operation === Operation.MULTIPLY ? 'Groups' : 'Friends (Divisor)'}
                </label>
                <input 
                  type="number" 
                  min="1" max="12" 
                  value={num1} 
                  onChange={(e) => setNum1(Math.max(1, Math.min(12, parseInt(e.target.value) || 1)))}
                  className="border-2 border-slate-200 rounded-lg px-3 py-2 text-center text-xl font-bold focus:border-indigo-500 outline-none text-indigo-700"
                />
             </div>

             <div className="flex flex-col gap-2 w-32">
                <label className="font-bold text-slate-600 text-sm uppercase tracking-wide">
                   {operation === Operation.MULTIPLY ? 'Items/Group' : 'Answer (Result)'}
                </label>
                <input 
                  type="number" 
                  min="1" max="12" 
                  value={num2} 
                  onChange={(e) => setNum2(Math.max(1, Math.min(12, parseInt(e.target.value) || 1)))}
                  className="border-2 border-slate-200 rounded-lg px-3 py-2 text-center text-xl font-bold focus:border-indigo-500 outline-none text-indigo-700"
                />
             </div>
          </div>

          {/* Equation Display */}
          <div className="text-center space-y-2">
            <div className="text-5xl md:text-7xl font-black text-slate-800 tracking-tight flex items-center justify-center gap-4">
              <span>{displayData.a}</span>
              <span className="text-indigo-500">{displayData.symbol}</span>
              <span>{displayData.b}</span>
              <span className="text-slate-400">=</span>
              <span className="text-green-600">{displayData.result}</span>
            </div>
            <p className="text-lg text-slate-500 font-medium">{displayData.label}</p>
          </div>

          {/* Visual Grid */}
          <div className="flex flex-wrap gap-4 justify-center items-center min-h-[200px] bg-slate-50 rounded-2xl p-6 border border-dashed border-slate-300">
            {renderVisuals()}
          </div>

          {/* AI Tutor Section */}
          <div className="border-t border-slate-100 pt-6">
            {!explanation && !loading && (
              <button 
                onClick={handleAskAI}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                <span>🤖</span> Ask AI Tutor to Explain This!
              </button>
            )}

            {loading && (
              <div className="w-full py-8 flex flex-col items-center justify-center text-slate-400 animate-pulse gap-2">
                <div className="w-8 h-8 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
                <p>Thinking of a fun story...</p>
              </div>
            )}

            {explanation && (
               <div className="bg-rose-50 rounded-2xl p-6 border border-rose-100 relative">
                 <div className="absolute -top-3 left-6 bg-white text-2xl px-2 rounded-full border border-rose-100">🤖</div>
                 <h3 className="text-rose-800 font-bold mb-2">Here's a story for you:</h3>
                 <p className="text-slate-700 leading-relaxed text-lg">{explanation}</p>
                 <button onClick={handleAskAI} className="mt-4 text-rose-600 text-sm font-bold underline hover:text-rose-700">Try another story</button>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Visualizer;
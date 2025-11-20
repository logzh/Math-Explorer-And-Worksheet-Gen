import React, { useState, useEffect, useRef } from 'react';
import { Operation, MathProblem, WorksheetConfig } from '../types';

const WorksheetGenerator: React.FC = () => {
  const [problems, setProblems] = useState<MathProblem[]>([]);
  const [config, setConfig] = useState<WorksheetConfig>({
    count: 40,
    maxNumber: 9,
    operation: Operation.MULTIPLY
  });
  const [showAnswers, setShowAnswers] = useState<boolean>(false);

  // Generate problems
  const generateProblems = () => {
    const newProblems: MathProblem[] = [];
    
    for (let i = 0; i < config.count; i++) {
      const isMultiply = 
        config.operation === Operation.MULTIPLY ? true : 
        config.operation === Operation.DIVIDE ? false : 
        Math.random() > 0.5;

      let num1, num2, ans, opSymbol;

      if (isMultiply) {
        num1 = Math.floor(Math.random() * (config.maxNumber - 1)) + 2; // 2 to max
        num2 = Math.floor(Math.random() * 9) + 1; // 1 to 9 (standard multiplication table feel)
        ans = num1 * num2;
        opSymbol = '×';
        
        // Randomize order for variety
        if (Math.random() > 0.5) [num1, num2] = [num2, num1];
      } else {
        // Division: Ensure integer result.
        // Start with result (ans) and divisor (num2), calculate dividend (num1)
        ans = Math.floor(Math.random() * 9) + 1; // 1 to 9
        num2 = Math.floor(Math.random() * (config.maxNumber - 1)) + 2; // 2 to max
        num1 = ans * num2;
        opSymbol = '÷';
      }

      newProblems.push({
        id: Math.random().toString(36).substr(2, 9),
        num1,
        num2,
        operator: opSymbol,
        answer: ans
      });
    }
    setProblems(newProblems);
  };

  // Initial generation
  useEffect(() => {
    generateProblems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.count, config.maxNumber, config.operation]);

  const handlePrint = () => {
    window.print();
  };

  // Determine grid layout based on count
  const getGridClass = () => {
    if (config.count > 50) return 'grid-cols-4 md:grid-cols-5 text-sm gap-y-6';
    if (config.count >= 40) return 'grid-cols-2 md:grid-cols-4 text-lg gap-y-8';
    return 'grid-cols-2 md:grid-cols-4 text-lg gap-y-12';
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      
      {/* Configuration Panel - Hidden on Print */}
      <div className="print:hidden bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
           <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
             <span>🖨️</span> Worksheet Setup
           </h2>
           <div className="flex gap-2">
              <button 
                onClick={generateProblems}
                className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg font-bold hover:bg-indigo-200 transition-colors flex items-center gap-2"
              >
                <span>🔄</span> Refresh Questions
              </button>
              <button 
                onClick={handlePrint}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                <span>🖨️</span> Print / Save PDF
              </button>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-500 uppercase">Question Type</label>
            <select 
              className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
              value={config.operation}
              onChange={(e) => setConfig({...config, operation: e.target.value as Operation})}
            >
              <option value={Operation.MULTIPLY}>Multiplication Only</option>
              <option value={Operation.DIVIDE}>Division Only</option>
              <option value={Operation.MIXED}>Mixed (× and ÷)</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
             <label className="text-sm font-bold text-slate-500 uppercase">Difficulty (Max Num)</label>
             <select 
              className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
              value={config.maxNumber}
              onChange={(e) => setConfig({...config, maxNumber: parseInt(e.target.value)})}
            >
              <option value={5}>Very Easy (1-5)</option>
              <option value={9}>Standard (1-9)</option>
              <option value={12}>Advanced (1-12)</option>
              <option value={20}>Challenger (1-20)</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
             <label className="text-sm font-bold text-slate-500 uppercase">Count</label>
             <select 
              className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50 font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
              value={config.count}
              onChange={(e) => setConfig({...config, count: parseInt(e.target.value)})}
            >
              <option value={10}>10 Questions</option>
              <option value={20}>20 Questions</option>
              <option value={30}>30 Questions</option>
              <option value={40}>40 Questions</option>
              <option value={50}>50 Questions (Full Page)</option>
              <option value={100}>100 Questions (Dense)</option>
            </select>
          </div>
          
          <div className="flex flex-col gap-2 items-start pt-6 md:pt-0 md:justify-end">
            <label className="flex items-center gap-2 cursor-pointer select-none bg-slate-100 px-3 py-2 rounded-lg w-full hover:bg-slate-200 transition-colors
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { GlassCard } from '@/shared/components/GlassCard';
import { Badge } from '@/shared/components/Badge';
import { Sparkles, History, Cpu } from 'lucide-react';

// ==========================================
// 1. MuscleSelector Component
// ==========================================
interface MuscleSelectorProps {
  onSelectMuscle: (muscle: string) => void;
}

export const MuscleSelector: React.FC<MuscleSelectorProps> = ({ onSelectMuscle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMuscle, setSelectedMuscle] = useState('Chest (Push Focus)');
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const muscles = [
    'Chest (Push Focus)',
    'Shoulders / OHP',
    'Triceps / Arms',
    'Core & Abs',
    'Back / Pull Focus',
    'Quadriceps / Legs',
    'Hamstrings & Glutes',
    'Calves'
  ];

  const filteredMuscles = muscles.filter(m =>
    m.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="muscle-dropdown-wrapper relative w-full text-sm" ref={dropdownRef}>
      <button
        className="muscle-dropdown-btn w-full bg-obsidian-900 border border-obsidian-700 text-white px-4 py-2 rounded-lg flex items-center justify-between cursor-pointer transition-all hover:border-neon-cyan shadow-sm"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="selected-text flex items-center gap-2 truncate">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#00F2FE', flexShrink: 0 }}>
            <path d="M6.5 6.5h11M6.5 17.5h11M5 12h14" />
          </svg>
          {selectedMuscle}
        </span>
        <span className={`arrow transition-transform duration-200 text-slate-400 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>▼</span>
      </button>

      {isOpen && (
        <div className="muscle-dropdown-menu absolute top-full left-0 mt-2 w-full bg-obsidian-900 border border-obsidian-700 rounded-lg shadow-2xl z-50 overflow-hidden">
          <div className="dropdown-search-wrapper p-2.5 border-b border-obsidian-700">
            <input
              type="text"
              className="dropdown-search w-full bg-obsidian-950 border border-obsidian-700 rounded-md px-3 py-1.5 text-white text-xs outline-none focus:border-neon-cyan"
              placeholder="Search muscle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          <div className="dropdown-options max-h-56 overflow-y-auto p-1.5 space-y-1">
            {filteredMuscles.map((muscle) => (
              <div
                key={muscle}
                className={`dropdown-option px-3 py-2 rounded-md cursor-pointer flex items-center justify-between text-xs text-slate-300 transition-colors hover:bg-neon-cyan/10 hover:text-white ${selectedMuscle === muscle ? 'bg-neon-cyan/20 text-neon-cyan font-medium' : ''}`}
                onClick={() => {
                  setSelectedMuscle(muscle);
                  onSelectMuscle(muscle);
                  setIsOpen(false);
                  setSearchTerm('');
                }}
              >
                {muscle}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


// ==========================================
// 2. WorkoutVersionComparison Component
// ==========================================
export const WorkoutVersionComparison: React.FC = () => {
  const [selectedMuscle, setSelectedMuscle] = useState<string>('Chest (Push Focus)');
  const [setsState, setSetsState] = useState([
    { id: 1, target: '10 reps', weight: 70, done: true },
    { id: 2, target: '10 reps', weight: 70, done: false },
    { id: 3, target: '8 reps', weight: 70, done: false },
  ]);

  const handleWeightChange = (id: number, delta: number) => {
    setSetsState(prev => prev.map(s => s.id === id ? { ...s, weight: Math.max(0, s.weight + delta) } : s));
  };

  const toggleSetDone = (id: number) => {
    setSetsState(prev => prev.map(s => s.id === id ? { ...s, done: !s.done } : s));
  };

  const getWorkoutData = (muscle: string) => {
    switch (muscle) {
      case 'Shoulders / OHP':
        return {
          title: 'Neural Adapted Shoulders A',
          exerciseHeaderName: 'Seated Dumbbell Press',
          badgeText: 'SHOULDERS',
          baseline: {
            name: 'Standard Overhead Focus',
            exercises: [
              '• Barbell Standing OHP: 5 sets x 8 reps @ 145 lbs',
              '• Push Press: 3 sets x 5 reps @ 165 lbs',
              '• Lateral Raises: 3 sets x 15 reps @ 25 lbs'
            ],
            volume: '15,500 lbs • Est: 55 mins'
          },
          adapted: {
            name: 'Neural Adapted Shoulders (HRV 68ms)',
            exercises: [
              '• Seated Dumbbell Press: 3 sets x 10 reps @ 55 lbs (Joint Protection)',
              '• Cable Lateral Raises: 3 sets x 15 reps @ 20 lbs (Constant Tension)',
              '• Rear Delt Flyes: 2 sets x 15 reps @ 30 lbs (Postural Balance)'
            ],
            volume: '8,400 lbs (-45% Load) • Est: 40 mins (-15m)'
          }
        };
      case 'Triceps / Arms':
        return {
          title: 'Neural Adapted Arms A',
          exerciseHeaderName: 'EZ Bar Skullcrushers',
          badgeText: 'TRICEPS',
          baseline: {
            name: 'Standard Heavy Arm Crusher',
            exercises: [
              '• Close Grip Bench Press: 4 sets x 8 reps @ 185 lbs',
              '• Overhead Barbell Extension: 3 sets x 10 reps @ 75 lbs',
              '• Barbell Curls: 3 sets x 10 reps @ 85 lbs'
            ],
            volume: '13,200 lbs • Est: 50 mins'
          },
          adapted: {
            name: 'Neural Adapted Arms (HRV 68ms)',
            exercises: [
              '• EZ Bar Skullcrushers: 3 sets x 12 reps @ 50 lbs (Elbow Unloading)',
              '• Cable Pushdowns: 3 sets x 15 reps @ 40 lbs (Pump Focus)',
              '• Incline DB Hammer Curls: 3 sets x 12 reps @ 30 lbs (Brachialis Target)'
            ],
            volume: '9,100 lbs (-31% Load) • Est: 35 mins (-15m)'
          }
        };
      case 'Core & Abs':
        return {
          title: 'Neural Adapted Core Stability',
          exerciseHeaderName: 'Hollow Body Hold',
          badgeText: 'CORE',
          baseline: {
            name: 'Standard Heavy Core Routine',
            exercises: [
              '• Weighted Decline Crunches: 4 sets x 15 reps @ 45 lbs',
              '• Hanging Leg Raises: 4 sets x 12 reps (Bodyweight)',
              '• Weighted Russian Twists: 3 sets x 20 reps @ 35 lbs'
            ],
            volume: '8,900 lbs • Est: 40 mins'
          },
          adapted: {
            name: 'Neural Adapted Core (HRV 68ms)',
            exercises: [
              '• Hollow Body Hold: 3 sets x 45s (Isometric Spinal Protection)',
              '• Cable Woodchoppers: 3 sets x 12 reps @ 30 lbs (Rotational Integrity)',
              '• Plank Stability Drills: 3 sets x 60s (Transverse Abdominis Focus)'
            ],
            volume: '6,200 lbs (-30% Load) • Est: 30 mins (-10m)'
          }
        };
      case 'Back / Pull Focus':
        return {
          title: 'Neural Adapted Pull A',
          exerciseHeaderName: 'Chest-Supported T-Bar Rows',
          badgeText: 'BACK',
          baseline: {
            name: 'Standard Heavy Pull Routine',
            exercises: [
              '• Barbell Deadlift: 4 sets x 5 reps @ 315 lbs',
              '• Barbell Bent-Over Rows: 4 sets x 8 reps @ 185 lbs',
              '• Weighted Pull-Ups: 3 sets x 8 reps @ 45 lbs'
            ],
            volume: '18,600 lbs • Est: 65 mins'
          },
          adapted: {
            name: 'Neural Adapted Pull (HRV 68ms)',
            exercises: [
              '• Chest-Supported T-Bar Rows: 3 sets x 10 reps @ 115 lbs (Spinal Unloading)',
              '• Lat Pulldowns (Neutral Grip): 3 sets x 12 reps @ 120 lbs (Joint Friendly)',
              '• Straight-Arm Pulldowns: 3 sets x 15 reps @ 50 lbs (Lats Isolation)'
            ],
            volume: '11,100 lbs (-40% Load) • Est: 45 mins (-20m)'
          }
        };
      case 'Quadriceps / Legs':
        return {
          title: 'Neural Adapted Quad Focus',
          exerciseHeaderName: 'Safety Bar Box Squats',
          badgeText: 'QUADS',
          baseline: {
            name: 'Standard Heavy Leg Day',
            exercises: [
              '• Barbell Back Squat: 5 sets x 6 reps @ 275 lbs',
              '• Leg Press: 4 sets x 10 reps @ 360 lbs',
              '• Bulgarian Split Squats: 3 sets x 8 reps @ 50 lbs DBs'
            ],
            volume: '22,400 lbs • Est: 70 mins'
          },
          adapted: {
            name: 'Neural Adapted Quads (HRV 68ms)',
            exercises: [
              '• Safety Bar Box Squats: 3 sets x 8 reps @ 185 lbs (Knee/Lower Back Relief)',
              '• Leg Extensions: 3 sets x 15 reps @ 90 lbs (Controlled Constant Tension)',
              '• Goblet Squats: 3 sets x 12 reps @ 60 lbs (Metabolic Flush)'
            ],
            volume: '13,500 lbs (-40% Load) • Est: 45 mins (-25m)'
          }
        };
      case 'Hamstrings & Glutes':
        return {
          title: 'Neural Adapted Posterior Chain',
          exerciseHeaderName: 'Cable Pull-Throughs',
          badgeText: 'HAMSTRINGS',
          baseline: {
            name: 'Standard Heavy Posterior Routine',
            exercises: [
              '• Romanian Deadlifts: 4 sets x 8 reps @ 225 lbs',
              '• Barbell Hip Thrusts: 4 sets x 10 reps @ 275 lbs',
              '• Lying Leg Curls: 3 sets x 12 reps @ 90 lbs'
            ],
            volume: '19,800 lbs • Est: 60 mins'
          },
          adapted: {
            name: 'Neural Adapted Posterior (HRV 68ms)',
            exercises: [
              '• Cable Pull-Throughs: 3 sets x 12 reps @ 70 lbs (Low-Shear Hinge)',
              '• Single-Leg RDLs (Light): 3 sets x 10 reps @ 30 lbs DBs (Stability Control)',
              '• Seated Leg Curls: 3 sets x 15 reps @ 75 lbs (Pump Focus)'
            ],
            volume: '11,200 lbs (-43% Load) • Est: 40 mins (-20m)'
          }
        };
      case 'Calves':
        return {
          title: 'Neural Adapted Calf Isolation',
          exerciseHeaderName: 'Leg Press Calf Press',
          badgeText: 'CALVES',
          baseline: {
            name: 'Standard Heavy Calf Protocol',
            exercises: [
              '• Standing Barbell Calf Raises: 5 sets x 12 reps @ 185 lbs',
              '• Seated Calf Raises: 4 sets x 15 reps @ 135 lbs',
              '• Donkey Calf Raises: 3 sets x 20 reps @ Bodyweight'
            ],
            volume: '16,200 lbs • Est: 45 mins'
          },
          adapted: {
            name: 'Neural Adapted Calves (HRV 68ms)',
            exercises: [
              '• Leg Press Calf Press: 4 sets x 15 reps @ 200 lbs (Spine Unloading)',
              '• Seated Calf Raises (Slow Tempo): 3 sets x 15 reps @ 90 lbs (Tendon Resilience)',
              '• Tibialis Raises: 2 sets x 20 reps @ Light Resistance'
            ],
            volume: '10,500 lbs (-35% Load) • Est: 30 mins (-15m)'
          }
        };
      default: // Chest / Push Focus
        return {
          title: 'Neural Adapted Push A',
          exerciseHeaderName: 'Incline Dumbbell Bench Press',
          badgeText: 'CHEST',
          baseline: {
            name: 'Standard Hypertrophy Push A',
            exercises: [
              '• Barbell Bench Press: 4 sets x 10 reps @ 225 lbs',
              '• Barbell Overhead Press: 4 sets x 10 reps @ 135 lbs',
              '• Skullcrushers: 3 sets x 12 reps @ 75 lbs'
            ],
            volume: '14,200 lbs • Est: 60 mins'
          },
          adapted: {
            name: 'Neural Adapted Push A (HRV 68ms)',
            exercises: [
              '• Incline DB Press: 3 sets x 10 reps @ 70 lbs (Rotator Protection)',
              '• Seated DB OHP: 3 sets x 12 reps @ 50 lbs (Spine Unloading)',
              '• Cable Rope Pushdowns: 2 sets x 15 reps @ 45 lbs (Pump Focus)'
            ],
            volume: '11,400 lbs (-19% Load) • Est: 45 mins (-15m)'
          }
        };
    }
  };

  const currentPlan = getWorkoutData(selectedMuscle);

  return (
    <div className="space-y-6">
      {/* Glassmorphism Header */}


      {/* Comparison Matrix Card with Dropdown */}
      <GlassCard glow="violet" className="space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-obsidian-700/60 pb-3 gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-neon-violet" />
            <h3 className="text-base font-bold text-white">AI Version Comparison Matrix</h3>
          </div>

          <div className="w-full md:w-64">
            <MuscleSelector onSelectMuscle={(muscle) => setSelectedMuscle(muscle)} />
          </div>


        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Previous Version */}
          <div className="p-4 rounded-xl bg-obsidian-900/80 border border-obsidian-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                <History className="w-3.5 h-3.5" />
                Previous Standard Plan
              </span>
              <span className="text-xs text-slate-400">v1.0 Baseline</span>
            </div>
            <h4 className="text-sm font-bold text-white">{currentPlan.baseline.name}</h4>
            <ul className="text-xs space-y-1 text-slate-300 font-mono">
              {currentPlan.baseline.exercises.map((ex, idx) => (
                <li key={idx}>{ex}</li>
              ))}
            </ul>
            <div className="pt-2 text-[11px] text-slate-500 border-t border-obsidian-800">
              Total Load Volume: {currentPlan.baseline.volume}
            </div>
          </div>

          {/* AI Adapted Version */}
          <div className="p-4 rounded-xl bg-neon-cyan/5 border border-neon-cyan/30 space-y-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 px-3 py-1 bg-neon-cyan text-obsidian-950 font-mono text-[10px] font-bold rounded-bl-xl">
              96% AI CONFIDENCE
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-neon-cyan">
              <Cpu className="w-3.5 h-3.5" />
              AI Calibrated Version
            </div>
            <h4 className="text-sm font-bold text-white">{currentPlan.adapted.name}</h4>
            <ul className="text-xs space-y-1 text-neon-cyan/90 font-mono">
              {currentPlan.adapted.exercises.map((ex, idx) => (
                <li key={idx}>{ex}</li>
              ))}
            </ul>
            <div className="pt-2 text-[11px] text-neon-emerald font-mono border-t border-neon-cyan/20">
              Total Load Volume: {currentPlan.adapted.volume}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Active Workout Exercise Card (Named as "Exercise" with Weight & Progress Indicator) */}
      <GlassCard glow="cyan" className="space-y-4">
        <div className="flex items-center justify-between border-b border-obsidian-700/60 pb-2">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-neon-cyan" />
            <h3 className="text-sm font-bold text-white">Exercise</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">REST Auto-Sync Enabled</span>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-bold text-white">{currentPlan.exerciseHeaderName}</h4>
                <Badge variant="cyan">{currentPlan.badgeText}</Badge>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Equipment: Dumbbells, Bench • Tempo: 3-1-1-0</p>
            </div>
            <button className="px-3 py-1.5 rounded-lg border border-neon-cyan/40 bg-neon-cyan/10 text-neon-cyan text-xs font-mono flex items-center gap-1.5 self-start sm:self-auto hover:bg-neon-cyan/25 transition-colors">
              <Cpu className="w-3.5 h-3.5" />
              AI Logic (96%)
            </button>
          </div>

          {/* Sets Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="text-slate-400 border-b border-obsidian-800 pb-2">
                  <th className="pb-2 font-medium">SET</th>
                  <th className="pb-2 font-medium">TARGET</th>
                  <th className="pb-2 font-medium">WEIGHT (LBS)</th>
                  <th className="pb-2 font-medium text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-obsidian-800/60">
                {setsState.map((setObj, index) => (
                  <tr key={setObj.id} className="hover:bg-obsidian-900/30">
                    <td className="py-3 font-bold text-white">#{index + 1}</td>
                    <td className="py-3 text-slate-300">{setObj.target}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleWeightChange(setObj.id, -5)}
                          className="w-7 h-7 rounded bg-obsidian-800 border border-obsidian-700 text-slate-300 flex items-center justify-center hover:bg-obsidian-700 hover:text-white transition-colors"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-white font-bold">{setObj.weight}</span>
                        <button
                          onClick={() => handleWeightChange(setObj.id, 5)}
                          className="w-7 h-7 rounded bg-obsidian-800 border border-obsidian-700 text-slate-300 flex items-center justify-center hover:bg-obsidian-700 hover:text-white transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => toggleSetDone(setObj.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-sans font-medium flex items-center gap-1.5 ml-auto transition-all ${setObj.done
                          ? 'bg-neon-emerald/20 text-neon-emerald border border-neon-emerald/40'
                          : 'bg-obsidian-800 text-slate-300 border border-obsidian-700 hover:border-slate-500'
                          }`}
                      >
                        {setObj.done ? '✓ Done' : '✓ Mark'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/apiClient';
import { GlassCard } from '@/shared/components/GlassCard';
import { Badge } from '@/shared/components/Badge';
import { Button } from '@/shared/components/Button';
import {
  Utensils, RefreshCw, Plus, Brain, X, Flame, Clock, ChevronRight,
  Trash2, Check, ShoppingBag, Sparkles, Apple, Beef, Salad
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Meal {
  id: string;
  mealType: string;
  title: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  prepTimeMins: number;
  budgetTier: string;
  ingredients: string[];
  date: string;
}

const MEAL_TABS = [
  { key: 'breakfast', label: 'Breakfast', icon: <Apple className="w-4 h-4" />, color: 'amber' },
  { key: 'lunch', label: 'Lunch', icon: <Salad className="w-4 h-4" />, color: 'emerald' },
  { key: 'dinner', label: 'Dinner', icon: <Beef className="w-4 h-4" />, color: 'violet' },
  { key: 'snack', label: 'Snack', icon: <Utensils className="w-4 h-4" />, color: 'cyan' },
];

const COLOR_MAP: Record<string, string> = {
  amber: '#F59E0B', emerald: '#10B981', violet: '#8B5CF6', cyan: '#00F0FF',
};

// ─── MealCard Component ───────────────────────────────────────────────────────
const MealCard: React.FC<{ meal: Meal; onDelete: (id: string) => void; tabColor: string }> = ({ meal, onDelete, tabColor }) => {
  const [showIngredients, setShowIngredients] = useState(false);
  const borderColor = `border-neon-${tabColor}/30`;
  const bgColor = `bg-neon-${tabColor}/5`;

  return (
    <div className={`rounded-2xl border ${borderColor} ${bgColor} p-4 space-y-3 transition-all hover:scale-[1.01]`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <Badge variant={tabColor as any}>{meal.mealType.toUpperCase()}</Badge>
          <h3 className="text-base font-bold text-white mt-1.5 leading-tight">{meal.title}</h3>
        </div>
        <button
          onClick={() => onDelete(meal.id)}
          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-400/10 transition-all shrink-0"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Macros Row */}
      <div className="grid grid-cols-3 gap-2 py-2 border-y border-obsidian-700/60 font-mono text-center text-xs">
        <div>
          <span className="block text-[10px] text-slate-400 mb-0.5">Protein</span>
          <span className="font-bold text-white">{meal.proteinGrams}g</span>
        </div>
        <div>
          <span className="block text-[10px] text-slate-400 mb-0.5">Carbs</span>
          <span className="font-bold text-white">{meal.carbsGrams}g</span>
        </div>
        <div>
          <span className="block text-[10px] text-slate-400 mb-0.5">Fats</span>
          <span className="font-bold text-white">{meal.fatGrams}g</span>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
        <span className="flex items-center gap-1">
          <Flame className="w-3.5 h-3.5 text-neon-amber" />
          {meal.calories} kcal
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-neon-cyan" />
          {meal.prepTimeMins} min prep
        </span>
        <span className="font-bold" style={{ color: COLOR_MAP[tabColor] }}>{meal.budgetTier}</span>
      </div>

      {/* Ingredients toggle */}
      {meal.ingredients && meal.ingredients.length > 0 && (
        <button
          onClick={() => setShowIngredients(s => !s)}
          className="w-full text-left text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors"
        >
          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showIngredients ? 'rotate-90' : ''}`} />
          {showIngredients ? 'Hide' : 'Show'} ingredients
        </button>
      )}
      {showIngredients && (
        <ul className="space-y-0.5">
          {meal.ingredients.map((ing, i) => (
            <li key={i} className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-emerald inline-block shrink-0" />
              {ing}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// ─── MacrosSummary Component ──────────────────────────────────────────────────
const MacrosSummary: React.FC<{ meals: Meal[] }> = ({ meals }) => {
  const totals = meals.reduce((acc, m) => ({
    calories: acc.calories + m.calories,
    protein: acc.protein + m.proteinGrams,
    carbs: acc.carbs + m.carbsGrams,
    fats: acc.fats + m.fatGrams,
  }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

  const CALORIE_GOAL = 2600;
  const PROTEIN_GOAL = 180;
  const CARBS_GOAL = 250;
  const FATS_GOAL = 80;

  const bars = [
    { label: 'Protein', value: totals.protein, goal: PROTEIN_GOAL, unit: 'g', color: '#00F0FF' },
    { label: 'Carbs', value: totals.carbs, goal: CARBS_GOAL, unit: 'g', color: '#8B5CF6' },
    { label: 'Fats', value: totals.fats, goal: FATS_GOAL, unit: 'g', color: '#F59E0B' },
  ];

  return (
    <GlassCard glow="cyan" className="space-y-4">
      <div className="flex items-center justify-between border-b border-obsidian-700/60 pb-3">
        <div>
          <span className="text-xs font-mono text-neon-cyan uppercase tracking-wider">Daily Macros</span>
          <h3 className="text-base font-bold text-white">Nutrition Summary</h3>
        </div>
        <div className="text-right">
          <span className="block text-2xl font-black text-neon-cyan">{totals.calories}</span>
          <span className="text-xs font-mono text-slate-400">/ {CALORIE_GOAL} kcal</span>
        </div>
      </div>

      {/* Calorie ring */}
      <div className="flex items-center gap-6">
        <div className="relative w-20 h-20 shrink-0">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="32" fill="none" stroke="#1F293D" strokeWidth="8" />
            <circle
              cx="40" cy="40" r="32" fill="none" stroke="#00F0FF" strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 32}`}
              strokeDashoffset={`${2 * Math.PI * 32 * (1 - Math.min(totals.calories / CALORIE_GOAL, 1))}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs font-black text-white">{Math.round((totals.calories / CALORIE_GOAL) * 100)}%</span>
          </div>
        </div>

        <div className="flex-1 space-y-2">
          {bars.map(bar => (
            <div key={bar.label}>
              <div className="flex justify-between text-xs font-mono text-slate-400 mb-0.5">
                <span>{bar.label}</span>
                <span className="text-white font-bold">{bar.value}<span className="text-slate-400 font-normal">/{bar.goal}{bar.unit}</span></span>
              </div>
              <div className="h-1.5 rounded-full bg-obsidian-800">
                <div
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((bar.value / bar.goal) * 100, 100)}%`, backgroundColor: bar.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
};

// ─── CreateMealModal ──────────────────────────────────────────────────────────
const CreateMealModal: React.FC<{
  activeTab: string;
  onClose: () => void;
  onCreated: (meal: Meal) => void;
}> = ({ activeTab, onClose, onCreated }) => {
  const [mode, setMode] = useState<'manual' | 'ai'>('manual');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', calories: '', proteinGrams: '', carbsGrams: '', fatGrams: '',
    prepTimeMins: '10', budgetTier: '$', ingredients: ''
  });

  const handleAIGenerate = async () => {
    setLoading(true);
    try {
      const res = await apiClient.post('/meals/ai-generate', {
        mealType: activeTab, goal: 'Muscle Gain', budget: form.budgetTier
      });
      const data = res.data.data;
      setForm({
        title: data.title,
        calories: String(data.calories),
        proteinGrams: String(data.proteinGrams),
        carbsGrams: String(data.carbsGrams),
        fatGrams: String(data.fatGrams),
        prepTimeMins: String(data.prepTimeMins),
        budgetTier: data.budgetTier,
        ingredients: (data.ingredients || []).join(', ')
      });
      setMode('manual');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setLoading(true);
    try {
      const res = await apiClient.post('/meals', {
        mealType: activeTab,
        title: form.title,
        calories: Number(form.calories),
        proteinGrams: Number(form.proteinGrams),
        carbsGrams: Number(form.carbsGrams),
        fatGrams: Number(form.fatGrams),
        prepTimeMins: Number(form.prepTimeMins),
        budgetTier: form.budgetTier,
        ingredients: form.ingredients.split(',').map(s => s.trim()).filter(Boolean)
      });
      onCreated(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const tabInfo = MEAL_TABS.find(t => t.key === activeTab)!;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-obsidian-900 border border-obsidian-700 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-obsidian-700">
          <div className="flex items-center gap-2">
            <Utensils className="w-5 h-5 text-neon-emerald" />
            <h2 className="text-base font-bold text-white">Add {tabInfo.label}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-obsidian-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin">
          {/* Mode toggle */}
          <div className="flex gap-2 p-1 rounded-xl bg-obsidian-800/60 border border-obsidian-700">
            <button onClick={() => setMode('manual')}
              className={`flex-1 py-2 rounded-lg text-xs font-mono font-bold transition-all ${mode === 'manual' ? 'bg-neon-emerald text-obsidian-950' : 'text-slate-400 hover:text-white'}`}>
              Manual Entry
            </button>
            <button onClick={() => setMode('ai')}
              className={`flex-1 py-2 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1 transition-all ${mode === 'ai' ? 'bg-neon-violet text-white' : 'text-slate-400 hover:text-white'}`}>
              <Brain className="w-3.5 h-3.5" /> AI Generate
            </button>
          </div>

          {mode === 'ai' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">Budget Tier</label>
                <div className="flex gap-2">
                  {['$', '$$', '$$$'].map(b => (
                    <button key={b} onClick={() => setForm(f => ({ ...f, budgetTier: b }))}
                      className={`px-3 py-2 rounded-lg text-xs font-mono font-bold border transition-all ${form.budgetTier === b ? 'bg-neon-violet text-white border-neon-violet' : 'bg-obsidian-800 text-slate-400 border-obsidian-700 hover:text-white'}`}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handleAIGenerate}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-neon-violet text-white font-bold flex items-center justify-center gap-2 hover:bg-neon-violet/90 transition-all disabled:opacity-60"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><Brain className="w-4 h-4" /> Generate {tabInfo.label} Plan</>}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">Meal Name *</label>
                <input
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder={`e.g. ${activeTab === 'breakfast' ? 'Oatmeal & Eggs' : activeTab === 'lunch' ? 'Grilled Chicken Bowl' : 'Salmon & Quinoa'}`}
                  className="w-full px-3 py-2.5 rounded-xl bg-obsidian-950 border border-obsidian-700 text-white text-sm focus:outline-none focus:border-neon-emerald font-mono placeholder-slate-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">Calories</label>
                  <input type="number" value={form.calories} onChange={e => setForm(f => ({ ...f, calories: e.target.value }))}
                    placeholder="kcal" className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-obsidian-700 text-white text-sm focus:outline-none focus:border-neon-emerald font-mono placeholder-slate-600" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">Prep Time (mins)</label>
                  <input type="number" value={form.prepTimeMins} onChange={e => setForm(f => ({ ...f, prepTimeMins: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-obsidian-700 text-white text-sm focus:outline-none focus:border-neon-emerald font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">Protein (g)</label>
                  <input type="number" value={form.proteinGrams} onChange={e => setForm(f => ({ ...f, proteinGrams: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-obsidian-700 text-white text-sm focus:outline-none focus:border-neon-cyan font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">Carbs (g)</label>
                  <input type="number" value={form.carbsGrams} onChange={e => setForm(f => ({ ...f, carbsGrams: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-obsidian-700 text-white text-sm focus:outline-none focus:border-neon-violet font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">Fats (g)</label>
                  <input type="number" value={form.fatGrams} onChange={e => setForm(f => ({ ...f, fatGrams: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-obsidian-700 text-white text-sm focus:outline-none focus:border-neon-amber font-mono" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">Budget</label>
                <div className="flex gap-2">
                  {['$', '$$', '$$$'].map(b => (
                    <button key={b} onClick={() => setForm(f => ({ ...f, budgetTier: b }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${form.budgetTier === b ? 'bg-neon-emerald text-obsidian-950 border-neon-emerald' : 'bg-obsidian-800 text-slate-400 border-obsidian-700 hover:text-white'}`}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">Ingredients (comma-separated)</label>
                <textarea
                  value={form.ingredients}
                  onChange={e => setForm(f => ({ ...f, ingredients: e.target.value }))}
                  placeholder="e.g. 200g chicken breast, 150g brown rice, spinach"
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-obsidian-950 border border-obsidian-700 text-white text-sm focus:outline-none focus:border-neon-emerald font-mono placeholder-slate-600 resize-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {mode === 'manual' && (
          <div className="p-5 border-t border-obsidian-700 flex gap-3">
            <Button onClick={onClose} className="flex-1">Cancel</Button>
            <button
              onClick={handleSave}
              disabled={loading || !form.title.trim()}
              className="flex-1 py-2.5 rounded-xl bg-neon-emerald text-obsidian-950 font-bold text-sm flex items-center justify-center gap-2 hover:bg-neon-emerald/90 transition-all disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4" /> Save Meal</>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Grocery List ─────────────────────────────────────────────────────────────
const GroceryList: React.FC<{ meals: Meal[] }> = ({ meals }) => {
  const [generating, setGenerating] = useState(false);
  const [items, setItems] = useState<string[]>([]);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const generateList = async () => {
    setGenerating(true);
    // Aggregate all ingredients
    const all = meals.flatMap(m => m.ingredients || []);
    await new Promise(r => setTimeout(r, 800)); // simulate
    setItems(all.length > 0 ? [...new Set(all)] : [
      'Organic Chicken Breast 1.5kg', 'Rolled Whole Grain Oats 1kg',
      'Whey Isolate Protein (Vanilla)', 'Wild Blueberries 500g',
      'Organic Quinoa 500g', 'Wild Salmon Fillets 800g',
      'Fresh Asparagus & Broccoli', 'Avocados (Bag of 5)',
    ]);
    setGenerating(false);
  };

  return (
    <GlassCard glow="emerald" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-obsidian-700/60 pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-neon-emerald" />
            Grocery List
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-0.5">Auto-generated from today's meal plan</p>
        </div>
        <button
          onClick={generateList}
          disabled={generating}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neon-emerald text-obsidian-950 font-bold text-sm hover:bg-neon-emerald/90 transition-all disabled:opacity-60 shrink-0"
        >
          {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><Sparkles className="w-4 h-4" /> Generate List</>}
        </button>
      </div>

      {items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {items.map((item, i) => (
            <div
              key={i}
              onClick={() => setChecked(prev => ({ ...prev, [item]: !prev[item] }))}
              className={`p-3 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-all ${checked[item]
                ? 'bg-neon-emerald/10 border-neon-emerald/30 opacity-60'
                : 'bg-obsidian-900/60 border-obsidian-700 hover:border-neon-emerald/40'
                }`}
            >
              <span className={`text-xs font-mono ${checked[item] ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                {item}
              </span>
              <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all ${checked[item] ? 'bg-neon-emerald border-neon-emerald' : 'border-obsidian-600'}`}>
                {checked[item] && <Check className="w-3 h-3 text-obsidian-950" />}
              </div>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
};

// ─── Main Meals Page ──────────────────────────────────────────────────────────
export default function MealsPage() {
  const [activeTab, setActiveTab] = useState('breakfast');
  const [allMeals, setAllMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchMeals = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get('/meals', { params: { date: today } });
        setAllMeals(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (e) {
        console.error(e);
        setAllMeals([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, []);

  const tabMeals = allMeals.filter(m => m.mealType === activeTab);
  const tabInfo = MEAL_TABS.find(t => t.key === activeTab)!;

  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/meals/${id}`);
      setAllMeals(prev => prev.filter(m => m.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreated = (meal: Meal) => {
    setAllMeals(prev => [...prev, meal]);
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-3">
        <RefreshCw className="w-8 h-8 text-neon-emerald animate-spin" />
        <p className="text-sm font-mono text-slate-400">Fetching nutrition plan...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-obsidian-900 via-obsidian-800 to-obsidian-900 border border-obsidian-700/80 shadow-glass">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-neon-emerald" />
            <span className="text-xs font-mono text-neon-emerald uppercase tracking-wider">Nutrition Engine</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Utensils className="w-6 h-6 text-neon-emerald" />
            Today's Meal Plan
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            {today} · {allMeals.length} meal{allMeals.length !== 1 ? 's' : ''} logged
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neon-emerald text-obsidian-950 font-bold text-sm hover:bg-neon-emerald/90 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Meal
        </button>
      </div>

      {/* ── Macros Summary ── */}
      {allMeals.length > 0 && <MacrosSummary meals={allMeals} />}

      {/* ── Tabs ── */}
      <div className="flex items-center gap-1 p-1 rounded-2xl bg-obsidian-800/80 border border-obsidian-700 overflow-x-auto scrollbar-none">
        {MEAL_TABS.map(tab => {
          const count = allMeals.filter(m => m.mealType === tab.key).length;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex-1 justify-center ${activeTab === tab.key
                ? `bg-neon-${tab.color}/20 text-neon-${tab.color} border border-neon-${tab.color}/40`
                : 'text-slate-400 hover:text-white'
                }`}
            >
              {tab.icon}
              {tab.label}
              {count > 0 && (
                <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-mono ${activeTab === tab.key ? `bg-neon-${tab.color} text-obsidian-950` : 'bg-obsidian-700 text-slate-400'}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Tab Content ── */}
      <div>
        {tabMeals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tabMeals.map(meal => (
              <MealCard key={meal.id} meal={meal} onDelete={handleDelete} tabColor={tabInfo.color} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 space-y-4 rounded-2xl border border-dashed border-obsidian-700">
            <div className={`w-14 h-14 rounded-2xl bg-neon-${tabInfo.color}/10 border border-neon-${tabInfo.color}/20 flex items-center justify-center`}>
              {tabInfo.icon}
            </div>
            <div className="text-center">
              <p className="text-white font-bold">No {tabInfo.label} logged yet</p>
              <p className="text-xs text-slate-400 font-mono mt-1">Add a meal manually or let AI generate one for you</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all bg-neon-${tabInfo.color}/10 border border-neon-${tabInfo.color}/30 text-neon-${tabInfo.color} hover:bg-neon-${tabInfo.color}/20`}
            >
              <Plus className="w-4 h-4" /> Add {tabInfo.label}
            </button>
          </div>
        )}
      </div>

      {/* ── Grocery List ── */}
      <GroceryList meals={allMeals} />

      {/* ── Modal ── */}
      {showModal && (
        <CreateMealModal
          activeTab={activeTab}
          onClose={() => setShowModal(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  );
}
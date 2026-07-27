'use client';

import React, { useState } from 'react';
import { useMealPlan, useGenerateGroceryList } from '@/features/meals/hooks/useMeals';
import { MealCard } from '@/features/meals/components/MealCard';
import { GlassCard } from '@/shared/components/GlassCard';
import { Button } from '@/shared/components/Button';
import { Badge } from '@/shared/components/Badge';
import { Utensils, RefreshCw, ShoppingBag, Check, Sparkles } from 'lucide-react';

export default function MealsPage() {
  const [selectedBudget, setSelectedBudget] = useState<string | undefined>(undefined);
  const { data: meals, isLoading, isError, refetch } = useMealPlan(selectedBudget);
  const groceryMutation = useGenerateGroceryList();
  const [groceryItems, setGroceryItems] = useState<string[]>([]);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const handleGenerateGrocery = async () => {
    try {
      const res = await groceryMutation.mutateAsync();
      const mockItems = [
        'Organic Chicken Breast 1.5kg',
        'Rolled Whole Grain Oats 1kg',
        'Whey Isolate Protein (Vanilla)',
        'Wild Blueberries 500g',
        'Organic Quinoa 500g',
        'Wild Salmon Fillets 800g',
        'Fresh Asparagus & Broccoli',
        'Avocados (Bag of 5)',
      ];
      setGroceryItems(mockItems);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleItem = (item: string) => {
    setCheckedItems((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-3">
        <RefreshCw className="w-8 h-8 text-neon-emerald animate-spin" />
        <p className="text-sm font-mono text-slate-400">Fetching nutrition plan via REST /api/v1/meals...</p>
      </div>
    );
  }

  if (isError || !meals) {
    return (
      <div className="p-6 text-center space-y-3">
        <p className="text-rose-400 font-mono text-sm">Failed to load meal plan.</p>
        <Button onClick={() => refetch()}>Retry REST Fetch</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-obsidian-900 via-obsidian-800 to-obsidian-900 border border-obsidian-700/80 shadow-glass">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Utensils className="w-6 h-6 text-neon-emerald" />
            Anabolic Meal Plan & Grocery Generator
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Macronutrient-tailored meals matched to your daily 2,600 kcal hypertrophy target.
          </p>
        </div>

        {/* Budget Filter */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-obsidian-800/80 border border-obsidian-700">
          {['all', '$', '$$', '$$$'].map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedBudget(tier === 'all' ? undefined : tier)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                (tier === 'all' && !selectedBudget) || selectedBudget === tier
                  ? 'bg-neon-emerald text-obsidian-950 shadow-neon-emerald/30 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tier === 'all' ? 'All Tiers' : tier}
            </button>
          ))}
        </div>
      </div>

      {/* Meals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {meals.map((meal) => (
          <MealCard key={meal.id} meal={meal} />
        ))}
      </div>

      {/* Grocery List Generator */}
      <GlassCard glow="emerald" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-obsidian-700/60 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-neon-emerald" />
              Smart Grocery List Generator
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              1-click generates checkable shopping items via REST POST /api/v1/grocery-list.
            </p>
          </div>
          <Button variant="emerald" onClick={handleGenerateGrocery} disabled={groceryMutation.isPending}>
            <Sparkles className="w-4 h-4" />
            {groceryMutation.isPending ? 'Generating...' : 'Generate Grocery List'}
          </Button>
        </div>

        {groceryItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            {groceryItems.map((item, idx) => {
              const isChecked = checkedItems[item];
              return (
                <div
                  key={idx}
                  onClick={() => toggleItem(item)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isChecked
                      ? 'bg-neon-emerald/10 border-neon-emerald/40 text-slate-400 line-through'
                      : 'bg-obsidian-900/80 border-obsidian-700/80 text-white hover:border-neon-emerald/40'
                  }`}
                >
                  <span className="text-xs font-mono">{item}</span>
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                      isChecked
                        ? 'bg-neon-emerald border-neon-emerald text-obsidian-950'
                        : 'border-obsidian-600 bg-obsidian-800'
                    }`}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </GlassCard>
    </div>
  );
}

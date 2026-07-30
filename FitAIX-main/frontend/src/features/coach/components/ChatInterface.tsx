'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/shared/components/GlassCard';
import { Button } from '@/shared/components/Button';
import { Badge } from '@/shared/components/Badge';
import { ChatMessage } from '../types';
import { useSendChatMessage } from '../hooks/useCoach';
import { useAppStore } from '@/lib/store';
import { Bot, User, Send, Mic, Volume2, Sparkles, Zap, Luggage } from 'lucide-react';

export const ChatInterface: React.FC = () => {
  const { scenarioMode, setScenarioMode, setMicroWorkoutOpen } = useAppStore();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'rachel',
      text: "Hello Alex! I'm Rachel, your Neural AI Performance Coach. I've synced your HRV (68ms) and morning readiness score (88%). How can I adapt your session today?",
      timestamp: '12:50 PM',
      aiConfidence: 99,
      actionCards: [
        { id: 'ac-2', title: '7-Min Micro Workout', description: 'Quick streak save session', actionType: 'trigger_micro_workout' }
      ]
    }
  ]);

  const sendMutation = useSendChatMessage();

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInput('');

    // Call REST endpoint POST /chat via React Query mutation
    try {
      const response = await sendMutation.mutateAsync(textToSend);
      setMessages((prev) => [...prev, response]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAction = (type: string) => {
    if (type === 'trigger_micro_workout') {
      setMicroWorkoutOpen(true);
    }
  };

  return (
    <GlassCard glow="violet" className="flex flex-col h-[calc(100vh-175px)] md:h-[650px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-obsidian-700/60 pb-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-neon-violet/20 border border-neon-violet/40 text-neon-violet">
            <Bot className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-emerald opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-neon-emerald"></span>
            </span>
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Coach Rachel
              <Badge variant="violet" glow>Neural AI</Badge>
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-400 font-mono">Context: 88% Recovery • {scenarioMode.toUpperCase()} Mode</p>
          </div>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${msg.sender === 'user'
                  ? 'bg-neon-cyan text-obsidian-950 font-bold'
                  : 'bg-neon-violet/20 text-neon-violet border border-neon-violet/40'
                }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className={`space-y-2 max-w-[90%] sm:max-w-[80%] ${msg.sender === 'user' ? 'text-right' : ''}`}>
              <div
                className={`p-3.5 rounded-2xl text-sm leading-relaxed ${msg.sender === 'user'
                    ? 'bg-neon-cyan/20 border border-neon-cyan/40 text-white rounded-tr-none'
                    : 'bg-obsidian-900/90 border border-obsidian-700 text-slate-200 rounded-tl-none'
                  }`}
              >
                {msg.text}
              </div>

              {/* Action Cards */}
              {msg.actionCards && msg.actionCards.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {msg.actionCards.map((card) => (
                    <button
                      key={card.id}
                      onClick={() => handleAction(card.actionType)}
                      className="p-2.5 rounded-xl bg-obsidian-800/80 border border-obsidian-700 hover:border-neon-violet/50 text-left transition-all group cursor-pointer"
                    >
                      <div className="flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-neon-violet">
                        <Zap className="w-3.5 h-3.5 text-neon-violet" />
                        <span>{card.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{card.description}</p>
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono px-1">
                <span>{msg.timestamp}</span>
                {msg.aiConfidence && <span className="text-neon-cyan">AI Confidence: {msg.aiConfidence}%</span>}
              </div>
            </div>
          </div>
        ))}

        {sendMutation.isPending && (
          <div className="flex items-center gap-2 text-xs text-neon-violet font-mono animate-pulse">
            <Bot className="w-4 h-4" />
            <span>Rachel is formulating neural adaptation response...</span>
          </div>
        )}
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto py-2 scrollbar-none border-t border-obsidian-700/40">

        <button
          onClick={() => handleSend("I only have 20 minutes today")}
          className="px-3 py-1 rounded-full bg-obsidian-800/80 border border-obsidian-700 text-xs text-slate-300 hover:text-white hover:border-neon-cyan shrink-0 cursor-pointer"
        >
          ⚡ I only have 20 mins
        </button>
        <button
          onClick={() => handleSend("Reduce leg volume due to fatigue")}
          className="px-3 py-1 rounded-full bg-obsidian-800/80 border border-obsidian-700 text-xs text-slate-300 hover:text-white hover:border-neon-cyan shrink-0 cursor-pointer"
        >
          🍗 Lower leg load
        </button>
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 pt-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Coach Rachel to modify load, swap exercises, or set goals..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-obsidian-900 border border-obsidian-700 text-sm text-white focus:outline-none focus:border-neon-violet placeholder-slate-500 font-mono"
        />
        <Button variant="violet" type="submit" disabled={sendMutation.isPending}>
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </GlassCard>
  );
};

'use client';

import { useEffect, useRef, useState } from 'react';
import { Bot, MessageCircle, Send, X } from 'lucide-react';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  text: string;
}

const QUICK_REPLIES = [
  'How do I book a room?',
  'What areas are available?',
  'How does roommate matching work?',
  'Is my payment secure?',
];

const FAQ_RESPONSES: Record<string, string> = {
  'how do i book': 'To book a room on Roomly:\n1. Browse listings at /services\n2. Click "View listing" on a room you like\n3. Choose your preferred move-in date\n4. Submit a booking request with a message\n5. Once the landlord confirms, you can pay via SSLCommerz.',
  'payment': 'Roomly uses SSLCommerz for all transactions — supporting bKash, Nagad, net banking, and cards. Your payment is only charged after the landlord confirms your booking.',
  'roommate': "Roommate matching uses your profile data (budget, lifestyle, sleep schedule, preferred areas) to find compatible co-tenants. Go to Dashboard → Roommates to see your matches.",
  'area': 'Roomly has listings across Dhaka, including Dhanmondi, Gulshan, Banani, Mirpur, Mohammadpur, Uttara, Bashundhara, and more. Use the search filter on the listings page to find your preferred area.',
  'verified': "Verified hosts have been checked by the Roomly team. Look for the green 'Verified' badge on listing cards and profiles.",
  'register': 'Sign up at /register. Choose Tenant to find rooms or Landlord to list your space. It takes under a minute!',
  'cancel': 'You can withdraw a pending booking request from your tenant dashboard before the landlord confirms it. Once confirmed, contact Roomly support.',
  'list': 'Register as a Landlord, complete your profile, then go to Provider Dashboard → Listings → Add a listing. Your listing will be live after submission.',
  'price': 'Listing on Roomly is completely free! Tenants pay only the agreed rent and deposit once a booking is confirmed.',
  'contact': 'Reach us at hello@roomly.app, call +880 1700-000000, or use the Contact page for detailed support.',
};

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const [key, response] of Object.entries(FAQ_RESPONSES)) {
    if (lower.includes(key)) return response;
  }
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return "Hi there! 👋 I'm Roomly's AI assistant. I can help you with bookings, payments, roommate matching, and more. What would you like to know?";
  }
  return "I'm not sure about that specific question, but I can help you with:\n• Booking a room\n• Payment questions\n• Roommate matching\n• Listing your property\n• Contact info\n\nTry asking one of those topics, or visit our Contact page for personalized help!";
}

export function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: 'assistant', text: "Hi! 👋 I'm Roomly's AI assistant. Ask me anything about finding rooms, bookings, payments, or roommate matching!" },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(1);

  useEffect(() => {
    if (open) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: idRef.current++, role: 'user', text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = getResponse(text);
      setMessages((prev) => [...prev, { id: idRef.current++, role: 'assistant', text: reply }]);
      setIsTyping(false);
    }, 800 + Math.random() * 400);
  };

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        aria-label="Open AI chat assistant"
        onClick={() => setOpen(true)}
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-soft transition hover:bg-primary-600 ${open ? 'hidden' : 'flex'}`}
      >
        <MessageCircle size={24} className="text-white" />
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">AI</span>
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 flex w-[360px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.18)] dark:border-slate-700 dark:bg-slate-800">
          {/* Header */}
          <div className="flex items-center justify-between bg-primary px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                <Bot size={18} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Roomly AI Assistant</p>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-300" />
                  <span className="text-xs text-primary-100">Online</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[340px]">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                    <Bot size={14} />
                  </div>
                )}
                <div
                  className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-line leading-6 ${
                    msg.role === 'user'
                      ? 'rounded-br-sm bg-primary text-white'
                      : 'rounded-bl-sm bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="mr-2 mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary-50 text-primary-600 dark:bg-primary-900/30">
                  <Bot size={14} />
                </div>
                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm bg-slate-100 px-4 py-3 dark:bg-slate-700">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:0ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies */}
          {messages.length <= 2 && (
            <div className="flex flex-wrap gap-2 border-t border-slate-100 px-4 py-3 dark:border-slate-700">
              {QUICK_REPLIES.map((reply) => (
                <button
                  key={reply}
                  type="button"
                  onClick={() => sendMessage(reply)}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="flex items-center gap-2 border-t border-slate-100 px-4 py-3 dark:border-slate-700">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
              placeholder="Ask me anything…"
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-primary-400 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
              disabled={isTyping}
            />
            <button
              type="button"
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isTyping}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white transition hover:bg-primary-600 disabled:opacity-40"
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

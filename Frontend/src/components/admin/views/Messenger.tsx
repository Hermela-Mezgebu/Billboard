"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Send,
  Search,
  CheckCircle2,
  Paperclip,
  MoreVertical,
  Flag,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ✅ REAL API
import {
  getConversations,
  getMessages,
  sendMessage
} from "@/lib/api";

export function Messenger() {

const [activeChat, setActiveChat] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const [chats, setChats] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);

  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const [search, setSearch] = useState("");

  // ✅ LOAD CONVERSATIONS
  useEffect(() => {
    const loadChats = async () => {
      try {
        const data = await getConversations();

        const mapped = (data || []).map((c: any) => ({
          id: Number(c.id),
          name: c.clientName,
          company: c.company,
          lastMsg: c.lastMessage?.text || "No messages yet",
          time: c.lastMessage?.time || "",
        }));

        setChats(mapped);
        setActiveChat(mapped[0]?.id || null);

      } catch (err) {
        console.error("Chats error:", err);
      } finally {
        setLoadingChats(false);
      }
    };

    loadChats();
  }, []);

  // ✅ LOAD MESSAGES WHEN CHAT CHANGES
  useEffect(() => {
    if (!activeChat) return;

    const loadMessages = async () => {
      setLoadingMessages(true);
      try {
        const data = await getMessages(activeChat);

        const mapped = (data || []).map((m: any) => ({
          id: m.id,
          text: m.text,
          sender: m.sender === "admin" ? "admin" : "client",
          time: new Date(m.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          })
        }));

        setMessages(mapped);

      } catch (err) {
        console.error("Messages error:", err);
      } finally {
        setLoadingMessages(false);
      }
    };

    loadMessages();
  }, [activeChat]);

  // ✅ SEND MESSAGE
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !activeChat) return;

    const newMsg = {
      id: Date.now(),
      text: message,
      sender: "admin",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })
    };

    // optimistic UI
    setMessages(prev => [...prev, newMsg]);
    setMessage("");

    try {
      await sendMessage(activeChat, message);
    } catch (err) {
      console.error("Send error:", err);
    }
  };

  // ✅ SEARCH FILTER
  const filteredChats = chats.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.company?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-[calc(100vh-180px)] flex bg-white dark:bg-brand-card rounded-[2.5rem] border shadow-xl overflow-hidden"
    >

      {/* SIDEBAR */}
      <div className="w-80 border-r flex flex-col">

        <div className="p-6 border-b bg-slate-50/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations..."
              className="w-full bg-white border rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>
        </div>

        <div className="grow overflow-y-auto">
          {loadingChats ? (
            <p className="p-6 text-sm text-slate-400">Loading chats...</p>
          ) : filteredChats.length === 0 ? (
            <p className="p-6 text-sm text-slate-400">No conversations</p>
          ) : filteredChats.map(chat => (
            <button
              key={chat.id}
              onClick={() => setActiveChat(Number(chat.id))}
              className={cn(
                "w-full p-4 flex gap-4 border-b text-left",
                activeChat === chat.id
                  ? "bg-indigo-50 border-l-4 border-l-indigo-600"
                  : "hover:bg-slate-50"
              )}
            >
              <div className="h-12 w-12 rounded-xl bg-slate-200 flex items-center justify-center font-bold">
                {chat.name?.[0]}
              </div>

              <div className="grow">
                <div className="flex justify-between">
                  <h4 className="text-sm font-black truncate">{chat.name}</h4>
                  <span className="text-[10px] text-slate-400">{chat.time}</span>
                </div>
                <p className="text-xs text-slate-500 truncate">{chat.lastMsg}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* CHAT AREA */}
      {activeChat ? (
        <div className="grow flex flex-col bg-slate-50/30">

          {/* HEADER */}
          <div className="p-6 bg-white border-b flex justify-between">
            <h3 className="text-sm font-black uppercase">Conversation</h3>
            <div className="flex gap-2">
              <button className="p-2"><Flag size={18} /></button>
              <button className="p-2"><MoreVertical size={18} /></button>
            </div>
          </div>

          {/* MESSAGES */}
          <div className="grow overflow-y-auto p-8 space-y-6">
            {loadingMessages ? (
              <p className="text-sm text-slate-400">Loading messages...</p>
            ) : messages.length === 0 ? (
              <p className="text-sm text-slate-400">No messages yet</p>
            ) : messages.map(msg => (
              <div
                key={msg.id}
                className={cn(
                  "flex flex-col max-w-[70%]",
                  msg.sender === 'admin' ? "ml-auto items-end" : "items-start"
                )}
              >
                <div className={cn(
                  "px-5 py-3 rounded-2xl text-sm",
                  msg.sender === 'admin'
                    ? "bg-indigo-600 text-white"
                    : "bg-white border"
                )}>
                  {msg.text}
                </div>

                <div className="flex gap-2 mt-1 text-[10px] text-slate-400">
                  {msg.time}
                  {msg.sender === 'admin' && <CheckCircle2 size={12} />}
                </div>
              </div>
            ))}
          </div>

          {/* INPUT */}
          <div className="p-6 bg-white border-t">
            <form
              onSubmit={handleSend}
              className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border"
            >
              <button type="button" className="p-2">
                <Paperclip size={18} />
              </button>

              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type message..."
                className="grow bg-transparent outline-none text-sm"
              />

              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center gap-2"
              >
                Send <Send size={14} />
              </button>
            </form>
          </div>

        </div>
      ) : (
        <div className="grow flex flex-col items-center justify-center text-center">
          <MessageSquare size={40} className="text-slate-300 mb-4" />
          <p className="text-sm text-slate-400">Select a conversation</p>
        </div>
      )}

    </motion.div>
  );
}
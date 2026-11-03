import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Phone,
  Video,
  Mic,
  MicOff,
  VideoOff,
  Monitor,
  PhoneOff,
  Send,
  Paperclip,
  Smile,
  Search,
  Check,
  CheckCheck,
  User as UserIcon,
  Volume2,
} from 'lucide-react';
import { Message, Conversation, User } from '../../types';
import { usePlatform } from '../../context/PlatformContext';
import { useAuth, DEMO_USERS } from '../../context/AuthContext';

interface ConnectModuleProps {
  initialChatUserId?: string;
}

export const ConnectModule: React.FC<ConnectModuleProps> = ({ initialChatUserId }) => {
  const { currentUser } = useAuth();
  const { conversations, messages, sendMessage } = usePlatform();

  const [activeConversationId, setActiveConversationId] = useState<string>(
    conversations[0]?.id || 'conv-001'
  );
  const [inputText, setInputText] = useState('');
  const [searchContact, setSearchContact] = useState('');

  // Voice message simulation
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [audioSeconds, setAudioSeconds] = useState(0);

  // Calling Modal state
  const [activeCall, setActiveCall] = useState<{
    type: 'audio' | 'video';
    participantName: string;
    participantAvatar: string;
    status: 'ringing' | 'connected';
    duration: number;
    isMuted: boolean;
    isVideoOff: boolean;
    isScreenSharing: boolean;
  } | null>(null);

  // If initialChatUserId was passed, pick or create conv
  useEffect(() => {
    if (initialChatUserId) {
      const existing = conversations.find((c) =>
        c.participantIds.includes(initialChatUserId)
      );
      if (existing) {
        setActiveConversationId(existing.id);
      }
    }
  }, [initialChatUserId, conversations]);

  // Call timer effect
  useEffect(() => {
    let timer: any;
    if (activeCall && activeCall.status === 'connected') {
      timer = setInterval(() => {
        setActiveCall((prev) => (prev ? { ...prev, duration: prev.duration + 1 } : null));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeCall?.status]);

  const activeConv = conversations.find((c) => c.id === activeConversationId);
  const otherParticipantId = activeConv?.participantIds.find((id) => id !== currentUser.id);
  const otherUser = DEMO_USERS.find((u) => u.id === otherParticipantId) || DEMO_USERS[1];

  const currentMessages = messages.filter((m) => m.conversationId === activeConversationId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(activeConversationId, inputText.trim());
    setInputText('');
  };

  const handleSendVoiceNote = () => {
    sendMessage(
      activeConversationId,
      `Ovozli xabar (${audioSeconds} soniya)`,
      undefined,
      'audio'
    );
    setIsRecordingAudio(false);
    setAudioSeconds(0);
  };

  const startCall = (type: 'audio' | 'video') => {
    setActiveCall({
      type,
      participantName: otherUser.name,
      participantAvatar: otherUser.avatar,
      status: 'ringing',
      duration: 0,
      isMuted: false,
      isVideoOff: false,
      isScreenSharing: false,
    });

    // Simulate answer after 2.5 seconds
    setTimeout(() => {
      setActiveCall((prev) => (prev ? { ...prev, status: 'connected' } : null));
    }, 2200);
  };

  const formatCallTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative rounded-2xl bg-[#090e1a] border border-slate-800 h-[640px] flex overflow-hidden shadow-2xl">
      {/* Left Chat List (4 cols) */}
      <div className="w-80 border-r border-slate-800 bg-[#0a1222] flex flex-col shrink-0">
        {/* Search Header */}
        <div className="p-4 border-b border-slate-800">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchContact}
              onChange={(e) => setSearchContact(e.target.value)}
              placeholder="Suhbatlar va kontaktlarni qidirish..."
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
          {conversations.map((conv) => {
            const pId = conv.participantIds.find((id) => id !== currentUser.id);
            const user = DEMO_USERS.find((u) => u.id === pId) || DEMO_USERS[0];
            const isSelected = conv.id === activeConversationId;

            return (
              <div
                key={conv.id}
                onClick={() => setActiveConversationId(conv.id)}
                className={`p-3.5 flex items-center gap-3 cursor-pointer transition select-none ${
                  isSelected ? 'bg-indigo-950/40 border-l-2 border-indigo-500' : 'hover:bg-slate-900/60'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-700"
                  />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute bottom-0 right-0 border-2 border-[#0a1222]" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-200 truncate">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {conv.lastMessageTime || '14:20'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {conv.lastMessage || 'Salom, aloqadaman'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Chat Thread */}
      <div className="flex-1 flex flex-col bg-[#070b14]">
        {/* Thread Top Bar */}
        <div className="px-6 py-3.5 border-b border-slate-800 bg-[#0d1424] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={otherUser.avatar}
                alt={otherUser.name}
                className="w-9 h-9 rounded-full object-cover border border-slate-700"
              />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute bottom-0 right-0 border-2 border-slate-900" />
            </div>

            <div>
              <div className="font-semibold text-xs text-slate-100 flex items-center gap-1.5">
                {otherUser.name}
                <span className="text-slate-400 font-mono text-[11px]">({otherUser.username})</span>
              </div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Tarmoqda (Online) • Nexora ID: {otherUser.nexoraId}
              </div>
            </div>
          </div>

          {/* Audio & Video Call Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => startCall('audio')}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              title="Ovozli qo‘ng‘iroq (Audio Call)"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
            </button>
            <button
              onClick={() => startCall('video')}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              title="Video qo‘ng‘iroq (Video Call)"
            >
              <Video className="w-4 h-4 text-indigo-400" />
            </button>
          </div>
        </div>

        {/* Message Bubble Thread */}
        <div className="flex-1 p-6 overflow-y-auto space-y-3.5">
          {currentMessages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;

            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2.5 ${isMe ? 'flex-row-reverse' : ''}`}
              >
                {!isMe && (
                  <img
                    src={msg.senderAvatar}
                    alt={msg.senderName}
                    className="w-7 h-7 rounded-full object-cover shrink-0"
                  />
                )}

                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-xs shadow-md space-y-1 ${
                    isMe
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-slate-800/90 text-slate-200 border border-slate-700 rounded-bl-none'
                  }`}
                >
                  {msg.attachmentType === 'audio' ? (
                    <div className="flex items-center gap-2.5 py-1">
                      <Volume2 className="w-4 h-4 text-amber-300 shrink-0" />
                      <div className="flex items-center gap-1">
                        {[40, 70, 90, 50, 30, 80, 60, 45, 95, 35].map((h, i) => (
                          <div
                            key={i}
                            className="w-1 bg-white/70 rounded-full"
                            style={{ height: `${h / 4}px` }}
                          />
                        ))}
                      </div>
                      <span className="font-mono text-[10px] opacity-80">{msg.text}</span>
                    </div>
                  ) : (
                    <p className="leading-relaxed text-[13px]">{msg.text}</p>
                  )}

                  <div className="flex items-center justify-end gap-1 text-[10px] opacity-75">
                    <span>{msg.createdAt}</span>
                    {isMe && <CheckCheck className="w-3.5 h-3.5 text-cyan-300" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Message Input Bar */}
        <div className="p-3 border-t border-slate-800 bg-[#0c1322] shrink-0">
          {isRecordingAudio ? (
            <div className="flex items-center justify-between p-2 rounded-xl bg-rose-950/40 border border-rose-800 text-xs text-rose-200 animate-pulse">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-rose-400" />
                <span>Ovoz yozilmoqda: {audioSeconds}s...</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsRecordingAudio(false)}
                  className="px-2.5 py-1 rounded bg-slate-800 text-slate-300"
                >
                  Bekor
                </button>
                <button
                  onClick={handleSendVoiceNote}
                  className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded font-semibold"
                >
                  Yuborish
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsRecordingAudio(true);
                  setAudioSeconds(3);
                }}
                className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
                title="Ovozli xabar yozish"
              >
                <Mic className="w-4 h-4 text-indigo-400" />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Xabaringizni yozing..."
                className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* AUDIO / VIDEO CALL OVERLAY MODAL */}
      {activeCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-[#0a1222] border border-slate-700 rounded-3xl p-6 text-center text-slate-100 space-y-6 shadow-2xl">
            {/* Header info */}
            <div>
              <span className="text-xs uppercase font-mono tracking-wider text-cyan-400 font-semibold">
                NEXORA CONNECT {activeCall.type.toUpperCase()} CALL
              </span>
              <div className="text-xs text-slate-400 mt-1">
                {activeCall.status === 'ringing'
                  ? 'Gudok ketmoqda (Ringing)...'
                  : `Ulangan • Davomiyligi: ${formatCallTime(activeCall.duration)}`}
              </div>
            </div>

            {/* Avatar / Video Viewport */}
            <div className="relative w-44 h-44 mx-auto rounded-3xl overflow-hidden border-2 border-indigo-500/50 shadow-2xl bg-black flex items-center justify-center">
              {activeCall.type === 'video' && !activeCall.isVideoOff ? (
                <img
                  src={activeCall.participantAvatar}
                  alt={activeCall.participantName}
                  className="w-full h-full object-cover scale-110 blur-[1px]"
                />
              ) : (
                <div className="space-y-2">
                  <UserIcon className="w-16 h-16 text-slate-500 mx-auto" />
                  <div className="text-xs text-slate-400">Kamera o‘chirilgan</div>
                </div>
              )}

              {/* Status beacon */}
              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/75 text-[10px] font-mono text-emerald-400">
                P2P WebRTC HD
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">{activeCall.participantName}</h3>
              <p className="text-xs text-slate-400">Nexora Global Encrypted Voice & Video</p>
            </div>

            {/* Call Controls */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() =>
                  setActiveCall({ ...activeCall, isMuted: !activeCall.isMuted })
                }
                className={`p-3.5 rounded-full transition ${
                  activeCall.isMuted
                    ? 'bg-rose-950 text-rose-300 border border-rose-700'
                    : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}
                title="Mikrofonni o‘chirish/yoqish"
              >
                {activeCall.isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {activeCall.type === 'video' && (
                <button
                  onClick={() =>
                    setActiveCall({ ...activeCall, isVideoOff: !activeCall.isVideoOff })
                  }
                  className={`p-3.5 rounded-full transition ${
                    activeCall.isVideoOff
                      ? 'bg-rose-950 text-rose-300 border border-rose-700'
                      : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                  }`}
                  title="Kamerani o‘chirish/yoqish"
                >
                  {activeCall.isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                </button>
              )}

              <button
                onClick={() =>
                  setActiveCall({
                    ...activeCall,
                    isScreenSharing: !activeCall.isScreenSharing,
                  })
                }
                className={`p-3.5 rounded-full transition ${
                  activeCall.isScreenSharing
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-700'
                    : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}
                title="Ekranni ulashish"
              >
                <Monitor className="w-5 h-5" />
              </button>

              {/* End Call Button */}
              <button
                onClick={() => setActiveCall(null)}
                className="p-3.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-xl shadow-rose-900/40 transition"
                title="Qo‘ng‘iroqni yakunlash"
              >
                <PhoneOff className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

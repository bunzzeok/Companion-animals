'use client'

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { chatAPI, apiUtils } from '../../../lib/api';
import { useAuth } from '../../../hooks/useAuth';
import { 
  Heart, 
  ArrowLeft, 
  Send, 
  Paperclip, 
  Phone, 
  Video,
  MoreVertical,
  Image as ImageIcon,
  Smile,
  CheckCheck,
  Clock,
  MapPin,
  Info
} from 'lucide-react';

// Interfaces (compatible with API)
interface Message {
  _id: string;
  content: string;
  type: 'text' | 'image' | 'system';
  sender: {
    _id: string;
    name: string;
    profileImage?: string;
  };
  chatRoom: string;
  readBy: {
    user: string;
    readAt: string;
  }[];
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

interface ChatRoom {
  _id: string;
  type: 'private' | 'group';
  participants: {
    _id: string;
    name: string;
    profileImage?: string;
    isOnline?: boolean;
  }[];
  relatedPet?: {
    _id: string;
    name: string;
    images: string[];
  };
  lastMessage?: {
    content: string;
    sender: string;
    createdAt: string;
  };
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
}

// Individual chat page component
export default function ChatDetailPage() {
  const params = useParams();
  const chatId = params.id as string;
  const { user, isAuthenticated } = useAuth();
  
  // State management
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showPetInfo, setShowPetInfo] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

  // Load chat room and messages on component mount
  useEffect(() => {
    if (chatId && isAuthenticated) {
      loadChatRoom(chatId);
      loadMessages(chatId);
    }
  }, [chatId, isAuthenticated]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load specific chat room
  const loadChatRoom = async (roomId: string) => {
    try {
      setLoading(true);
      
      const response = await chatAPI.getChatRoom(roomId);
      
      if (apiUtils.isSuccess(response)) {
        const roomData = apiUtils.getData(response);
        setChatRoom(roomData);
      } else {
        console.error('Failed to load chat room');
        setChatRoom(null);
      }
    } catch (error) {
      console.error('Failed to load chat room:', error);
      setChatRoom(null);
    } finally {
      setLoading(false);
    }
  };

  // Load messages for the chat room
  const loadMessages = async (roomId: string) => {
    try {
      const response = await chatAPI.getMessages(roomId, { page: 1, limit: 50 });
      
      if (apiUtils.isSuccess(response)) {
        const messagesData = apiUtils.getData(response) || [];
        setMessages(messagesData);
      } else {
        console.error('Failed to load messages');
        setMessages([]);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
      setMessages([]);
    }
  };

  // Send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !chatRoom || !user) return;
    
    try {
      const messageData = new FormData();
      messageData.append('content', newMessage.trim());
      messageData.append('type', 'text');
      
      const response = await chatAPI.sendMessage(chatRoom._id, messageData);
      
      if (apiUtils.isSuccess(response)) {
        const newMessageObj = apiUtils.getData(response);
        setMessages(prev => [...prev, newMessageObj]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Format time
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">로그인이 필요합니다</h3>
          <p className="text-gray-600 mb-6">채팅을 이용하려면 로그인해주세요.</p>
          <Link
            href="/login"
            className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            로그인하기
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">채팅방을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!chatRoom) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">채팅방을 찾을 수 없습니다</h3>
          <p className="text-gray-600 mb-6">요청하신 채팅방이 존재하지 않거나 삭제되었습니다.</p>
          <Link
            href="/chat"
            className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            채팅 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Chat header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/chat" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <div className="relative">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <Heart className="h-4 w-4 text-gray-400" />
              </div>
              {chatRoom.participants.find(p => p._id !== user?._id)?.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
              )}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{chatRoom.relatedPet?.name || 'Chat'}</h2>
              <p className="text-sm text-gray-600">{chatRoom.participants.find(p => p._id !== user?._id)?.name || 'Unknown'}</p>
              <p className="text-xs text-gray-400">
                {chatRoom.participants.find(p => p._id !== user?._id)?.isOnline ? '온라인' : '오프라인'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <button 
              onClick={() => setShowPetInfo(!showPetInfo)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Info className="h-5 w-5 text-gray-600" />
            </button>
            <button className="hidden sm:block p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Phone className="h-5 w-5 text-gray-600" />
            </button>
            <button className="hidden sm:block p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Video className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreVertical className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Pet information panel */}
      {showPetInfo && chatRoom.relatedPet && (
        <div className="bg-orange-50 border-b border-orange-200 p-4">
          <div className="max-w-4xl mx-auto">
            <h3 className="font-semibold text-orange-800 mb-3">분양 동물 정보</h3>
            <div className="flex items-center gap-4">
              <span className="text-orange-600 font-medium">동물 이름:</span>
              <span className="text-orange-700">{chatRoom.relatedPet.name}</span>
            </div>
            <div className="mt-3 flex gap-2">
              <Link
                href={`/pets/${chatRoom.relatedPet._id}`}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
              >
                상세정보 보기
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
        <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
          {/* System message for chat start */}
          <div className="text-center">
            <div className="bg-gray-100 text-gray-600 text-sm px-4 py-2 rounded-full inline-block">
              {chatRoom.relatedPet?.name || 'Chat'}에 대한 대화가 시작되었습니다
            </div>
          </div>
          
          {messages.map((message) => (
            <div
              key={message._id}
              className={`flex ${
                message.sender._id === user?._id ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[75%] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 rounded-2xl ${
                  message.sender._id === user?._id
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <div className={`flex items-center justify-end mt-1 space-x-1 ${
                  message.sender._id === user?._id ? 'text-orange-200' : 'text-gray-500'
                }`}>
                  <span className="text-xs">{formatTime(message.createdAt)}</span>
                  {message.sender._id === user?._id && (
                    message.readBy.length > 1 ? (
                      <CheckCheck className="h-3 w-3" />
                    ) : (
                      <Clock className="h-3 w-3" />
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message input */}
      <div className="bg-white border-t border-gray-200 p-3 sm:p-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2 sm:space-x-3">
            <button
              type="button"
              className="hidden sm:block p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Paperclip className="h-5 w-5 text-gray-600" />
            </button>
            <button
              type="button"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ImageIcon className="h-5 w-5 text-gray-600" />
            </button>
            <div className="flex-1 relative">
              <input
                ref={messageInputRef}
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm sm:text-base"
                placeholder="메시지를 입력하세요..."
              />
              <button
                type="button"
                className="hidden sm:block absolute right-3 top-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Smile className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="p-2 sm:p-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
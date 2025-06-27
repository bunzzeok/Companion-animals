'use client'

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Heart, 
  ArrowLeft, 
  Search, 
  Send, 
  Paperclip, 
  Phone, 
  Video,
  MoreVertical,
  Image as ImageIcon,
  Smile,
  CheckCheck,
  Clock
} from 'lucide-react';

// Chat interfaces
interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'image' | 'system';
  timestamp: string;
  read: boolean;
  edited?: boolean;
}

interface ChatRoom {
  id: string;
  petId: string;
  petName: string;
  petImage: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  chatType: 'adoption' | 'general';
}

interface User {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
}

// Chat page component - Karrot Market style
export default function ChatPage() {
  // State management
  const [activeChat, setActiveChat] = useState<ChatRoom | null>(null);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser] = useState<User>({ id: 'user1', name: '나', avatar: '', isOnline: true });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

  // Load chat rooms on component mount
  useEffect(() => {
    loadChatRooms();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat rooms from API
  const loadChatRooms = async () => {
    try {
      setLoading(true);
      
      // TODO: Replace with actual API call
      // const response = await fetch('/api/chat/rooms');
      // const data = await response.json();
      
      // Mock data for demonstration
      const mockRooms: ChatRoom[] = [
        {
          id: 'room1',
          petId: 'pet1',
          petName: '귀여운 고양이',
          petImage: '/placeholder-cat.jpg',
          participantId: 'user2',
          participantName: '김민수',
          participantAvatar: '/placeholder-user.jpg',
          lastMessage: '언제 만나볼 수 있을까요?',
          lastMessageTime: '2분 전',
          unreadCount: 2,
          isOnline: true,
          chatType: 'adoption'
        },
        {
          id: 'room2',
          petId: 'pet2',
          petName: '착한 강아지',
          petImage: '/placeholder-dog.jpg',
          participantId: 'user3',
          participantName: '이지혜',
          participantAvatar: '/placeholder-user2.jpg',
          lastMessage: '사진 더 보내주실 수 있나요?',
          lastMessageTime: '1시간 전',
          unreadCount: 0,
          isOnline: false,
          chatType: 'adoption'
        },
        {
          id: 'room3',
          petId: 'pet3',
          petName: '온순한 토끼',
          petImage: '/placeholder-rabbit.jpg',
          participantId: 'user4',
          participantName: '박철수',
          participantAvatar: '/placeholder-user3.jpg',
          lastMessage: '감사합니다!',
          lastMessageTime: '어제',
          unreadCount: 0,
          isOnline: true,
          chatType: 'adoption'
        }
      ];
      
      setChatRooms(mockRooms);
      if (mockRooms.length > 0) {
        setActiveChat(mockRooms[0]);
        loadMessages(mockRooms[0].id);
      }
    } catch (error) {
      console.error('Failed to load chat rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load messages for a specific chat room
  const loadMessages = async (roomId: string) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/chat/rooms/${roomId}/messages`);
      // const data = await response.json();
      
      // Mock messages
      const mockMessages: Message[] = [
        {
          id: 'msg1',
          senderId: 'user2',
          receiverId: 'user1',
          content: '안녕하세요! 귀여운 고양이에 관심이 있어서 연락드렸어요.',
          type: 'text',
          timestamp: '2024-01-01T10:00:00Z',
          read: true
        },
        {
          id: 'msg2',
          senderId: 'user1',
          receiverId: 'user2',
          content: '안녕하세요! 연락 주셔서 감사합니다. 어떤 부분이 궁금하신가요?',
          type: 'text',
          timestamp: '2024-01-01T10:05:00Z',
          read: true
        },
        {
          id: 'msg3',
          senderId: 'user2',
          receiverId: 'user1',
          content: '건강상태는 어떤지, 그리고 접종은 완료되었는지 궁금합니다.',
          type: 'text',
          timestamp: '2024-01-01T10:10:00Z',
          read: true
        },
        {
          id: 'msg4',
          senderId: 'user1',
          receiverId: 'user2',
          content: '네, 건강해요! 기본 접종은 모두 완료했고 최근 건강검진도 받았습니다.',
          type: 'text',
          timestamp: '2024-01-01T10:15:00Z',
          read: true
        },
        {
          id: 'msg5',
          senderId: 'user2',
          receiverId: 'user1',
          content: '언제 만나볼 수 있을까요?',
          type: 'text',
          timestamp: '2024-01-01T10:20:00Z',
          read: false
        }
      ];
      
      setMessages(mockMessages);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  // Handle chat room selection
  const handleChatSelect = (chatRoom: ChatRoom) => {
    setActiveChat(chatRoom);
    loadMessages(chatRoom.id);
    
    // Mark messages as read
    setChatRooms(prev => 
      prev.map(room => 
        room.id === chatRoom.id 
          ? { ...room, unreadCount: 0 }
          : room
      )
    );
  };

  // Send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !activeChat) return;
    
    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      receiverId: activeChat.participantId,
      content: newMessage.trim(),
      type: 'text',
      timestamp: new Date().toISOString(),
      read: false
    };
    
    // Add message to current chat
    setMessages(prev => [...prev, message]);
    
    // Update last message in chat room
    setChatRooms(prev =>
      prev.map(room =>
        room.id === activeChat.id
          ? { 
              ...room, 
              lastMessage: newMessage.trim(),
              lastMessageTime: '방금 전'
            }
          : room
      )
    );
    
    setNewMessage('');
    
    // TODO: Send message to server
    try {
      // await fetch('/api/chat/messages', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(message)
      // });
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

  // Filter chat rooms based on search
  const filteredChatRooms = chatRooms.filter(room =>
    room.petName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.participantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Chat rooms list */}
      <div className="w-full sm:w-96 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 p-4">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <h1 className="text-xl font-bold text-gray-900">채팅</h1>
            <div className="w-9 h-9" /> {/* Spacer */}
          </div>
          
          {/* Search bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm"
              placeholder="채팅방 검색..."
            />
          </div>
        </header>

        {/* Chat rooms list */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            // Loading skeleton
            <div className="p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg">
                  <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredChatRooms.length === 0 ? (
            // Empty state
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <Heart className="h-12 w-12 mb-4 text-gray-300" />
              <p className="text-sm">아직 채팅방이 없습니다</p>
              <p className="text-xs text-gray-400 mt-1">분양 게시글에서 채팅을 시작해보세요</p>
            </div>
          ) : (
            // Chat rooms
            <div className="p-2">
              {filteredChatRooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => handleChatSelect(room)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors ${
                    activeChat?.id === room.id ? 'bg-orange-50 border-orange-200' : ''
                  }`}
                >
                  {/* Pet image */}
                  <div className="relative">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <Heart className="h-5 w-5 text-gray-400" />
                    </div>
                    {room.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  
                  {/* Chat info */}
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {room.petName}
                      </p>
                      <span className="text-xs text-gray-500">{room.lastMessageTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate">{room.lastMessage}</p>
                      {room.unreadCount > 0 && (
                        <span className="ml-2 bg-orange-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                          {room.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{room.participantName}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <>
            {/* Chat header */}
            <header className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <Heart className="h-4 w-4 text-gray-400" />
                    </div>
                    {activeChat.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">{activeChat.petName}</h2>
                    <p className="text-sm text-gray-600">{activeChat.participantName}</p>
                    <p className="text-xs text-gray-400">
                      {activeChat.isOnline ? '온라인' : '오프라인'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Phone className="h-5 w-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Video className="h-5 w-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </header>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.senderId === currentUser.id ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      message.senderId === currentUser.id
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <div className={`flex items-center justify-end mt-1 space-x-1 ${
                      message.senderId === currentUser.id ? 'text-orange-200' : 'text-gray-500'
                    }`}>
                      <span className="text-xs">{formatTime(message.timestamp)}</span>
                      {message.senderId === currentUser.id && (
                        message.read ? (
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

            {/* Message input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                <button
                  type="button"
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    placeholder="메시지를 입력하세요..."
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Smile className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="p-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          // No chat selected
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">대화를 시작해보세요</h3>
              <p className="text-gray-600 mb-6">
                분양하고 싶은 동물이나<br />
                입양하고 싶은 동물에 대해 이야기해보세요
              </p>
              <Link
                href="/pets"
                className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                분양 동물 보기
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
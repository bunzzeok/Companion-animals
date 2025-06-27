'use client'

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
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

// Interfaces (same as main chat page)
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
  petInfo?: {
    breed: string;
    age: string;
    location: string;
    adoptionFee: number;
    status: string;
  };
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
  
  // State management
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showPetInfo, setShowPetInfo] = useState(false);
  const [currentUser] = useState<User>({ id: 'user1', name: '나', avatar: '', isOnline: true });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

  // Load chat room and messages on component mount
  useEffect(() => {
    if (chatId) {
      loadChatRoom(chatId);
      loadMessages(chatId);
    }
  }, [chatId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load specific chat room
  const loadChatRoom = async (roomId: string) => {
    try {
      setLoading(true);
      
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/chat/rooms/${roomId}`);
      // const data = await response.json();
      
      // Mock data based on room ID
      const mockRoom: ChatRoom = {
        id: roomId,
        petId: 'pet1',
        petName: '귀여운 고양이',
        petImage: '/placeholder-cat.jpg',
        participantId: 'user2',
        participantName: '김민수',
        participantAvatar: '/placeholder-user.jpg',
        lastMessage: '언제 만나볼 수 있을까요?',
        lastMessageTime: '2분 전',
        unreadCount: 0,
        isOnline: true,
        chatType: 'adoption',
        petInfo: {
          breed: '코리안 숏헤어',
          age: '성인 (3세)',
          location: '성동구, 서울특별시',
          adoptionFee: 0,
          status: '분양 가능'
        }
      };
      
      setChatRoom(mockRoom);
    } catch (error) {
      console.error('Failed to load chat room:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load messages for the chat room
  const loadMessages = async (roomId: string) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/chat/rooms/${roomId}/messages`);
      // const data = await response.json();
      
      // Mock messages with more realistic conversation
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
          content: '네, 건강해요! 기본 접종은 모두 완료했고 최근 건강검진도 받았습니다. 중성화 수술도 완료된 상태입니다.',
          type: 'text',
          timestamp: '2024-01-01T10:15:00Z',
          read: true
        },
        {
          id: 'msg5',
          senderId: 'user2',
          receiverId: 'user1',
          content: '좋은 정보 감사합니다! 성격은 어떤가요?',
          type: 'text',
          timestamp: '2024-01-01T10:18:00Z',
          read: true
        },
        {
          id: 'msg6',
          senderId: 'user1',
          receiverId: 'user2',
          content: '매우 온순하고 사람을 좋아해요. 다른 고양이들과도 잘 지내고, 아이들이 있는 집에서도 문제없을 것 같아요.',
          type: 'text',
          timestamp: '2024-01-01T10:20:00Z',
          read: true
        },
        {
          id: 'msg7',
          senderId: 'user2',
          receiverId: 'user1',
          content: '완벽하네요! 언제 만나볼 수 있을까요?',
          type: 'text',
          timestamp: '2024-01-01T10:25:00Z',
          read: false
        }
      ];
      
      setMessages(mockMessages);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  // Send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !chatRoom) return;
    
    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      receiverId: chatRoom.participantId,
      content: newMessage.trim(),
      type: 'text',
      timestamp: new Date().toISOString(),
      read: false
    };
    
    // Add message to current chat
    setMessages(prev => [...prev, message]);
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
      <header className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/chat" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <div className="relative">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <Heart className="h-4 w-4 text-gray-400" />
              </div>
              {chatRoom.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
              )}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{chatRoom.petName}</h2>
              <p className="text-sm text-gray-600">{chatRoom.participantName}</p>
              <p className="text-xs text-gray-400">
                {chatRoom.isOnline ? '온라인' : '오프라인'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setShowPetInfo(!showPetInfo)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Info className="h-5 w-5 text-gray-600" />
            </button>
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

      {/* Pet information panel */}
      {showPetInfo && chatRoom.petInfo && (
        <div className="bg-orange-50 border-b border-orange-200 p-4">
          <div className="max-w-4xl mx-auto">
            <h3 className="font-semibold text-orange-800 mb-3">분양 동물 정보</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-orange-600 font-medium">품종:</span>
                <span className="ml-2 text-orange-700">{chatRoom.petInfo.breed}</span>
              </div>
              <div>
                <span className="text-orange-600 font-medium">나이:</span>
                <span className="ml-2 text-orange-700">{chatRoom.petInfo.age}</span>
              </div>
              <div>
                <span className="text-orange-600 font-medium">위치:</span>
                <span className="ml-2 text-orange-700">{chatRoom.petInfo.location}</span>
              </div>
              <div>
                <span className="text-orange-600 font-medium">분양비:</span>
                <span className="ml-2 text-orange-700">
                  {chatRoom.petInfo.adoptionFee === 0 ? '무료분양' : `₩${chatRoom.petInfo.adoptionFee.toLocaleString()}`}
                </span>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Link
                href={`/pets/${chatRoom.petId}`}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
              >
                상세정보 보기
              </Link>
              <span className="bg-green-100 text-green-800 px-3 py-2 rounded-lg text-sm font-medium">
                {chatRoom.petInfo.status}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* System message for chat start */}
          <div className="text-center">
            <div className="bg-gray-100 text-gray-600 text-sm px-4 py-2 rounded-full inline-block">
              {chatRoom.petName}에 대한 대화가 시작되었습니다
            </div>
          </div>
          
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
      </div>

      {/* Message input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
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
      </div>
    </div>
  );
}
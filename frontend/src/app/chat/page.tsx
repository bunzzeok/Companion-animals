'use client'

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Heart, 
  ArrowLeft, 
  ArrowDown,
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
import { chatAPI, socketUtils, apiUtils, type ApiResponse } from '../../lib/api';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications, NotificationProvider } from '../../contexts/NotificationContext';

// Chat interfaces
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

// Chat page component - Karrot Market style
function ChatPageContent() {
  // Authentication
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { addNotification } = useNotifications();
  const searchParams = useSearchParams();
  
  // State management
  const [activeChat, setActiveChat] = useState<ChatRoom | null>(null);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [showChatList, setShowChatList] = useState(true); // Mobile view state
  
  // Socket connection
  const [socket, setSocket] = useState<any>(null);
  
  // Scroll management
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  // Request notification permission on component mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('📲 Notification permission:', permission);
      });
    }
  }, []);

  // Initialize socket connection when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user && !authLoading) {
      console.log('🔄 Initializing socket and loading chat rooms for user:', user.name);
      initializeSocket();
      loadChatRooms();
    }
    
    return () => {
      if (socket) {
        console.log('🔌 Disconnecting socket');
        socket.disconnect();
      }
    };
  }, [isAuthenticated, user, authLoading]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize Socket.IO connection
  const initializeSocket = () => {
    if (!user || socket) {
      console.log('🔌 Socket initialization skipped:', { hasUser: !!user, hasSocket: !!socket });
      return;
    }
    
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.log('🔌 No auth token found for socket connection');
      return;
    }
    
    console.log('🔌 Initializing socket connection for user:', user.name);
    console.log('🔑 Token length:', token.length);
    
    try {
      const newSocket = socketUtils.connect(token);
      
      if (newSocket) {
        setSocket(newSocket);
        
        // Socket event listeners
        newSocket.on('connect', () => {
          console.log('✅ Socket connected successfully! Socket ID:', newSocket.id);
          console.log('🔌 Connected as user:', user.name, user._id);
          
          // 연결 성공 로그만 남김
          console.log('🔌 실시간 채팅이 연결되었습니다.');
        });
        
        newSocket.on('connect_error', (error: any) => {
          console.error('❌ Socket connection error:', error);
          
          // 연결 에러 로그만 남김
          console.error('❌ 실시간 채팅 연결에 실패했습니다:', error.message);
        });
        
        newSocket.on('disconnect', (reason: string) => {
          console.log('🔌 Socket disconnected:', reason);
        });
        
        newSocket.on('reconnect', (attemptNumber: number) => {
          console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
        });
        
        newSocket.on('reconnect_error', (error: any) => {
          console.error('❌ Socket reconnection error:', error);
        });
        
        // Note: message:new listener is now handled in a separate useEffect to fix closure issues
        
        // Listen for message read status
        newSocket.on('message:read_by', (data: { messageId: string; userId: string; readAt: string }) => {
          setMessages(prev =>
            prev.map(msg =>
              msg._id === data.messageId
                ? {
                    ...msg,
                    readBy: [
                      ...msg.readBy.filter(r => r.user !== data.userId),
                      { user: data.userId, readAt: data.readAt }
                    ]
                  }
                : msg
            )
          );
        });
        
        // Listen for room read status (when someone reads all messages in a room)
        newSocket.on('room:read_by', (data: { roomId: string; userId: string; readAt: string }) => {
          console.log('📖 Room marked as read by user:', data);
          // Update unread count for this room if it's not the current user
          if (data.userId !== user?._id) {
            setChatRooms(prev =>
              prev.map(room =>
                room._id === data.roomId
                  ? { ...room, unreadCount: Math.max(0, room.unreadCount - 1) }
                  : room
              )
            );
          }
        });
        
        // Listen for room joined confirmation
        newSocket.on('room:joined', (data: { roomId: string }) => {
          console.log('🏠 Successfully joined room:', {
            roomId: data.roomId,
            currentActiveChat: activeChat?._id,
            isCurrentRoom: data.roomId === activeChat?._id
          });
          
          // 채팅방 입장 성공 시 메시지를 읽음으로 표시
          if (data.roomId === activeChat?._id) {
            newSocket.emit('room:mark_read', { roomId: data.roomId });
          }
        });
        
        // Listen for Socket.IO errors
        newSocket.on('error', (error: any) => {
          console.error('🔴 Socket.IO error:', error);
        });
        
        // Listen for message sent confirmation
        newSocket.on('message:sent', (data: { messageId: string }) => {
          console.log('✅ Message sent confirmation:', data.messageId);
          
          // 메시지 전송 성공 로그만 남김
        });
        
        // Listen for message errors
        newSocket.on('message:error', (data: { error: string }) => {
          console.error('❌ Message error:', data.error);
          alert('메시지 전송에 실패했습니다: ' + data.error);
        });
        
        // Listen for online users
        newSocket.on('user:online', (data: { userId: string; name: string; profileImage?: string }) => {
          setOnlineUsers(prev => new Set(prev).add(data.userId));
        });
        
        newSocket.on('user:offline', (data: { userId: string; name: string }) => {
          setOnlineUsers(prev => {
            const updated = new Set(prev);
            updated.delete(data.userId);
            return updated;
          });
        });
        
        // Listen for typing indicators
        newSocket.on('typing:user_start', (data: { userId: string; name: string }) => {
          console.log('✍️ User started typing:', data);
        });
        
        newSocket.on('typing:user_stop', (data: { userId: string; name: string }) => {
          console.log('✍️ User stopped typing:', data);
        });
      }
    } catch (error) {
      console.error('Failed to initialize socket:', error);
    }
  };

  // Load chat rooms from API
  const loadChatRooms = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const response = await chatAPI.getChatRooms({ page: 1, limit: 50 });
      
      if (apiUtils.isSuccess(response)) {
        const roomsData = apiUtils.getData(response) || [];
        
        // Sort chat rooms by last message date (newest first)
        const sortedRooms = roomsData.sort((a: ChatRoom, b: ChatRoom) => {
          const aDate = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt).getTime() : new Date(a.createdAt).getTime();
          const bDate = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt).getTime() : new Date(b.createdAt).getTime();
          return bDate - aDate; // Newest first
        });
        
        setChatRooms(sortedRooms);
        
        // Check if there's a specific room ID in URL params
        const roomId = searchParams?.get('room');
        console.log('🔍 URL roomId:', roomId);
        console.log('🔍 Loaded rooms:', roomsData);
        
        if (roomId && roomId !== 'undefined' && roomId !== 'null') {
          console.log('🔍 Looking for room ID:', roomId, 'in', roomsData.length, 'rooms');
          const targetRoom = roomsData.find((room: ChatRoom) => room._id === roomId);
          if (targetRoom && validateChatRoom(targetRoom)) {
            console.log('✅ Found and validated target room:', {
              id: targetRoom._id,
              type: targetRoom.type,
              participants: targetRoom.participants,
              relatedPet: targetRoom.relatedPet
            });
            setActiveChat(targetRoom);
            loadMessages(targetRoom._id);
            setShowChatList(false); // Hide chat list when room is selected
          } else {
            console.log('⚠️ Room not found in loaded rooms, trying to create/find room');
            // Room not found in current rooms, try to load it directly
            try {
              const roomResponse = await chatAPI.getChatRoom(roomId);
              if (apiUtils.isSuccess(roomResponse)) {
                const roomData = apiUtils.getData(roomResponse);
                if (validateChatRoom(roomData)) {
                  console.log('✅ Loaded and validated room directly:', roomData._id);
                  setActiveChat(roomData);
                  loadMessages(roomData._id);
                  setShowChatList(false); // Hide chat list when room is selected
                } else {
                  console.error('❌ Loaded room is invalid');
                  // Fallback to first available room
                  const firstValidRoom = roomsData.find((room: ChatRoom) => validateChatRoom(room));
                  if (firstValidRoom) {
                    setActiveChat(firstValidRoom);
                    loadMessages(firstValidRoom._id);
                  }
                }
              } else {
                // Room doesn't exist, load first available room
                const firstValidRoom = roomsData.find((room: ChatRoom) => validateChatRoom(room));
                if (firstValidRoom) {
                  console.log('🔄 Fallback to first valid room:', firstValidRoom._id);
                  setActiveChat(firstValidRoom);
                  loadMessages(firstValidRoom._id);
                } else {
                  console.error('❌ No valid rooms found for fallback');
                }
              }
            } catch (error) {
              console.error('Failed to load specific room:', error);
              const firstValidRoom = roomsData.find((room: ChatRoom) => validateChatRoom(room));
              if (firstValidRoom) {
                console.log('🔄 Error fallback to first valid room:', firstValidRoom._id);
                setActiveChat(firstValidRoom);
                loadMessages(firstValidRoom._id);
              } else {
                console.error('❌ No valid rooms found for error fallback');
              }
            }
          }
        } else if (roomsData.length > 0) {
          const firstValidRoom = roomsData.find((room: ChatRoom) => validateChatRoom(room));
          if (firstValidRoom) {
            console.log('🔄 No specific room requested, using first valid room:', firstValidRoom._id);
            setActiveChat(firstValidRoom);
            loadMessages(firstValidRoom._id);
          } else {
            console.error('❌ No valid chat rooms found');
          }
        } else {
          console.log('⚠️ No chat rooms available');
        }
      } else {
        console.warn('Failed to load chat rooms from API, using fallback data');
        
        // Fallback mock data for development
        if (process.env.NODE_ENV === 'development') {
          const mockRooms: ChatRoom[] = [
            {
              _id: 'room1',
              type: 'private',
              participants: [
                {
                  _id: user._id,
                  name: user.name,
                  profileImage: user.profileImage
                },
                {
                  _id: 'user2',
                  name: '김민수',
                  profileImage: '/placeholder-user.jpg'
                }
              ],
              relatedPet: {
                _id: 'pet1',
                name: '귀여운 고양이',
                images: ['/placeholder-cat.jpg']
              },
              lastMessage: {
                content: '언제 만나볼 수 있을까요?',
                sender: 'user2',
                createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString()
              },
              unreadCount: 2,
              createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
              updatedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString()
            },
            {
              _id: 'room2',
              type: 'private',
              participants: [
                {
                  _id: user._id,
                  name: user.name,
                  profileImage: user.profileImage
                },
                {
                  _id: 'user3',
                  name: '이지혜',
                  profileImage: '/placeholder-user2.jpg'
                }
              ],
              relatedPet: {
                _id: 'pet2',
                name: '착한 강아지',
                images: ['/placeholder-dog.jpg']
              },
              lastMessage: {
                content: '사진 더 보내주실 수 있나요?',
                sender: 'user3',
                createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString()
              },
              unreadCount: 0,
              createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
              updatedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString()
            }
          ];
          
          setChatRooms(mockRooms);
          if (mockRooms.length > 0) {
            setActiveChat(mockRooms[0]);
            loadMessages(mockRooms[0]._id);
          }
        }
      }
    } catch (error) {
      console.error('Failed to load chat rooms:', error);
      
      // Fallback for offline scenarios
      if (process.env.NODE_ENV === 'development') {
        const mockRooms: ChatRoom[] = [
          {
            _id: 'room1',
            type: 'private',
            participants: [
              {
                _id: user._id,
                name: user.name,
                profileImage: user.profileImage
              },
              {
                _id: 'user2',
                name: '김민수',
                profileImage: '/placeholder-user.jpg'
              }
            ],
            relatedPet: {
              _id: 'pet1',
              name: '귀여운 고양이',
              images: ['/placeholder-cat.jpg']
            },
            lastMessage: {
              content: '언제 만나볼 수 있을까요?',
              sender: 'user2',
              createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString()
            },
            unreadCount: 2,
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString()
          }
        ];
        
        setChatRooms(mockRooms);
        if (mockRooms.length > 0) {
          setActiveChat(mockRooms[0]);
          loadMessages(mockRooms[0]._id);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // Load messages for a specific chat room
  const loadMessages = async (roomId: string) => {
    if (!user || !roomId || roomId === 'undefined') {
      console.error('❌ Invalid roomId:', roomId);
      return;
    }
    
    try {
      const response = await chatAPI.getMessages(roomId, { page: 1, limit: 100 });
      
      if (apiUtils.isSuccess(response)) {
        const messagesData = apiUtils.getData(response) || [];
        // Backend returns messages in descending order (newest first), 
        // but we need ascending order (oldest first) for chat display
        const sortedMessages = messagesData.reverse();
        setMessages(sortedMessages);
        
        // Join the socket room
        if (socket && socket.connected) {
          console.log('🏠 Joining socket room:', roomId);
          socketUtils.joinRoom(socket, roomId);
        } else {
          console.warn('⚠️ Socket not available or not connected:', {
            hasSocket: !!socket,
            connected: socket?.connected
          });
        }
        
        // Mark messages as read
        const unreadMessages = messagesData.filter(
          (msg: Message) => !msg.readBy.some(r => r.user === user._id)
        );
        
        for (const message of unreadMessages) {
          try {
            await chatAPI.markAsRead(roomId, message._id);
          } catch (error) {
            console.error('Failed to mark message as read:', error);
          }
        }
      } else {
        console.warn('Failed to load messages from API, using fallback data');
        
        // Fallback mock data for development
        if (process.env.NODE_ENV === 'development') {
          const mockMessages: Message[] = [
            {
              _id: 'msg1',
              content: '안녕하세요! 귀여운 고양이에 관심이 있어서 연락드렸어요.',
              type: 'text',
              sender: {
                _id: 'user2',
                name: '김민수',
                profileImage: '/placeholder-user.jpg'
              },
              chatRoom: roomId,
              readBy: [
                { user: user._id, readAt: new Date().toISOString() }
              ],
              createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
              updatedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString()
            },
            {
              _id: 'msg2',
              content: '안녕하세요! 연락 주셔서 감사합니다. 어떤 부분이 궁금하신가요?',
              type: 'text',
              sender: {
                _id: user._id,
                name: user.name,
                profileImage: user.profileImage
              },
              chatRoom: roomId,
              readBy: [
                { user: user._id, readAt: new Date().toISOString() },
                { user: 'user2', readAt: new Date().toISOString() }
              ],
              createdAt: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
              updatedAt: new Date(Date.now() - 50 * 60 * 1000).toISOString()
            },
            {
              _id: 'msg3',
              content: '건강상태는 어떤지, 그리고 접종은 완료되었는지 궁금합니다.',
              type: 'text',
              sender: {
                _id: 'user2',
                name: '김민수',
                profileImage: '/placeholder-user.jpg'
              },
              chatRoom: roomId,
              readBy: [
                { user: user._id, readAt: new Date().toISOString() }
              ],
              createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
              updatedAt: new Date(Date.now() - 40 * 60 * 1000).toISOString()
            },
            {
              _id: 'msg4',
              content: '네, 건강해요! 기본 접종은 모두 완료했고 최근 건강검진도 받았습니다.',
              type: 'text',
              sender: {
                _id: user._id,
                name: user.name,
                profileImage: user.profileImage
              },
              chatRoom: roomId,
              readBy: [
                { user: user._id, readAt: new Date().toISOString() },
                { user: 'user2', readAt: new Date().toISOString() }
              ],
              createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
              updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
            },
            {
              _id: 'msg5',
              content: '언제 만나볼 수 있을까요?',
              type: 'text',
              sender: {
                _id: 'user2',
                name: '김민수',
                profileImage: '/placeholder-user.jpg'
              },
              chatRoom: roomId,
              readBy: [],
              createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
              updatedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString()
            }
          ];
          
          setMessages(mockMessages);
        }
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
      
      // Fallback for offline scenarios
      if (process.env.NODE_ENV === 'development') {
        const mockMessages: Message[] = [
          {
            _id: 'msg1',
            content: '안녕하세요! 귀여운 고양이에 관심이 있어서 연락드렸어요.',
            type: 'text',
            sender: {
              _id: 'user2',
              name: '김민수',
              profileImage: '/placeholder-user.jpg'
            },
            chatRoom: roomId,
            readBy: [
              { user: user._id, readAt: new Date().toISOString() }
            ],
            createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString()
          }
        ];
        
        setMessages(mockMessages);
      }
    }
  };

  // Handle chat room selection
  const handleChatSelect = async (chatRoom: ChatRoom) => {
    console.log('👥 Selecting chat room:', {
      id: chatRoom._id,
      type: chatRoom.type,
      participants: chatRoom.participants?.length || 0,
      relatedPet: chatRoom.relatedPet?.name,
      unreadCount: chatRoom.unreadCount
    });
    
    // Validate chat room
    if (!validateChatRoom(chatRoom)) {
      console.error('❌ Cannot select invalid chat room');
      return;
    }
    
    // Leave previous room
    if (activeChat && socket && activeChat._id) {
      socketUtils.leaveRoom(socket, activeChat._id);
    }
    
    setActiveChat(chatRoom);
    loadMessages(chatRoom._id);
    setShowChatList(false); // Hide chat list on mobile when selecting a chat
    
    // Reset scroll state for new chat
    setIsUserScrolling(false);
    setShowScrollToBottom(false);
    
    // Join the socket room for real-time messaging
    if (socket && socket.connected) {
      console.log('🏠 Joining socket room for real-time chat:', {
        roomId: chatRoom._id,
        socketId: socket.id,
        socketConnected: socket.connected
      });
      socketUtils.joinRoom(socket, chatRoom._id);
    } else {
      console.error('❌ Cannot join room - socket not connected:', {
        hasSocket: !!socket,
        connected: socket?.connected,
        roomId: chatRoom._id
      });
    }
    
    // Mark messages as read immediately in UI
    setChatRooms(prev => 
      prev.map(room => 
        room._id === chatRoom._id 
          ? { ...room, unreadCount: 0 }
          : room
      )
    );
    
    // Mark room as read on server
    try {
      if (chatRoom.unreadCount > 0) {
        console.log('📖 Marking room as read:', chatRoom._id);
        
        // Socket.IO를 우선 사용
        if (socket && socket.connected) {
          console.log('📖 Marking room as read via Socket.IO');
          socket.emit('room:mark_read', { roomId: chatRoom._id });
        } else {
          // HTTP API fallback
          console.log('📖 Marking room as read via HTTP API');
          await chatAPI.markRoomAsRead(chatRoom._id);
        }
      }
    } catch (error) {
      console.error('Failed to mark room as read:', error);
    }
  };

  // Handle back to chat list (mobile)
  const handleBackToChatList = () => {
    setShowChatList(true);
    setActiveChat(null);
  };

  // Send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Enhanced validation
    if (!newMessage.trim() || !activeChat || !user || !activeChat._id) {
      console.warn('⚠️ Cannot send message - validation failed:', {
        hasMessage: !!newMessage.trim(),
        hasActiveChat: !!activeChat,
        activeChatId: activeChat?._id,
        activeChatIdType: typeof activeChat?._id,
        hasUser: !!user,
        userId: user?._id
      });
      
      if (!activeChat?._id) {
        alert('채팅방이 선택되지 않았습니다. 채팅방을 다시 선택해주세요.');
      }
      return;
    }
    
    const messageContent = newMessage.trim();
    
    console.log('📤 Sending message to chat room:', activeChat._id);
    setNewMessage(''); // Clear input immediately
    
    try {
      console.log('🔍 Socket status:', {
        socket: !!socket,
        connected: socket?.connected,
        socketId: socket?.id
      });
      
      // 강제로 Socket.IO만 사용하여 실시간 채팅 테스트
      console.log('🔍 Socket connection check:', {
        hasSocket: !!socket,
        connected: socket?.connected,
        socketId: socket?.id,
        activeRoom: activeChat._id
      });
      
      if (socket && socket.connected) {
        console.log('📤 Sending via Socket.IO to room:', activeChat._id);
        console.log('📤 Message:', messageContent);
        
        // Optimistic update - 내가 보낸 메시지를 즉시 화면에 표시
        const optimisticMessage: Message = {
          _id: 'temp_' + Date.now(),
          content: messageContent,
          type: 'text',
          sender: {
            _id: user._id,
            name: user.name,
            profileImage: user.profileImage
          },
          chatRoom: activeChat._id,
          readBy: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        // 즉시 메시지 목록에 추가
        setMessages(prev => [...prev, optimisticMessage]);
        
        // 새 메시지 전송 시 스크롤 상태 초기화 (자동 스크롤 활성화)
        setIsUserScrolling(false);
        
        socketUtils.sendMessage(socket, {
          chatRoom: activeChat._id,
          content: messageContent,
          type: 'text'
        });
        
        console.log('✅ Socket message sent, waiting for response...');
      } else {
        console.error('❌ Socket not connected!');
        alert('Socket 연결이 되어있지 않습니다. 페이지를 새로고침 해주세요.');
        setNewMessage(messageContent); // Restore message
      }
    } catch (error) {
      console.error('❌ Failed to send message:', error);
      setNewMessage(messageContent); // Restore message on error
    }
  };

  // Scroll management functions
  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: smooth ? 'smooth' : 'instant' 
    });
  }, []);

  const checkScrollPosition = useCallback(() => {
    if (!messagesContainerRef.current) return;
    
    const container = messagesContainerRef.current;
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
    
    setShowScrollToBottom(!isNearBottom);
    setIsUserScrolling(!isNearBottom);
  }, []);

  // Handle scroll events
  const handleScroll = useCallback(() => {
    checkScrollPosition();
  }, [checkScrollPosition]);

  // Auto-scroll to bottom when messages change (only if user is not scrolling)
  useEffect(() => {
    if (!isUserScrolling || messages.length === 1) {
      // Always scroll for first message or when user is at bottom
      scrollToBottom(true);
    }
  }, [messages, isUserScrolling, scrollToBottom]);

  // Update message listener when activeChat changes to fix closure issue
  useEffect(() => {
    if (!socket || !user) return;

    console.log('🔄 Updating message listener for activeChat:', activeChat?._id);

    // Remove old listener to prevent duplicates
    socket.off('message:new');
    
    // Add new listener with current activeChat reference
    socket.on('message:new', (message: Message) => {
      console.log('📨 New message received (updated listener):', {
        messageId: message._id,
        content: message.content,
        sender: message.sender.name,
        chatRoom: message.chatRoom,
        currentActiveChat: activeChat?._id,
        isCurrentUser: message.sender._id === user?._id
      });
      
      // Show notification for new messages (only from other users)
      if (message.sender._id !== user?._id) {
        console.log('📢 Adding notification to header:', {
          sender: message.sender.name,
          content: message.content,
          chatRoom: message.chatRoom
        });
        
        // 헤더 알림에 추가
        addNotification({
          type: 'chat',
          title: '새로운 메시지',
          message: `${message.sender.name}: ${message.content}`,
          chatRoomId: message.chatRoom,
          senderId: message.sender._id,
          senderName: message.sender.name
        });
        
        // 브라우저 알림 (현재 채팅방이 아닌 경우만)
        if ((!activeChat || message.chatRoom !== activeChat._id) && 'Notification' in window && Notification.permission === 'granted') {
          new Notification('새로운 메시지', {
            body: `${message.sender.name}: ${message.content}`,
            icon: '/favicon.ico',
            tag: message.chatRoom
          });
        }
      } else {
        console.log('📢 Not adding notification - message from current user');
      }
      
      // Add message to current chat if it's the active one
      if (activeChat && message.chatRoom === activeChat._id) {
        console.log('✅ Adding message to current chat (updated listener):', {
          chatRoomId: message.chatRoom,
          activeRoomId: activeChat._id,
          messageContent: message.content
        });
        
        setMessages(prev => {
          // 중복 방지: 이미 존재하는 메시지인지 확인
          if (prev.find(msg => msg._id === message._id)) {
            console.log('⚠️ Duplicate message detected, skipping:', message._id);
            return prev;
          }
          
          // Optimistic update 메시지를 실제 서버 메시지로 교체
          const filteredMessages = prev.filter(msg => {
            if (!msg._id.startsWith('temp_')) {
              return true; // 실제 메시지는 그대로 유지
            }
            // 임시 메시지 중에서 현재 받은 메시지와 같은 내용인지 확인
            const isSameMessage = 
              msg.sender._id === message.sender._id && 
              msg.content === message.content &&
              msg.chatRoom === message.chatRoom;
            return !isSameMessage; // 같은 메시지면 제거
          });
          
          // 실제 서버 메시지 추가
          console.log('📝 Message added to chat (updated listener):', message.content);
          return [...filteredMessages, message];
        });
      } else {
        console.log('❌ Message NOT added to chat (updated listener):', {
          hasActiveChat: !!activeChat,
          activeChatId: activeChat?._id,
          messageChatRoom: message.chatRoom,
          roomMatch: activeChat?._id === message.chatRoom
        });
      }
      
      // Update chat room list
      setChatRooms(prev => {
        const updatedRooms = prev.map(room =>
          room._id === message.chatRoom
            ? {
                ...room,
                lastMessage: {
                  content: message.content,
                  sender: message.sender._id,
                  createdAt: message.createdAt
                },
                unreadCount: room._id === activeChat?._id ? 0 : (message.sender._id?.toString() === user?._id?.toString() ? room.unreadCount : room.unreadCount + 1)
              }
            : room
        );
        
        return updatedRooms.sort((a: ChatRoom, b: ChatRoom) => {
          const aDate = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt).getTime() : new Date(a.createdAt).getTime();
          const bDate = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt).getTime() : new Date(b.createdAt).getTime();
          return bDate - aDate;
        });
      });
    });

    return () => {
      if (socket) {
        socket.off('message:new');
      }
    };
  }, [socket, activeChat, user, addNotification]);

  // Format time
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    if (!dateString) return '방금 전';
    
    const now = new Date();
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn('⚠️ Invalid date string:', dateString);
      return '방금 전';
    }
    
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    // Handle negative differences (future dates)
    if (diffInSeconds < 0) return '방금 전';
    
    if (diffInSeconds < 60) return '방금 전';
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}분 전`;
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}시간 전`;
    }
    
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}일 전`;
  };

  // Get the other participant in the chat
  const getOtherParticipant = (room: ChatRoom) => {
    if (!room?.participants || !Array.isArray(room.participants)) {
      console.warn('⚠️ Room has no participants:', room);
      return null;
    }
    
    const otherParticipant = room.participants.find(p => p._id !== user?._id);
    console.log('👥 Other participant found:', otherParticipant);
    console.log('👥 All participants:', room.participants);
    console.log('👥 Current user ID:', user?._id);
    
    return otherParticipant;
  };

  // Check if user is online
  const isUserOnline = (userId: string) => {
    return onlineUsers.has(userId);
  };

  // Validate chat room data integrity
  const validateChatRoom = (room: ChatRoom): boolean => {
    if (!room || !room._id) {
      console.error('❌ Invalid chat room: missing ID', room);
      return false;
    }
    if (!Array.isArray(room.participants) || room.participants.length === 0) {
      console.error('❌ Invalid chat room: no participants', room);
      return false;
    }
    return true;
  };

  // Check if message is read by other participants
  const isMessageRead = (message: Message) => {
    if (!user) return false;
    return message.readBy.some(r => r.user !== user._id);
  };

  // Filter chat rooms based on search
  const filteredChatRooms = chatRooms.filter(room => {
    const otherParticipant = getOtherParticipant(room);
    const petName = room.relatedPet?.name || '';
    const participantName = otherParticipant?.name || '';
    
    return petName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           participantName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Redirect to login if not authenticated
  if (!authLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">로그인이 필요합니다</h3>
          <p className="text-gray-600 mb-6">
            채팅을 사용하려면 먼저 로그인해주세요
          </p>
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

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar - Chat rooms list */}
      <div className={`${showChatList ? 'flex' : 'hidden'} md:flex w-full md:w-96 bg-white border-r border-gray-200 flex-col`}>
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
              {filteredChatRooms.map((room) => {
                const otherParticipant = getOtherParticipant(room);
                const isOnline = otherParticipant ? isUserOnline(otherParticipant._id) : false;
                
                return (
                  <button
                    key={room._id}
                    onClick={() => handleChatSelect(room)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors ${
                      activeChat?._id === room._id ? 'bg-orange-50 border-orange-200' : ''
                    }`}
                  >
                    {/* Pet/User image */}
                    <div className="relative">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                        {room.relatedPet?.images?.[0] ? (
                          <img 
                            src={apiUtils.getImageUrl(room.relatedPet.images[0])}
                            alt={room.relatedPet.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <Heart className={`h-5 w-5 text-gray-400 ${room.relatedPet?.images?.[0] ? 'hidden' : ''}`} />
                      </div>
                      {isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                    
                    {/* Chat info */}
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {room.relatedPet?.name || '채팅'}
                        </p>
                        <span className="text-xs text-gray-500">
                          {room.lastMessage?.createdAt ? formatTimeAgo(room.lastMessage.createdAt) : room.createdAt ? formatTimeAgo(room.createdAt) : ''}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 truncate">
                          {room.lastMessage?.content || '대화를 시작해보세요'}
                        </p>
                        {room.unreadCount > 0 && (
                          <span className="ml-2 bg-orange-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                            {room.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {otherParticipant?.name || '알 수 없는 사용자'}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Main chat area */}
      <div className={`${!showChatList ? 'flex' : 'hidden'} md:flex flex-1 h-full`}>
        {activeChat ? (
          <div className="flex flex-col h-full w-full">
            {/* Chat header */}
            <header className="bg-white border-b border-gray-200 p-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* Mobile back button */}
                  <button 
                    onClick={handleBackToChatList}
                    className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                  </button>
                  <div className="relative">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                      {activeChat.relatedPet?.images?.[0] ? (
                        <img 
                          src={apiUtils.getImageUrl(activeChat.relatedPet.images[0])}
                          alt={activeChat.relatedPet.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <Heart className={`h-4 w-4 text-gray-400 ${activeChat.relatedPet?.images?.[0] ? 'hidden' : ''}`} />
                    </div>
                    {(() => {
                      const otherParticipant = getOtherParticipant(activeChat);
                      const isOnline = otherParticipant ? isUserOnline(otherParticipant._id) : false;
                      return isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                      );
                    })()}
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">
                      {activeChat.relatedPet?.name || '채팅'}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {getOtherParticipant(activeChat)?.name || '알 수 없는 사용자'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {(() => {
                        const otherParticipant = getOtherParticipant(activeChat);
                        const isOnline = otherParticipant ? isUserOnline(otherParticipant._id) : false;
                        return isOnline ? '온라인' : '오프라인';
                      })()}
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
            <div 
              ref={messagesContainerRef}
              onScroll={handleScroll}
              className="relative flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 scroll-smooth"
            >
              {messages.map((message) => {
                const isMyMessage = message.sender._id === user?._id;
                const isRead = isMessageRead(message);
                
                return (
                  <div
                    key={message._id}
                    className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 rounded-2xl ${
                        isMyMessage
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-200 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div className={`flex items-center justify-end mt-1 space-x-1 ${
                        isMyMessage ? 'text-orange-200' : 'text-gray-500'
                      }`}>
                        <span className="text-xs">{formatTime(message.createdAt)}</span>
                        {isMyMessage && (
                          isRead ? (
                            <CheckCheck className="h-3 w-3" />
                          ) : (
                            <Clock className="h-3 w-3" />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
              
              {/* Scroll to bottom button */}
              {showScrollToBottom && (
                <button
                  onClick={() => {
                    setIsUserScrolling(false);
                    scrollToBottom(true);
                  }}
                  className="absolute bottom-4 right-4 w-10 h-10 bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 z-10"
                  aria-label="스크롤 하단으로 이동"
                >
                  <ArrowDown className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Message input */}
            <div className="bg-white border-t border-gray-200 p-3 sm:p-4 flex-shrink-0">
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
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm sm:text-base text-gray-900 placeholder-gray-500 bg-white"
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
                  className="flex items-center justify-center p-2 sm:p-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </form>
            </div>
          </div>
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

// 래퍼 컴포넌트 - NotificationProvider 포함
export default function ChatPage() {
  return (
    <NotificationProvider>
      <ChatPageContent />
    </NotificationProvider>
  );
}
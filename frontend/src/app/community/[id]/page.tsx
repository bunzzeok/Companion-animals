'use client'

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { communityAPI, commentAPI, apiUtils, type CommunityPost, type Comment, type ApiResponse } from '../../../lib/api';
import { useAuth } from '../../../hooks/useAuth';
import { 
  ArrowLeft, 
  Heart, 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Eye, 
  Clock, 
  MapPin,
  Flag,
  MoreHorizontal,
  Send
} from 'lucide-react';

// Local interface for compatibility
interface LocalPost extends Omit<CommunityPost, 'likes' | 'dislikes' | 'bookmarks'> {
  likes: number;
  dislikes: number;
  bookmarks: number;
}

// 커뮤니티 상세 페이지 컴포넌트
export default function CommunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Authentication
  const { user, isAuthenticated } = useAuth();
  
  // State management
  const [post, setPost] = useState<LocalPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [postId, setPostId] = useState<string>('');

  // 게시글과 댓글 데이터 로드
  useEffect(() => {
    const loadPostData = async () => {
      try {
        setLoading(true);
        
        // Resolve params promise first
        const resolvedParams = await params;
        setPostId(resolvedParams.id);
        
        // Load post data
        const postResponse = await communityAPI.getPost(resolvedParams.id);
        
        if (apiUtils.isSuccess(postResponse)) {
          const postData = apiUtils.getData(postResponse);
          
          // Convert to LocalPost format
          const localPost: LocalPost = {
            ...postData,
            likes: postData.likesCount || postData.likes?.length || 0,
            dislikes: postData.dislikesCount || postData.dislikes?.length || 0,
            bookmarks: postData.bookmarksCount || postData.bookmarks?.length || 0,
          };
          
          setPost(localPost);
          
          // Load comments
          loadComments(resolvedParams.id);
        } else {
          console.error('Failed to load post from API');
          setPost(null);
        }
        
      } catch (error) {
        console.error('게시글 로드 실패:', error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    loadPostData();
  }, []);

  // Load comments from API
  const loadComments = async (postId: string) => {
    try {
      setCommentsLoading(true);
      
      const response = await commentAPI.getComments(postId, { page: 1, limit: 50 });
      
      if (apiUtils.isSuccess(response)) {
        const commentsData = apiUtils.getData(response) || [];
        setComments(commentsData);
      } else {
        console.error('Failed to load comments from API');
        setComments([]);
      }
    } catch (error) {
      console.error('Failed to load comments:', error);
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  };


  // 좋아요/싫어요 토글
  const handleLikeToggle = async (type: 'like' | 'dislike') => {
    if (!post || !isAuthenticated) return;
    
    try {
      let response;
      if (type === 'like') {
        response = await communityAPI.toggleLike(post._id);
      } else {
        response = await communityAPI.toggleDislike(post._id);
      }
      
      if (apiUtils.isSuccess(response)) {
        const result = apiUtils.getData(response);
        
        setPost(prev => {
          if (!prev) return null;
          
          if (type === 'like') {
            return {
              ...prev,
              likes: result.likesCount || 0,
              isLiked: result.isLiked || false,
              isDisliked: false,
              likesCount: result.likesCount || 0
            };
          } else {
            return {
              ...prev,
              dislikes: result.dislikesCount || 0,
              isDisliked: result.isDisliked || false,
              isLiked: false,
              dislikesCount: result.dislikesCount || 0
            };
          }
        });
      }
    } catch (error) {
      console.error(`Failed to toggle ${type}:`, error);
    }
  };

  // 북마크 토글
  const handleBookmarkToggle = async () => {
    if (!post || !isAuthenticated) return;
    
    try {
      const response = await communityAPI.toggleBookmark(post._id);
      
      if (apiUtils.isSuccess(response)) {
        const result = apiUtils.getData(response);
        
        setPost(prev => {
          if (!prev) return null;
          return {
            ...prev,
            bookmarks: result.bookmarksCount || 0,
            isBookmarked: result.isBookmarked || false,
            bookmarksCount: result.bookmarksCount || 0
          };
        });
      }
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
    }
  };

  // 댓글 작성
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !post || !isAuthenticated || !user) return;

    try {
      const response = await commentAPI.createComment(post._id, {
        content: newComment.trim(),
        parentComment: replyingTo || undefined
      });

      if (apiUtils.isSuccess(response)) {
        const newCommentData = apiUtils.getData(response);
        
        if (replyingTo) {
          // Add as reply
          setComments(prev =>
            prev.map(comment =>
              comment._id === replyingTo
                ? {
                    ...comment,
                    replies: [...(comment.replies || []), newCommentData]
                  }
                : comment
            )
          );
          setReplyingTo(null);
          setReplyContent('');
        } else {
          // Add as new comment
          setComments(prev => [newCommentData, ...prev]);
        }
        
        setNewComment('');
        
        // Update post comment count
        setPost(prev => prev ? { ...prev, commentsCount: prev.commentsCount + 1 } : null);
      }
    } catch (error) {
      console.error('Failed to create comment:', error);
    }
  };

  // 대댓글 작성
  const handleReplySubmit = async (parentCommentId: string) => {
    if (!replyContent.trim() || !post || !isAuthenticated || !user) return;

    try {
      const response = await commentAPI.createComment(post._id, {
        content: replyContent.trim(),
        parentComment: parentCommentId
      });

      if (apiUtils.isSuccess(response)) {
        const newReplyData = apiUtils.getData(response);
        
        setComments(prev =>
          prev.map(comment =>
            comment._id === parentCommentId
              ? {
                  ...comment,
                  replies: [...(comment.replies || []), newReplyData]
                }
              : comment
          )
        );
        
        setReplyingTo(null);
        setReplyContent('');
        
        // Update post comment count
        setPost(prev => prev ? { ...prev, commentsCount: prev.commentsCount + 1 } : null);
      }
    } catch (error) {
      console.error('Failed to create reply:', error);
    }
  };

  // 댓글 좋아요 토글
  const handleCommentLike = async (commentId: string) => {
    if (!isAuthenticated) return;

    try {
      const response = await commentAPI.toggleLike(commentId);
      
      if (apiUtils.isSuccess(response)) {
        const result = apiUtils.getData(response);
        
        const updateCommentLike = (comments: Comment[]): Comment[] => {
          return comments.map(comment => {
            if (comment._id === commentId) {
              return {
                ...comment,
                likesCount: result.likesCount || 0,
                isLiked: result.isLiked || false
              };
            }
            if (comment.replies && comment.replies.length > 0) {
              return {
                ...comment,
                replies: updateCommentLike(comment.replies)
              };
            }
            return comment;
          });
        };
        
        setComments(prev => updateCommentLike(prev));
      }
    } catch (error) {
      console.error('Failed to toggle comment like:', error);
    }
  };

  // 시간 포맷팅
  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return '방금 전';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    return `${Math.floor(diffInSeconds / 86400)}일 전`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">게시글을 찾을 수 없습니다</h2>
          <p className="text-gray-600 mb-4">삭제되었거나 존재하지 않는 게시글입니다.</p>
          <Link 
            href="/community"
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            커뮤니티로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center min-w-0">
              {/* 뒤로가기 버튼 */}
              <Link 
                href="/community" 
                className="mr-2 sm:mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
              </Link>
              
              {/* 로고 */}
              <Link href="/" className="flex items-center space-x-1 sm:space-x-2">
                <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500 flex-shrink-0" />
                <span className="text-base sm:text-xl font-bold text-gray-900 truncate">
                  <span className="hidden xs:inline">Companion Animals</span>
                  <span className="xs:hidden">반려동물</span>
                </span>
              </Link>
            </div>

            {/* 액션 버튼들 */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center">
                <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center">
                <MoreHorizontal className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* 게시글 내용 */}
        <article className="bg-white rounded-2xl shadow-sm p-8 mb-6">
          {/* 게시글 헤더 */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-pink-100 text-pink-700 text-sm px-3 py-1 rounded-full font-medium">
                {post.category}
              </span>
              {post.location && (
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{post.location.district}, {post.location.city}</span>
                </div>
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {post.author.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{post.author.name}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{formatTimeAgo(post.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{post.views}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.commentsCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 게시글 내용 */}
          <div className="prose max-w-none mb-6">
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {post.content}
            </div>
          </div>

          {/* 이미지들 */}
          {post.images && post.images.length > 0 && (
            <div className="mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {post.images.map((image, index) => (
                  <div key={index} className="aspect-square bg-gray-200 rounded-xl overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Heart className="h-12 w-12" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 태그들 */}
          {post.tags && post.tags.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 액션 버튼들 */}
          <div className="pt-6 border-t border-gray-100">
            {/* 좋아요/북마크 버튼들 */}
            <div className="flex items-center gap-3 mb-4">
              <button 
                onClick={() => handleLikeToggle('like')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  post.isLiked 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <ThumbsUp className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                <span className="hidden sm:inline">{post.likes}</span>
              </button>
              
              <button 
                onClick={() => handleLikeToggle('dislike')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  post.isDisliked 
                    ? 'bg-red-100 text-red-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <ThumbsDown className={`h-4 w-4 ${post.isDisliked ? 'fill-current' : ''}`} />
                <span className="hidden sm:inline">{post.dislikes}</span>
              </button>
              
              <button 
                onClick={handleBookmarkToggle}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  post.isBookmarked 
                    ? 'bg-yellow-100 text-yellow-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Bookmark className={`h-4 w-4 ${post.isBookmarked ? 'fill-current' : ''}`} />
                <span className="hidden sm:inline">{post.bookmarks}</span>
              </button>
            </div>

            {/* 공유/신고 버튼들 */}
            <div className="flex items-center gap-2 justify-end">
              <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">공유</span>
              </button>
              
              <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                <Flag className="h-4 w-4" />
                <span className="hidden sm:inline">신고</span>
              </button>
            </div>
          </div>
        </article>

        {/* 댓글 섹션 */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            댓글 {comments.length}개
          </h2>

          {/* 댓글 작성 폼 */}
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium text-gray-600">나</span>
              </div>
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="댓글을 작성해주세요..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none"
                  rows={3}
                />
                <div className="flex justify-end mt-3">
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                      newComment.trim()
                        ? 'bg-orange-500 text-white hover:bg-orange-600'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <Send className="h-4 w-4" />
                    댓글 작성
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* 댓글 목록 */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment._id} className="flex gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-gray-600">
                    {comment.author.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{comment.author.name}</span>
                      <span className="text-sm text-gray-500">{formatTimeAgo(comment.createdAt)}</span>
                    </div>
                    <p className="text-gray-800 mb-3">{comment.content}</p>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => handleCommentLike(comment._id)}
                        className={`flex items-center gap-1 text-sm transition-colors ${
                          comment.isLiked 
                            ? 'text-blue-600' 
                            : 'text-gray-500 hover:text-blue-600'
                        }`}
                      >
                        <ThumbsUp className={`h-3 w-3 ${comment.isLiked ? 'fill-current' : ''}`} />
                        <span>{comment.likesCount || 0}</span>
                      </button>
                      <button 
                        onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                        className="text-sm text-gray-500 hover:text-orange-600 transition-colors"
                      >
                        답글
                      </button>
                    </div>

                    {/* 답글 작성 폼 */}
                    {replyingTo === comment._id && (
                      <div className="mt-4 pl-4 border-l-2 border-orange-200">
                        <div className="flex gap-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-medium text-gray-600">
                              {user?.name?.charAt(0) || '나'}
                            </span>
                          </div>
                          <div className="flex-1">
                            <textarea
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                              placeholder="답글을 작성해주세요..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none text-sm"
                              rows={2}
                            />
                            <div className="flex justify-end gap-2 mt-2">
                              <button
                                onClick={() => {
                                  setReplyingTo(null);
                                  setReplyContent('');
                                }}
                                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                              >
                                취소
                              </button>
                              <button
                                onClick={() => handleReplySubmit(comment._id)}
                                disabled={!replyContent.trim()}
                                className={`px-4 py-1 text-sm rounded-lg transition-colors ${
                                  replyContent.trim()
                                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                              >
                                답글 작성
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 대댓글들 */}
                  {comment.replies && comment.replies.map((reply) => (
                    <div key={reply._id} className="flex gap-4 mt-4 ml-8">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium text-gray-600">
                          {reply.author.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-50 rounded-xl p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900 text-sm">{reply.author.name}</span>
                            <span className="text-xs text-gray-500">{formatTimeAgo(reply.createdAt)}</span>
                          </div>
                          <p className="text-gray-800 text-sm mb-2">{reply.content}</p>
                          <button 
                            onClick={() => handleCommentLike(reply._id)}
                            className={`flex items-center gap-1 text-xs transition-colors ${
                              reply.isLiked 
                                ? 'text-blue-600' 
                                : 'text-gray-500 hover:text-blue-600'
                            }`}
                          >
                            <ThumbsUp className={`h-3 w-3 ${reply.isLiked ? 'fill-current' : ''}`} />
                            <span>{reply.likesCount || 0}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )) || null}
                </div>
              </div>
            ))}
          </div>

          {comments.length === 0 && (
            <div className="text-center py-12">
              <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">아직 댓글이 없습니다.</p>
              <p className="text-gray-400 text-sm">첫 번째 댓글을 작성해보세요!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Community = require('../models/Community');
const { protect, authorize } = require('../middleware/auth');

// GET /api/comments/:postId - 특정 게시글의 댓글 목록 조회
router.get('/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const { page = 1, limit = 20, sort = 'createdAt', order = 'asc' } = req.query;

    const comments = await Comment.findByPost(postId, {
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      sort,
      order: order === 'desc' ? -1 : 1,
      includeReplies: true
    });

    const total = await Comment.countDocuments({ 
      post: postId, 
      status: 'active',
      parentComment: null // 최상위 댓글만 카운트
    });

    // 각 댓글에 추가 정보 계산
    const commentsWithStats = comments.map(comment => {
      const commentObj = comment.toObject();
      commentObj.likesCount = comment.likes.length;
      commentObj.dislikesCount = comment.dislikes.length;
      commentObj.repliesCount = comment.replies ? comment.replies.length : 0;
      return commentObj;
    });

    res.json({
      success: true,
      data: commentsWithStats,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({
      success: false,
      message: '댓글을 가져오는데 실패했습니다.',
      error: error.message
    });
  }
});

// GET /api/comments/:commentId/replies - 특정 댓글의 대댓글 목록 조회
router.get('/:commentId/replies', async (req, res) => {
  try {
    const { commentId } = req.params;
    const { limit = 10 } = req.query;

    const replies = await Comment.findReplies(commentId, parseInt(limit));

    const repliesWithStats = replies.map(reply => {
      const replyObj = reply.toObject();
      replyObj.likesCount = reply.likes.length;
      replyObj.dislikesCount = reply.dislikes.length;
      return replyObj;
    });

    res.json({
      success: true,
      data: repliesWithStats
    });
  } catch (error) {
    console.error('Get replies error:', error);
    res.status(500).json({
      success: false,
      message: '대댓글을 가져오는데 실패했습니다.',
      error: error.message
    });
  }
});

// POST /api/comments - 댓글 작성 (인증 필요)
router.post('/', protect, async (req, res) => {
  try {
    const { postId, content, parentComment } = req.body;

    // 게시글 존재 확인
    const post = await Community.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: '게시글을 찾을 수 없습니다.'
      });
    }

    // 부모 댓글이 있는 경우 존재 확인
    if (parentComment) {
      const parentCommentDoc = await Comment.findById(parentComment);
      if (!parentCommentDoc) {
        return res.status(404).json({
          success: false,
          message: '부모 댓글을 찾을 수 없습니다.'
        });
      }
      
      // 댓글 깊이 확인 (최대 3단계)
      if (parentCommentDoc.depth >= 3) {
        return res.status(400).json({
          success: false,
          message: '댓글 깊이가 최대치를 초과했습니다.'
        });
      }
    }

    const commentData = {
      content,
      author: req.user._id,
      post: postId,
      parentComment: parentComment || null
    };

    const comment = await Comment.create(commentData);
    
    // 게시글의 댓글 수 증가
    await post.updateCommentsCount(true);

    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'name profileImage')
      .populate('parentComment', 'author content');

    res.status(201).json({
      success: true,
      data: populatedComment,
      message: '댓글이 성공적으로 작성되었습니다.'
    });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(400).json({
      success: false,
      message: '댓글 작성에 실패했습니다.',
      error: error.message
    });
  }
});

// PUT /api/comments/:id - 댓글 수정 (작성자만)
router.put('/:id', protect, async (req, res) => {
  try {
    const { content } = req.body;
    
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: '댓글을 찾을 수 없습니다.'
      });
    }

    // 작성자 확인
    if (comment.author.toString() !== req.user._id.toString() && req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '수정 권한이 없습니다.'
      });
    }

    // 수정 이력 추가
    comment.addEditHistory();
    comment.content = content;
    
    await comment.save();

    const updatedComment = await Comment.findById(comment._id)
      .populate('author', 'name profileImage');

    res.json({
      success: true,
      data: updatedComment,
      message: '댓글이 성공적으로 수정되었습니다.'
    });
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(400).json({
      success: false,
      message: '댓글 수정에 실패했습니다.',
      error: error.message
    });
  }
});

// DELETE /api/comments/:id - 댓글 삭제 (작성자만)
router.delete('/:id', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: '댓글을 찾을 수 없습니다.'
      });
    }

    // 작성자 확인
    if (comment.author.toString() !== req.user._id.toString() && req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '삭제 권한이 없습니다.'
      });
    }

    // 하위 댓글이 있는지 확인
    const hasReplies = await Comment.countDocuments({ 
      parentComment: comment._id, 
      status: 'active' 
    });

    if (hasReplies > 0) {
      // 하위 댓글이 있으면 내용만 삭제하고 구조는 유지
      comment.content = '삭제된 댓글입니다.';
      comment.status = 'deleted';
    } else {
      // 하위 댓글이 없으면 완전 삭제
      comment.status = 'deleted';
    }

    await comment.save();

    // 게시글의 댓글 수 감소
    const post = await Community.findById(comment.post);
    if (post) {
      await post.updateCommentsCount(false);
    }

    res.json({
      success: true,
      message: '댓글이 성공적으로 삭제되었습니다.'
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({
      success: false,
      message: '댓글 삭제에 실패했습니다.',
      error: error.message
    });
  }
});

// POST /api/comments/:id/like - 댓글 좋아요 토글 (인증 필요)
router.post('/:id/like', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: '댓글을 찾을 수 없습니다.'
      });
    }

    const result = comment.toggleLike(req.user._id);
    await comment.save();

    res.json({
      success: true,
      data: result,
      message: result.liked ? '좋아요를 눌렀습니다.' : '좋아요를 취소했습니다.'
    });
  } catch (error) {
    console.error('Toggle comment like error:', error);
    res.status(500).json({
      success: false,
      message: '좋아요 처리에 실패했습니다.',
      error: error.message
    });
  }
});

// POST /api/comments/:id/dislike - 댓글 싫어요 토글 (인증 필요)
router.post('/:id/dislike', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: '댓글을 찾을 수 없습니다.'
      });
    }

    const result = comment.toggleDislike(req.user._id);
    await comment.save();

    res.json({
      success: true,
      data: result,
      message: result.disliked ? '싫어요를 눌렀습니다.' : '싫어요를 취소했습니다.'
    });
  } catch (error) {
    console.error('Toggle comment dislike error:', error);
    res.status(500).json({
      success: false,
      message: '싫어요 처리에 실패했습니다.',
      error: error.message
    });
  }
});

// POST /api/comments/:id/accept - 댓글 채택 (게시글 작성자만)
router.post('/:id/accept', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id).populate('post');
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: '댓글을 찾을 수 없습니다.'
      });
    }

    // 게시글 작성자 확인
    if (comment.post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: '댓글 채택 권한이 없습니다. 게시글 작성자만 채택할 수 있습니다.'
      });
    }

    // Q&A 카테고리인지 확인
    if (comment.post.category !== 'question') {
      return res.status(400).json({
        success: false,
        message: 'Q&A 게시글에서만 댓글을 채택할 수 있습니다.'
      });
    }

    // 다른 채택된 댓글이 있는지 확인
    const existingAccepted = await Comment.findOne({
      post: comment.post._id,
      isAccepted: true,
      status: 'active'
    });

    if (existingAccepted) {
      return res.status(400).json({
        success: false,
        message: '이미 채택된 댓글이 있습니다. 먼저 기존 채택을 취소해주세요.'
      });
    }

    await comment.markAsAccepted(req.user._id);

    const updatedComment = await Comment.findById(comment._id)
      .populate('author', 'name profileImage');

    res.json({
      success: true,
      data: updatedComment,
      message: '댓글이 채택되었습니다.'
    });
  } catch (error) {
    console.error('Accept comment error:', error);
    res.status(500).json({
      success: false,
      message: '댓글 채택에 실패했습니다.',
      error: error.message
    });
  }
});

// POST /api/comments/:id/pin - 댓글 고정 (게시글 작성자 또는 관리자)
router.post('/:id/pin', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id).populate('post');
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: '댓글을 찾을 수 없습니다.'
      });
    }

    // 권한 확인 (게시글 작성자 또는 관리자)
    if (comment.post.author.toString() !== req.user._id.toString() && req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '댓글 고정 권한이 없습니다.'
      });
    }

    comment.isPinned = !comment.isPinned;
    if (comment.isPinned) {
      comment.pinnedAt = new Date();
      comment.pinnedBy = req.user._id;
    } else {
      comment.pinnedAt = undefined;
      comment.pinnedBy = undefined;
    }

    await comment.save();

    const updatedComment = await Comment.findById(comment._id)
      .populate('author', 'name profileImage');

    res.json({
      success: true,
      data: updatedComment,
      message: comment.isPinned ? '댓글이 고정되었습니다.' : '댓글 고정이 해제되었습니다.'
    });
  } catch (error) {
    console.error('Pin comment error:', error);
    res.status(500).json({
      success: false,
      message: '댓글 고정 처리에 실패했습니다.',
      error: error.message
    });
  }
});

// POST /api/comments/:id/report - 댓글 신고 (인증 필요)
router.post('/:id/report', protect, async (req, res) => {
  try {
    const { reason, description } = req.body;
    
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: '댓글을 찾을 수 없습니다.'
      });
    }

    // 자신의 댓글은 신고할 수 없음
    if (comment.author.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: '자신의 댓글은 신고할 수 없습니다.'
      });
    }

    // 이미 신고했는지 확인
    const existingReport = comment.reports.find(
      report => report.reporter.toString() === req.user._id.toString()
    );

    if (existingReport) {
      return res.status(400).json({
        success: false,
        message: '이미 신고한 댓글입니다.'
      });
    }

    comment.reports.push({
      reporter: req.user._id,
      reason,
      description
    });

    await comment.save();

    res.json({
      success: true,
      message: '댓글이 신고되었습니다. 검토 후 조치하겠습니다.'
    });
  } catch (error) {
    console.error('Report comment error:', error);
    res.status(500).json({
      success: false,
      message: '댓글 신고에 실패했습니다.',
      error: error.message
    });
  }
});

// GET /api/comments/tree/:postId - 댓글 트리 구조로 조회
router.get('/tree/:postId', async (req, res) => {
  try {
    const { postId } = req.params;

    const commentTree = await Comment.getCommentTree(postId);

    res.json({
      success: true,
      data: commentTree
    });
  } catch (error) {
    console.error('Get comment tree error:', error);
    res.status(500).json({
      success: false,
      message: '댓글 트리를 가져오는데 실패했습니다.',
      error: error.message
    });
  }
});

module.exports = router;
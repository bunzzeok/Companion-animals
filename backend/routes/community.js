const express = require('express');
const router = express.Router();
const Community = require('../models/Community');
const Comment = require('../models/Comment');
const User = require('../models/User');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

// GET /api/community - 커뮤니티 게시글 목록 조회
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      sort = 'createdAt',
      order = 'desc',
      category,
      search,
      tags,
      city,
      district,
      featured
    } = req.query;

    // 필터 객체 생성
    const filters = { status: 'active' };
    
    if (category) filters.category = category;
    if (city) filters['location.city'] = new RegExp(city, 'i');
    if (district) filters['location.district'] = new RegExp(district, 'i');
    if (featured !== undefined) filters.featured = featured === 'true';
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      filters.tags = { $in: tagArray };
    }

    // 텍스트 검색
    if (search) {
      filters.$text = { $search: search };
    }

    // 정렬 객체 생성
    const sortObj = {};
    if (sort === 'popular') {
      sortObj.views = -1;
      sortObj.createdAt = -1;
    } else if (sort === 'likes') {
      sortObj['likes.length'] = -1;
      sortObj.createdAt = -1;
    } else {
      sortObj[sort] = order === 'desc' ? -1 : 1;
    }

    // 페이징 계산
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // 쿼리 실행
    const posts = await Community.find(filters)
      .populate('author', 'name profileImage')
      .sort(sortObj)
      .limit(parseInt(limit))
      .skip(skip);

    // 총 개수 조회
    const total = await Community.countDocuments(filters);

    // 각 게시글에 추가 정보 계산
    const postsWithStats = posts.map(post => {
      const postObj = post.toObject();
      postObj.likesCount = post.likes.length;
      postObj.dislikesCount = post.dislikes.length;
      postObj.bookmarksCount = post.bookmarks.length;
      return postObj;
    });

    res.json({
      success: true,
      data: postsWithStats,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get community posts error:', error);
    res.status(500).json({
      success: false,
      message: '커뮤니티 게시글을 가져오는데 실패했습니다.',
      error: error.message
    });
  }
});

// GET /api/community/categories - 카테고리별 통계
router.get('/categories', async (req, res) => {
  try {
    const categoryStats = await Community.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalViews: { $sum: '$views' },
          totalComments: { $sum: '$commentsCount' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: categoryStats
    });
  } catch (error) {
    console.error('Get category stats error:', error);
    res.status(500).json({
      success: false,
      message: '카테고리 통계를 가져오는데 실패했습니다.',
      error: error.message
    });
  }
});

// GET /api/community/featured - 추천 게시글 목록
router.get('/featured', async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    const posts = await Community.find({ 
      status: 'active', 
      isPinned: true 
    })
      .populate('author', 'name profileImage')
      .sort({ pinnedAt: -1 })
      .limit(parseInt(limit));

    const postsWithStats = posts.map(post => {
      const postObj = post.toObject();
      postObj.likesCount = post.likes.length;
      postObj.dislikesCount = post.dislikes.length;
      postObj.bookmarksCount = post.bookmarks.length;
      return postObj;
    });

    res.json({
      success: true,
      data: postsWithStats
    });
  } catch (error) {
    console.error('Get featured posts error:', error);
    res.status(500).json({
      success: false,
      message: '추천 게시글을 가져오는데 실패했습니다.',
      error: error.message
    });
  }
});

// GET /api/community/popular - 인기 게시글 목록
router.get('/popular', async (req, res) => {
  try {
    const { limit = 10, period = 'week' } = req.query;
    
    // 기간 설정
    const now = new Date();
    let startDate;
    switch (period) {
      case 'day':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const posts = await Community.find({ 
      status: 'active',
      createdAt: { $gte: startDate }
    })
      .populate('author', 'name profileImage')
      .sort({ views: -1, createdAt: -1 })
      .limit(parseInt(limit));

    const postsWithStats = posts.map(post => {
      const postObj = post.toObject();
      postObj.likesCount = post.likes.length;
      postObj.dislikesCount = post.dislikes.length;
      postObj.bookmarksCount = post.bookmarks.length;
      return postObj;
    });

    res.json({
      success: true,
      data: postsWithStats
    });
  } catch (error) {
    console.error('Get popular posts error:', error);
    res.status(500).json({
      success: false,
      message: '인기 게시글을 가져오는데 실패했습니다.',
      error: error.message
    });
  }
});

// GET /api/community/statistics - 공개 커뮤니티 통계 (홈페이지용)
router.get('/statistics', optionalAuth, async (req, res) => {
  try {
    // Get basic community statistics that are safe for public viewing
    const [
      totalPosts,
      activePosts,
      totalUsers,
      recentPosts
    ] = await Promise.all([
      Community.countDocuments(),
      Community.countDocuments({ status: 'active' }),
      Community.distinct('author').then(authors => authors.length),
      Community.countDocuments({ 
        status: 'active',
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
      })
    ]);

    // Get category distribution
    const categoryStats = await Community.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get popular tags (limit for public viewing)
    const popularTags = await Community.aggregate([
      { $match: { status: 'active' } },
      { $unwind: '$tags' },
      {
        $group: {
          _id: '$tags',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 } // Limit to top 10 for public API
    ]);

    const statistics = {
      // Main stats for homepage
      posts: activePosts,
      members: totalUsers,
      categories: categoryStats.length,
      recentActivity: recentPosts,
      
      // Detailed breakdown
      community: {
        totalPosts: totalPosts,
        activePosts: activePosts,
        activeMembers: totalUsers,
        recentPosts: recentPosts
      },
      categoryBreakdown: categoryStats.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      popularTags: popularTags.map(tag => ({
        name: tag._id,
        count: tag.count
      }))
    };

    res.json({
      success: true,
      data: statistics
    });

    console.log(`✅ Public community statistics retrieved`);

  } catch (error) {
    console.error('Get public community statistics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve community statistics'
    });
  }
});

// GET /api/community/:id - 특정 게시글 상세 조회
router.get('/:id', async (req, res) => {
  try {
    const post = await Community.findById(req.params.id)
      .populate('author', 'name profileImage phone email bio createdAt')
      .populate({
        path: 'commentsVirtual',
        match: { status: 'active' },
        populate: {
          path: 'author',
          select: 'name profileImage'
        },
        options: { sort: { createdAt: -1 } }
      });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: '게시글을 찾을 수 없습니다.'
      });
    }

    // 조회수 증가
    post.incrementViews();

    // 추가 통계 정보 계산
    const postObj = post.toObject();
    postObj.likesCount = post.likes.length;
    postObj.dislikesCount = post.dislikes.length;
    postObj.bookmarksCount = post.bookmarks.length;

    res.json({
      success: true,
      data: postObj
    });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({
      success: false,
      message: '게시글을 가져오는데 실패했습니다.',
      error: error.message
    });
  }
});

// POST /api/community - 새 게시글 작성 (인증 필요)
router.post('/', protect, upload.array('images', 5), async (req, res) => {
  try {
    const postData = {
      ...req.body,
      author: req.user._id
    };

    // 업로드된 이미지 파일 경로 추가
    if (req.files && req.files.length > 0) {
      postData.images = req.files.map(file => file.path);
    }

    // tags가 문자열로 전송된 경우 배열로 변환
    if (typeof postData.tags === 'string') {
      postData.tags = postData.tags.split(',').map(tag => tag.trim());
    }

    // location 정보 파싱
    if (typeof postData.location === 'string') {
      postData.location = JSON.parse(postData.location);
    }

    const post = await Community.create(postData);
    
    const populatedPost = await Community.findById(post._id)
      .populate('author', 'name profileImage');

    res.status(201).json({
      success: true,
      data: populatedPost,
      message: '게시글이 성공적으로 작성되었습니다.'
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(400).json({
      success: false,
      message: '게시글 작성에 실패했습니다.',
      error: error.message
    });
  }
});

// PUT /api/community/:id - 게시글 수정 (작성자만)
router.put('/:id', protect, upload.array('images', 5), async (req, res) => {
  try {
    const post = await Community.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: '게시글을 찾을 수 없습니다.'
      });
    }

    // 작성자 확인
    if (post.author.toString() !== req.user._id.toString() && req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '수정 권한이 없습니다.'
      });
    }

    // 수정 이력 추가
    post.addEditHistory(req.user._id, req.body.editReason);

    const updateData = { ...req.body };

    // 새 이미지가 업로드된 경우
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(file => file.path);
    }

    // tags 처리
    if (typeof updateData.tags === 'string') {
      updateData.tags = updateData.tags.split(',').map(tag => tag.trim());
    }

    // location 처리
    if (typeof updateData.location === 'string') {
      updateData.location = JSON.parse(updateData.location);
    }

    const updatedPost = await Community.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('author', 'name profileImage');

    res.json({
      success: true,
      data: updatedPost,
      message: '게시글이 성공적으로 수정되었습니다.'
    });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(400).json({
      success: false,
      message: '게시글 수정에 실패했습니다.',
      error: error.message
    });
  }
});

// DELETE /api/community/:id - 게시글 삭제 (작성자만)
router.delete('/:id', protect, async (req, res) => {
  try {
    const post = await Community.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: '게시글을 찾을 수 없습니다.'
      });
    }

    // 작성자 확인
    if (post.author.toString() !== req.user._id.toString() && req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '삭제 권한이 없습니다.'
      });
    }

    // 소프트 삭제 (상태를 deleted로 변경)
    post.status = 'deleted';
    await post.save();

    res.json({
      success: true,
      message: '게시글이 성공적으로 삭제되었습니다.'
    });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      success: false,
      message: '게시글 삭제에 실패했습니다.',
      error: error.message
    });
  }
});

// POST /api/community/:id/like - 게시글 좋아요 토글 (인증 필요)
router.post('/:id/like', protect, async (req, res) => {
  try {
    const post = await Community.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: '게시글을 찾을 수 없습니다.'
      });
    }

    const result = post.toggleLike(req.user._id);
    await post.save();

    res.json({
      success: true,
      data: result,
      message: result.liked ? '좋아요를 눌렀습니다.' : '좋아요를 취소했습니다.'
    });
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({
      success: false,
      message: '좋아요 처리에 실패했습니다.',
      error: error.message
    });
  }
});

// POST /api/community/:id/dislike - 게시글 싫어요 토글 (인증 필요)
router.post('/:id/dislike', protect, async (req, res) => {
  try {
    const post = await Community.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: '게시글을 찾을 수 없습니다.'
      });
    }

    const result = post.toggleDislike(req.user._id);
    await post.save();

    res.json({
      success: true,
      data: result,
      message: result.disliked ? '싫어요를 눌렀습니다.' : '싫어요를 취소했습니다.'
    });
  } catch (error) {
    console.error('Toggle dislike error:', error);
    res.status(500).json({
      success: false,
      message: '싫어요 처리에 실패했습니다.',
      error: error.message
    });
  }
});

// POST /api/community/:id/bookmark - 게시글 즐겨찾기 토글 (인증 필요)
router.post('/:id/bookmark', protect, async (req, res) => {
  try {
    const post = await Community.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: '게시글을 찾을 수 없습니다.'
      });
    }

    const result = post.toggleBookmark(req.user._id);
    await post.save();

    res.json({
      success: true,
      data: result,
      message: result.bookmarked ? '즐겨찾기에 추가했습니다.' : '즐겨찾기에서 제거했습니다.'
    });
  } catch (error) {
    console.error('Toggle bookmark error:', error);
    res.status(500).json({
      success: false,
      message: '즐겨찾기 처리에 실패했습니다.',
      error: error.message
    });
  }
});

// GET /api/community/:id/comments - 게시글의 댓글 목록 조회
router.get('/:id/comments', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const comments = await Comment.findByPost(req.params.id, {
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      includeReplies: true
    });

    const total = await Comment.countDocuments({ 
      post: req.params.id, 
      status: 'active' 
    });

    res.json({
      success: true,
      data: comments,
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

// POST /api/community/:id/comments - 댓글 작성 (인증 필요)
router.post('/:id/comments', protect, async (req, res) => {
  try {
    const { content, parentComment } = req.body;

    const post = await Community.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: '게시글을 찾을 수 없습니다.'
      });
    }

    const commentData = {
      content,
      author: req.user._id,
      post: req.params.id,
      parentComment: parentComment || null
    };

    const comment = await Comment.create(commentData);
    
    // 게시글의 댓글 수 증가
    await post.updateCommentsCount(true);

    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'name profileImage');

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

// GET /api/community/user/:userId - 특정 사용자의 게시글 목록
router.get('/user/:userId', async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const posts = await Community.find({ 
      author: req.params.userId,
      status: { $ne: 'deleted' }
    })
      .populate('author', 'name profileImage')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Community.countDocuments({ 
      author: req.params.userId,
      status: { $ne: 'deleted' }
    });

    const postsWithStats = posts.map(post => {
      const postObj = post.toObject();
      postObj.likesCount = post.likes.length;
      postObj.dislikesCount = post.dislikes.length;
      postObj.bookmarksCount = post.bookmarks.length;
      return postObj;
    });

    res.json({
      success: true,
      data: postsWithStats,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({
      success: false,
      message: '사용자 게시글 목록을 가져오는데 실패했습니다.',
      error: error.message
    });
  }
});

// GET /api/community/statistics/overview - 커뮤니티 통계 (관리자용)
router.get('/statistics/overview', protect, authorize('admin'), async (req, res) => {
  try {
    const stats = await Community.aggregate([
      {
        $group: {
          _id: null,
          totalPosts: { $sum: 1 },
          activePosts: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
          totalViews: { $sum: '$views' },
          totalComments: { $sum: '$commentsCount' },
          totalLikes: { $sum: { $size: '$likes' } }
        }
      }
    ]);

    const categoryStats = await Community.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    const tagStats = await Community.aggregate([
      { $match: { status: 'active' } },
      { $unwind: '$tags' },
      {
        $group: {
          _id: '$tags',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {},
        byCategory: categoryStats,
        popularTags: tagStats
      }
    });
  } catch (error) {
    console.error('Get community statistics error:', error);
    res.status(500).json({
      success: false,
      message: '커뮤니티 통계를 가져오는데 실패했습니다.',
      error: error.message
    });
  }
});

module.exports = router;
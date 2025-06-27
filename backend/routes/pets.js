const express = require('express');
const multer = require('multer');
const path = require('path');
const { body, validationResult, query } = require('express-validator');
const { Pet } = require('../models');
const { 
  authenticate, 
  authorize, 
  requireOwnership,
  optionalAuth 
} = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads with detailed settings
const storage = multer.diskStorage({
  // Define destination directory for uploaded files
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_DIR || 'uploads/pets');
  },
  // Define filename format: timestamp_originalname
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to accept only images and videos
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images (JPEG, JPG, PNG, GIF) and videos (MP4, MOV, AVI) are allowed'));
  }
};

// Multer configuration with size limits
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB default
    files: 10 // Maximum 10 files per request
  }
});

// Validation rules for pet creation and updates
const petValidation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Pet name must be between 1 and 50 characters'),
  
  body('type')
    .isIn(['cat', 'dog', 'other'])
    .withMessage('Pet type must be cat, dog, or other'),
  
  body('breed')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Breed must be between 1 and 100 characters'),
  
  body('age')
    .isIn(['baby', 'young', 'adult', 'senior'])
    .withMessage('Age must be baby, young, adult, or senior'),
  
  body('gender')
    .isIn(['male', 'female', 'unknown'])
    .withMessage('Gender must be male, female, or unknown'),
  
  body('size')
    .isIn(['small', 'medium', 'large'])
    .withMessage('Size must be small, medium, or large'),
  
  body('color')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Color must be between 1 and 100 characters'),
  
  body('weight')
    .optional()
    .isFloat({ min: 0.1, max: 100 })
    .withMessage('Weight must be between 0.1 and 100 kg'),
  
  body('healthStatus')
    .isIn(['healthy', 'needs_treatment', 'chronic_condition'])
    .withMessage('Health status must be healthy, needs_treatment, or chronic_condition'),
  
  body('isVaccinated')
    .isBoolean()
    .withMessage('Vaccination status must be true or false'),
  
  body('isNeutered')
    .isBoolean()
    .withMessage('Neutering status must be true or false'),
  
  body('location.city')
    .trim()
    .isLength({ min: 1 })
    .withMessage('City is required'),
  
  body('location.district')
    .trim()
    .isLength({ min: 1 })
    .withMessage('District is required'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  
  body('adoptionFee')
    .optional()
    .isFloat({ min: 0, max: 1000000 })
    .withMessage('Adoption fee must be between 0 and 1,000,000'),
  
  body('urgency')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Urgency must be low, medium, or high')
];

// Search validation rules for pet filtering
const searchValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  
  query('type')
    .optional()
    .isIn(['cat', 'dog', 'other'])
    .withMessage('Type must be cat, dog, or other'),
  
  query('age')
    .optional()
    .isIn(['baby', 'young', 'adult', 'senior'])
    .withMessage('Age must be baby, young, adult, or senior'),
  
  query('size')
    .optional()
    .isIn(['small', 'medium', 'large'])
    .withMessage('Size must be small, medium, or large'),
  
  query('city')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('City must not be empty'),
  
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'views', 'likes', 'urgency'])
    .withMessage('Sort by must be createdAt, views, likes, or urgency'),
  
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc')
];

// GET /api/pets - Retrieve all pets with filtering and pagination
router.get('/', optionalAuth, searchValidation, async (req, res) => {
  try {
    // Validate query parameters
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Invalid query parameters',
        details: errors.array()
      });
    }

    // Extract and set default values for query parameters
    const {
      page = 1,
      limit = 12,
      type,
      age,
      size,
      gender,
      city,
      district,
      healthStatus,
      urgency,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      featured
    } = req.query;

    // Build search filters object
    const filters = { status: 'available' }; // Only show available pets

    if (type) filters.type = type;
    if (age) filters.age = age;
    if (size) filters.size = size;
    if (gender) filters.gender = gender;
    if (healthStatus) filters.healthStatus = healthStatus;
    if (urgency) filters.urgency = urgency;
    if (featured === 'true') filters.featured = true;

    // Location-based filtering
    if (city) filters['location.city'] = new RegExp(city, 'i');
    if (district) filters['location.district'] = new RegExp(district, 'i');

    // Text search across multiple fields
    if (search) {
      filters.$or = [
        { name: new RegExp(search, 'i') },
        { breed: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { 'location.city': new RegExp(search, 'i') },
        { 'location.district': new RegExp(search, 'i') }
      ];
    }

    // Calculate pagination values
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query with pagination
    const [pets, totalCount] = await Promise.all([
      Pet.find(filters)
        .populate('owner', 'name profileImage location')
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean(), // Use lean() for better performance
      Pet.countDocuments(filters)
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limitNum);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Add user-specific data if authenticated
    if (req.user) {
      pets.forEach(pet => {
        // Check if user liked this pet
        pet.isLiked = pet.likes.some(like => like.toString() === req.user._id.toString());
        // Add like count
        pet.likesCount = pet.likes.length;
      });
    }

    res.json({
      success: true,
      data: pets,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: totalCount,
        itemsPerPage: limitNum,
        hasNextPage,
        hasPrevPage
      }
    });

    console.log(`✅ Pets retrieved: ${pets.length} items (page ${page}/${totalPages})`);

  } catch (error) {
    console.error('Get pets error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve pets'
    });
  }
});

// GET /api/pets/:id - Retrieve single pet details
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Find pet and populate related data
    const pet = await Pet.findById(id)
      .populate('owner', 'name profileImage phone email location createdAt statistics')
      .populate('adoptionRequests', 'status createdAt adopter');

    if (!pet) {
      return res.status(404).json({
        success: false,
        error: 'Pet not found'
      });
    }

    // Increment view count (only once per session/user)
    if (!req.session?.viewedPets?.includes(id)) {
      await pet.incrementViews();
      
      // Track viewed pets in session
      if (!req.session.viewedPets) {
        req.session.viewedPets = [];
      }
      req.session.viewedPets.push(id);
    }

    // Add user-specific data if authenticated
    if (req.user) {
      pet.isLiked = pet.likes.some(like => like.toString() === req.user._id.toString());
      pet.isOwner = pet.owner._id.toString() === req.user._id.toString();
    }

    // Add like count
    pet.likesCount = pet.likes.length;

    res.json({
      success: true,
      data: pet
    });

    console.log(`✅ Pet details retrieved: ${pet.name} (ID: ${id})`);

  } catch (error) {
    console.error('Get pet details error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid pet ID format'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to retrieve pet details'
    });
  }
});

// POST /api/pets - Create new pet listing (providers only)
router.post('/', 
  authenticate, 
  authorize('provider'),
  upload.fields([
    { name: 'images', maxCount: 8 },
    { name: 'videos', maxCount: 2 }
  ]),
  petValidation,
  async (req, res) => {
    try {
      // Validate request data
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Invalid pet data',
          details: errors.array()
        });
      }

      // Extract pet data from request body
      const petData = { ...req.body };
      
      // Add owner information
      petData.owner = req.user._id;

      // Process uploaded files
      if (req.files) {
        // Process images
        if (req.files.images) {
          petData.images = req.files.images.map(file => file.filename);
        }
        
        // Process videos
        if (req.files.videos) {
          petData.videos = req.files.videos.map(file => file.filename);
        }
      }

      // Ensure at least one image is provided
      if (!petData.images || petData.images.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'At least one image is required'
        });
      }

      // Parse JSON fields if they come as strings
      if (typeof petData.location === 'string') {
        petData.location = JSON.parse(petData.location);
      }
      if (typeof petData.temperament === 'string') {
        petData.temperament = JSON.parse(petData.temperament);
      }

      // Create new pet instance
      const newPet = new Pet(petData);
      
      // Save to database
      await newPet.save();

      // Populate owner data for response
      await newPet.populate('owner', 'name profileImage');

      // Update provider statistics
      await req.user.updateOne({ 
        $inc: { 'statistics.petsPosted': 1 } 
      });

      res.status(201).json({
        success: true,
        message: 'Pet listing created successfully',
        data: newPet
      });

      console.log(`✅ New pet created: ${newPet.name} by ${req.user.name}`);

    } catch (error) {
      console.error('Create pet error:', error);
      
      // Handle validation errors
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }));
        
        return res.status(400).json({
          success: false,
          error: 'Pet validation failed',
          details: validationErrors
        });
      }

      res.status(500).json({
        success: false,
        error: 'Failed to create pet listing'
      });
    }
  }
);

// PUT /api/pets/:id - Update pet listing (owners only)
router.put('/:id', 
  authenticate,
  upload.fields([
    { name: 'images', maxCount: 8 },
    { name: 'videos', maxCount: 2 }
  ]),
  petValidation,
  async (req, res) => {
    try {
      const { id } = req.params;

      // Validate request data
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Invalid pet data',
          details: errors.array()
        });
      }

      // Find existing pet
      const existingPet = await Pet.findById(id);
      if (!existingPet) {
        return res.status(404).json({
          success: false,
          error: 'Pet not found'
        });
      }

      // Check ownership (only owner or admin can update)
      if (existingPet.owner.toString() !== req.user._id.toString() && 
          req.user.userType !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Access denied. You can only update your own pets.'
        });
      }

      // Prepare update data
      const updateData = { ...req.body };

      // Process new uploaded files
      if (req.files) {
        if (req.files.images) {
          updateData.images = req.files.images.map(file => file.filename);
        }
        if (req.files.videos) {
          updateData.videos = req.files.videos.map(file => file.filename);
        }
      }

      // Parse JSON fields if necessary
      if (typeof updateData.location === 'string') {
        updateData.location = JSON.parse(updateData.location);
      }
      if (typeof updateData.temperament === 'string') {
        updateData.temperament = JSON.parse(updateData.temperament);
      }

      // Update pet with new data
      const updatedPet = await Pet.findByIdAndUpdate(
        id,
        { $set: updateData },
        { 
          new: true, // Return updated document
          runValidators: true // Run schema validation
        }
      ).populate('owner', 'name profileImage');

      res.json({
        success: true,
        message: 'Pet updated successfully',
        data: updatedPet
      });

      console.log(`✅ Pet updated: ${updatedPet.name} (ID: ${id})`);

    } catch (error) {
      console.error('Update pet error:', error);
      
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: 'Invalid pet ID format'
        });
      }
      
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }));
        
        return res.status(400).json({
          success: false,
          error: 'Pet validation failed',
          details: validationErrors
        });
      }

      res.status(500).json({
        success: false,
        error: 'Failed to update pet'
      });
    }
  }
);

// DELETE /api/pets/:id - Delete pet listing (owners only)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    // Find existing pet
    const pet = await Pet.findById(id);
    if (!pet) {
      return res.status(404).json({
        success: false,
        error: 'Pet not found'
      });
    }

    // Check ownership (only owner or admin can delete)
    if (pet.owner.toString() !== req.user._id.toString() && 
        req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. You can only delete your own pets.'
      });
    }

    // Check if pet has pending adoptions
    const { Adoption } = require('../models');
    const pendingAdoptions = await Adoption.countDocuments({
      pet: id,
      status: { $in: ['pending', 'approved'] }
    });

    if (pendingAdoptions > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete pet with pending adoptions. Please resolve all adoptions first.'
      });
    }

    // Soft delete: mark as removed instead of actual deletion
    await Pet.findByIdAndUpdate(id, { 
      status: 'removed',
      removedAt: new Date()
    });

    res.json({
      success: true,
      message: 'Pet listing removed successfully'
    });

    console.log(`✅ Pet removed: ${pet.name} (ID: ${id}) by ${req.user.name}`);

  } catch (error) {
    console.error('Delete pet error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid pet ID format'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to delete pet'
    });
  }
});

// POST /api/pets/:id/like - Toggle like status for pet
router.post('/:id/like', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    // Find pet
    const pet = await Pet.findById(id);
    if (!pet) {
      return res.status(404).json({
        success: false,
        error: 'Pet not found'
      });
    }

    // Toggle like status
    const result = pet.toggleLike(req.user._id);
    
    // Save pet with updated likes
    await pet.save();

    res.json({
      success: true,
      message: result.liked ? 'Pet liked' : 'Pet unliked',
      data: {
        liked: result.liked,
        likesCount: result.count
      }
    });

    console.log(`✅ Pet ${result.liked ? 'liked' : 'unliked'}: ${pet.name} by ${req.user.name}`);

  } catch (error) {
    console.error('Toggle like error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid pet ID format'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to toggle like status'
    });
  }
});

// GET /api/pets/my/listings - Get user's own pet listings
router.get('/my/listings', authenticate, authorize('provider'), async (req, res) => {
  try {
    const { page = 1, limit = 12, status } = req.query;

    // Build filters
    const filters = { owner: req.user._id };
    if (status && status !== 'all') {
      filters.status = status;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    // Get user's pets with pagination
    const [pets, totalCount] = await Promise.all([
      Pet.find(filters)
        .populate('adoptionRequests', 'status createdAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Pet.countDocuments(filters)
    ]);

    // Add additional statistics for each pet
    const petsWithStats = pets.map(pet => {
      const petObj = pet.toObject();
      petObj.likesCount = pet.likes.length;
      petObj.requestsCount = pet.adoptionRequests.length;
      petObj.pendingRequestsCount = pet.adoptionRequests.filter(
        req => req.status === 'pending'
      ).length;
      return petObj;
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limitNum);

    res.json({
      success: true,
      data: petsWithStats,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: totalCount,
        itemsPerPage: limitNum,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

    console.log(`✅ User pet listings retrieved: ${pets.length} items for ${req.user.name}`);

  } catch (error) {
    console.error('Get user pets error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve your pet listings'
    });
  }
});

// GET /api/pets/featured - Get featured pets
router.get('/featured', optionalAuth, async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    // Get featured pets
    const featuredPets = await Pet.findFeatured(parseInt(limit))
      .populate('owner', 'name profileImage location');

    res.json({
      success: true,
      data: featuredPets
    });

    console.log(`✅ Featured pets retrieved: ${featuredPets.length} items`);

  } catch (error) {
    console.error('Get featured pets error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve featured pets'
    });
  }
});

// GET /api/pets/urgent - Get urgent pets
router.get('/urgent', optionalAuth, async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    // Get urgent pets
    const urgentPets = await Pet.findUrgent(parseInt(limit))
      .populate('owner', 'name profileImage location');

    res.json({
      success: true,
      data: urgentPets
    });

    console.log(`✅ Urgent pets retrieved: ${urgentPets.length} items`);

  } catch (error) {
    console.error('Get urgent pets error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve urgent pets'
    });
  }
});

module.exports = router;
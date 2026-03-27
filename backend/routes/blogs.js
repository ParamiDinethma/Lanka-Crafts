const express = require('express');
const router = express.Router();
const multer = require('multer');
const streamifier = require('streamifier');
const Blog = require('../models/Blog');
const Tourist = require('../models/Tourist');
const cloudinary = require('../config/cloudinary');
const { verifyFirebaseToken } = require('../middleware/auth');


const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 30 * 1024 * 1024 }, // 30 MB
  fileFilter: (_req, file, cb) => {
    const allowed = [
      'image/jpeg', 'image/png', 'image/webp', 'image/gif',
      'video/mp4', 'video/quicktime', 'video/webm',
    ];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Unsupported file type.'));
  },
});


const uploadToCloudinary = (buffer, folder, resourceType = 'auto') =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/tourist/blogs
// Public — list all published blogs with pagination & sorting
// ─────────────────────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, parseInt(req.query.limit) || 12);
  const sort = req.query.sort; // 'recent' | 'liked' | 'workshop'

  let sortObj = { createdAt: -1 }; // default: most recent
  if (sort === 'liked') sortObj = { likeCount: -1, createdAt: -1 };
  if (sort === 'workshop') sortObj = { workshopTag: 1, createdAt: -1 };

  // For 'liked' sort we need to use aggregation to sort by array length
  let blogs, total;

  if (sort === 'liked') {
    const pipeline = [
      { $match: { status: 'published' } },
      { $addFields: { likeCount: { $size: '$likes' } } },
      { $sort: { likeCount: -1, createdAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      {
        $lookup: {
          from: 'tourists',
          localField: 'author',
          foreignField: '_id',
          as: 'authorData',
        },
      },
      {
        $addFields: {
          author: {
            _id: { $arrayElemAt: ['$authorData._id', 0] },
            fullName: { $arrayElemAt: ['$authorData.fullName', 0] },
            country: { $arrayElemAt: ['$authorData.country', 0] },
            initials: { $arrayElemAt: ['$authorData.initials', 0] },
            profilePicUrl: { $arrayElemAt: ['$authorData.profilePicUrl', 0] },
          }
        },
      },
      { $project: { authorData: 0 } },
    ];
    blogs = await Blog.aggregate(pipeline);
    total = await Blog.countDocuments({ status: 'published' });
  } else {
    total = await Blog.countDocuments({ status: 'published' });
    blogs = await Blog.find({ status: 'published' })
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('author', 'fullName country initials profilePicUrl');
  }

  res.json({
    blogs,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  });
});


// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// GET /api/tourist/blogs/me - with TOKEN
// Private — list all published and draft blogs by a specific user
// ─────────────────────────────────────────────────────────────────────────────
router.get('/me', verifyFirebaseToken, async (req, res) => {
  try {
    const blogs = await Blog.find({
      author: req.tourist._id,
      status: { $in: ['published', 'draft'] }
    }).sort({ createdAt: -1 });

    res.json({ blogs });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch personal blogs' });
  }
});



// ─────────────────────────────────────────────────────────────────────────────
// POST /api/tourist/blogs
// Authenticated — create a new blog post (with optional Cloudinary media)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/', verifyFirebaseToken, upload.single('media'), async (req, res) => {
  const { title, content, workshopTag, status } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'title and content are required.' });
  }

  let mediaUrl = '';
  let mediaPublicId = '';
  let mediaType = '';

  if (req.file) {
    const isVideo = req.file.mimetype.startsWith('video/');
    const result = await uploadToCloudinary(
      req.file.buffer,
      'lankacrafts/blogs',
      isVideo ? 'video' : 'image'
    );
    mediaUrl = result.secure_url;
    mediaPublicId = result.public_id;
    mediaType = isVideo ? 'video' : 'image';
  }

  const blog = await Blog.create({
    title,
    content,
    workshopTag: workshopTag || '',
    mediaUrl,
    mediaPublicId,
    mediaType,
    author: req.tourist._id,
    status: status === 'draft' ? 'draft' : 'published',
  });

  // Increment tourist's blogsPosted stat if published
  if (blog.status === 'published') {
    await Tourist.findByIdAndUpdate(req.tourist._id, { $inc: { workshopsAttended: 0 } }); // keep for future
  }

  const populated = await blog.populate('author', 'fullName country initials profilePicUrl');

  res.status(201).json({
    message: `Blog ${blog.status === 'draft' ? 'saved as draft' : 'published'} successfully.`,
    blog: populated,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/tourist/blogs/:id/like
// Authenticated — toggle like on a blog
// ─────────────────────────────────────────────────────────────────────────────
router.patch('/:id/like', verifyFirebaseToken, async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ error: 'Blog not found.' });

  const touristId = req.tourist._id;
  const alreadyLiked = blog.likes.some((id) => id.equals(touristId));

  if (alreadyLiked) {
    blog.likes.pull(touristId);
  } else {
    blog.likes.push(touristId);
  }
  await blog.save();

  res.json({
    liked: !alreadyLiked,
    likeCount: blog.likes.length,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/tourist/blogs/:id
// Authenticated — edit own blog (and update status)
// ─────────────────────────────────────────────────────────────────────────────
router.patch('/:id', verifyFirebaseToken, upload.single('media'), async (req, res) => {
  const { title, content, workshopTag, status } = req.body;
  const blog = await Blog.findById(req.params.id);
  
  if (!blog) return res.status(404).json({ error: 'Blog not found.' });
  if (!blog.author.equals(req.tourist._id)) {
    return res.status(403).json({ error: 'You can only edit your own blogs.' });
  }

  let mediaUrl = blog.mediaUrl;
  let mediaPublicId = blog.mediaPublicId;
  let mediaType = blog.mediaType;

  if (req.file) {
    // If there is an old media, destroy it logic could be added here, omitting for simplicity/safety
    const isVideo = req.file.mimetype.startsWith('video/');
    const result = await uploadToCloudinary(
      req.file.buffer,
      'lankacrafts/blogs',
      isVideo ? 'video' : 'image'
    );
    mediaUrl = result.secure_url;
    mediaPublicId = result.public_id;
    mediaType = isVideo ? 'video' : 'image';
  }

  if (title) blog.title = title;
  if (content) blog.content = content;
  if (workshopTag !== undefined) blog.workshopTag = workshopTag;
  if (mediaUrl) {
    blog.mediaUrl = mediaUrl;
    blog.mediaPublicId = mediaPublicId;
    blog.mediaType = mediaType;
  }
  if (status) {
    blog.status = status;
  }

  await blog.save();

  const populated = await blog.populate('author', 'fullName country initials profilePicUrl');
  res.json({ message: 'Blog updated successfully.', blog: populated });
});

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/tourist/blogs/:id
// Authenticated — soft delete own blog
// ─────────────────────────────────────────────────────────────────────────────
router.delete('/:id', verifyFirebaseToken, async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ error: 'Blog not found.' });

  if (!blog.author.equals(req.tourist._id)) {
    return res.status(403).json({ error: 'You can only delete your own blogs.' });
  }

  blog.status = 'deleted';
  await blog.save();

  res.json({ message: 'Blog deleted successfully.' });
});

module.exports = router;

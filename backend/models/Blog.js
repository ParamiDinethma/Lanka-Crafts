const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Blog content is required'],
    },
    workshopTag: {
      type: String,
      default: '',
    },
    // Cloudinary media
    mediaUrl: {
      type: String,
      default: '',
    },
    mediaPublicId: {
      type: String,
      default: '',
    },
    mediaType: {
      type: String,
      enum: ['image', 'video', ''],
      default: '',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tourist',
      required: true,
    },
    // Array of Tourist ObjectIds who liked this post
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Tourist',
      default: [],
    },
    status: {
      type: String,
      enum: ['published', 'draft'],
      default: 'published',
    },
  },
  { timestamps: true }
);

// Virtual: total like count
blogSchema.virtual('likeCount').get(function () {
  return this.likes.length;
});

blogSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Blog', blogSchema);

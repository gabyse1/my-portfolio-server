import { Schema, model } from 'mongoose';

const projectSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  concept: {
    type: String,
    required: true,
    trim: true,
  },
  tools: {
    type: Array,
    required: true,
  },
  fonts: {
    type: Array,
    required: true,
  },
  colors: {
    type: Array,
    required: true,
  },
  main_image: {
    type: String,
    required: true,
  },
  concept_image: {
    type: String,
    required: true,
  },
  live_url: {
    type: String,
    required: true,
  },
  source_url: {
    type: String,
    required: true,
  },
  highlighted: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
  versionKey: false,
});

const Project = model('Project', projectSchema);

export default Project;

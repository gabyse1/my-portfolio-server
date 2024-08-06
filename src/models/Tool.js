import { Schema, model } from 'mongoose';

const toolSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  icon: {
    type: String,
    required: true,
    trim: true,
  },
}, {
  timestamps: true,
  versionKey: false,
});

const Tool = model('Tool', toolSchema);

export default Tool;

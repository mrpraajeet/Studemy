import { model, Schema } from 'mongoose';

export default model('Course', new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  price: { type: Number, required: true },
  students: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  content: [{ title: { type: String, required: true }, url: { type: String, required: true }}]
}));
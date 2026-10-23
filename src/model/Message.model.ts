import mongoose, { Schema, type Model } from "mongoose";

export interface IMessage {
  userId: string; // the better-auth user id
  content: string;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    userId: { type: String, required: true, index: true },
    content: {
      type: String,
      required: [true, "Message content is required"],
      trim: true,
      maxlength: 500,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

const MessageModel: Model<IMessage> =
  (mongoose.models.Message as Model<IMessage>) ||
  mongoose.model<IMessage>("Message", MessageSchema);

export default MessageModel;

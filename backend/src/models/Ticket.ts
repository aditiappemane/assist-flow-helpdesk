import mongoose, { Document, Schema } from 'mongoose';

export interface ITicket extends Document {
  ticketNumber: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  department: 'IT' | 'HR' | 'Admin';
  createdBy: mongoose.Types.ObjectId;
  assignedTo?: mongoose.Types.ObjectId;
  comments: Array<{
    text: string;
    user: mongoose.Types.ObjectId;
    createdAt: Date;
  }>;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ticketSchema = new Schema<ITicket>(
  {
    ticketNumber: {
      type: String,
      required: true,
      unique: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved', 'closed'],
      default: 'open',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    department: {
      type: String,
      enum: ['IT', 'HR', 'Admin'],
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    comments: [
      {
        text: {
          type: String,
          required: true,
        },
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    attachments: [String],
  },
  {
    timestamps: true,
  }
);

export const Ticket = mongoose.model<ITicket>('Ticket', ticketSchema); 
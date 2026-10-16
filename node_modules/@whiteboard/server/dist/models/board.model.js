import mongoose, { Schema } from 'mongoose';
const BoardSchema = new Schema({
    boardId: {
        type: String,
        required: true,
        unique: true,
        index: true,
        trim: true,
    },
    title: {
        type: String,
        required: true,
        default: 'Untitled Board',
        trim: true,
        maxlength: 100,
    },
    elements: {
        type: [Schema.Types.Mixed],
        default: [],
    },
    schemaVersion: {
        type: Number,
        required: true,
        default: 1,
    },
}, {
    timestamps: true,
    versionKey: false,
});
export const BoardModel = mongoose.model('Board', BoardSchema);

import mongoose from 'mongoose';

// Interface that describes properties to create a new User
interface TicketAttrs {
    title: string;
    price: number;
    userId: string;
}

// An interface that describes the properties the user model has
interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
}

// An interface that describes the properties the user document has
interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    userId: string;
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            // delete ret.__v;
        }
    }
});

// Lets us typecheck when creating new user (don't call new User())
ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs);
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
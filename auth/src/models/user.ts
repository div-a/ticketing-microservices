import mongoose from 'mongoose';
import { Password } from '../services/password';

// Interface that describes properties to create a new User
interface UserAttrs {
    email: string;
    password: string;
}

// An interface that describes the properties the user model has
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties the user document has
interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
});

userSchema.pre('save', async function(done) {
    if (this.isModified('password')){
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed)
    }
    done();
});

// Lets us typecheck when creating new user (don't call new User())
userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
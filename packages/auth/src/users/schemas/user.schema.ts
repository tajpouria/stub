import * as mongoose from 'mongoose';
import { Cipher } from '@tajpouria/stub-common/dist/crypto';

import { User } from '../interfaces/user.interface';
import { usersConstants } from '../constants';

export const UserSchema = new mongoose.Schema<User>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
    },

    pictureURL: {
      type: String,
      default: usersConstants.defaultPictureURL,
    },

    password: String,
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform(doc, ret) {
        const id = doc._id;
        ret.id = id;
        delete ret._id;
        delete ret.createdAt;
        delete ret.updatedAt;
        delete ret.password;
      },
    },
  },
);

UserSchema.pre<User>('save', async function() {
  if (this.isModified('password'))
    this.password = await Cipher.hash(this.password, {});
});

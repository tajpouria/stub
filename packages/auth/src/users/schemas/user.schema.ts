import { Schema } from 'mongoose';
import { Cipher } from '@tajpouria/stub-common';

import { IUser } from 'src/users/interfaces/user.interface';
import { usersConstants } from 'src/users/constants';

export const UserSchema = new Schema<IUser>(
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

UserSchema.pre<IUser>('save', async function() {
  if (this.isModified('password'))
    this.password = await Cipher.hash(this.password, {});
});

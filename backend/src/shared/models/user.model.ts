import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  firstName: String,
  lastName: String,
});

export interface User extends mongoose.Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

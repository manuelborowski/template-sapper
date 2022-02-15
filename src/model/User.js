import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { is_empty } from "lib/misc";
import mongoosePaginate from "mongoose-paginate-v2";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {type: String, required: true},
  password: {type: String, required: true},
  level: {type: Number, required: true},
});

UserSchema.plugin(mongoosePaginate);

export const User = mongoose.model('User', UserSchema);

const add_user = async (username, password, level) => {
  const hash = await bcrypt.hash(password, 10);
  const user = new User({username, password: hash, level });
  const new_user = await user.save();
  if (new_user !== user) {
    throw Error(`add_user: ${username} could not be saved`);
  }
}

export const validate_user = async (username, password) => {
  const user = await User.findOne({username});
  if (user) {
    const pwd_is_ok = await bcrypt.compare(password, user.password);
    if (pwd_is_ok) {
      return {valid: true, user: {id: user.id, level: user.level} }
    }
  }
  return {valid: false, user: 0 }
}

export const init = async () => {
  const guest = await User.find({username: 'guest'});
  if (guest.length === 0) await add_user('guest', 'guest', 1);
  const user = await User.find({username: 'user'});
  if (user.length === 0) await add_user('user', 'user', 2);
  const supervisor = await User.find({username: 'supervisor'});
  if (supervisor.length === 0) await add_user('supervisor', 'supervisor', 3);
  const admin = await User.find({username: 'admin'});
  if (admin.length === 0) await add_user('admin', 'admin', 4);
};

export const get_users = async (sort = [], search = {}, paginate = {}) => {
  const query = User.find(search);
  if (sort.length) {
    query.sort(sort);
  }
  if (is_empty(paginate)) {
    paginate = {pagination: false};
  }
  const result = await User.paginate(query, paginate);
  return result;
}
import bcrypt from 'bcrypt';
import { is_empty } from "lib/misc";
import mongoose, {mongo} from 'mongoose';
import mongoosePaginate from "mongoose-paginate-v2";

const level2role = ['guest', 'user', 'supervisor', 'admin'];
const role2level = {'guest': 1, 'user': 2, 'supervisor': 3, 'admin': 4};

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {type: String, required: true},
  password: {type: String, required: true},
  level: {type: Number, required: true},
});

UserSchema.plugin(mongoosePaginate);

export const User = mongoose.model('User', UserSchema);

mongoose.set('toJSON', {virtuals: true});
mongoose.set('toObject', {virtuals: true});

UserSchema.virtual('role').
  get(function() {return level2role[this.level-1]}).
  set(function(role) {this.level = role2level[role]});


const add = async (username, password, level) => {
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = new User({username, password: hash, level});
    const new_user = await user.save();
    if (new_user !== user) {
      throw Error(`user: add: ${username} could not be saved`);
    }
  } catch(e){
    throw Error(`users: add: ${username}\n${e}`);
  }
}

export const validate_user = async (username, password) => {
  try {
    const user = await User.findOne({username}).exec();
    if (user === null) return undefined
    const pwd_is_ok = await bcrypt.compare(password, user.password);
    if (pwd_is_ok) return user
  } catch (e) {
    throw Error(`users: validate_user: ${username}\n${e}`);
  }
}

export const init = async () => {
  try {
    const guest = await User.findOne({username: 'guest'}).exec();
    if (guest === null) await add('guest', 'guest', 1);
    const user = await User.findOne({username: 'user'}).exec();
    if (user === null) await add('user', 'user', 2);
    const supervisor = await User.findOne({username: 'supervisor'}).exec();
    if (supervisor === null) await add('supervisor', 'supervisor', 3);
    const admin = await User.findOne({username: 'admin'}).exec();
    if (admin === null) await add('admin', 'admin', 4);
  } catch (e) {
    throw Error(`users: init:\n${e}`);
  }

};

export const get_users = async (sort = [], search = {}, paginate = {}) => {
  try {
    const query = User.find(search);
    if (sort.length) {
      query.sort(sort);
    }
    if (is_empty(paginate)) {
      paginate = {pagination: false};
    }
    return await User.paginate(query, paginate);
  } catch(e) {
    throw Error(`users get_users:\n${e}`);
  }
}
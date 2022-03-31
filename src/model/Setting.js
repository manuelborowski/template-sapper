import mongoose from 'mongoose';
import mongoosePaginate from "mongoose-paginate-v2";

const Schema = mongoose.Schema;

class Type {
  static E_INT = 'int';
  static E_BOOL = 'bool';
  static E_STRING = 'string';
}

const SettingSchema = new Schema({
  key: {type: String, unique: true, required: true},
  value: {type: String, required: true},
  type: {type: String, required: true, enum: [Type.E_INT, Type.E_BOOL, Type.E_STRING]},
  user_id: {type: Number, default: null},
});

SettingSchema.plugin(mongoosePaginate);

export const Setting = mongoose.model('Setting', SettingSchema);

const add = async (key, value, type) => {
  try {
    const item = new Setting({key, value: value.toString(), type})
    const test_item = await item.save();
    if (test_item !== item) {
      throw Error(`settings: add: ${key}, ${value}, ${type}`);
    }
  }catch (e) {
    throw Error(`settings: add: ${key}\n${e}`);
  }
}

const get_value = async (key) => {
  try {
    const setting = await Setting.findOne({key}).exec(); //return null if not found
    if (setting === null) return undefined
    let value;
    if (setting.type === Type.E_BOOL) {
      value = setting.value === 'true';
    } else if (setting.type === Type.E_INT) {
      value = parseInt(setting.value);
    } else {
      value = setting.value;
    }
    return value
  } catch (e) {
    throw Error(`settings get_value: key ${key}\n${e}`)
  }
}

const set_value = async (key, value) => {
  try {
    const res = await Setting.updateOne({key}, {value}).exec();
    if (res.matchedCount === 0) throw Error(`Error settings set_value: key ${key} not found`)
  } catch (e) {
    throw Error(`settings set_value:\n${e}`)
  }
}

const default_configuration_settings = {
  generic_enable_send_ack_email: [false, Type.E_BOOL],

  student_register_arm_send_ack_mail: [false, Type.E_BOOL],
  student_register_template: ['', Type.E_STRING],
  student_web_response_template: ['', Type.E_STRING],
  student_email_response_template: ['', Type.E_STRING],
  student_register_settings: ['', Type.E_STRING],

  timeslot_register_arm_send_ack_mail: [false, Type.E_BOOL],
  timeslot_register_template: ['', Type.E_STRING],
  timeslot_web_response_template: ['', Type.E_STRING],
  timeslot_email_response_template: ['', Type.E_STRING],
  timeslot_open_registration_at: ['', Type.E_STRING],
  timeslot_config_timeslots_template: ['', Type.E_STRING],
  timeslot_config_timeslots_is_flat: [false, Type.E_BOOL],

  email_task_interval: [10, Type.E_INT],
  emails_per_minute: [30, Type.E_INT],
  email_send_max_retries: [2, Type.E_INT],
  email_base_url: ['localhost:5000', Type.E_STRING],
  email_enable_send_email: [false, Type.E_BOOL],
}


export const set_configuration_setting = async (key, value) => {
  if (!(key in default_configuration_settings)) throw Error (`Error settings set_configuration_setting : key ${key} not valid`)
  try {
    await set_value(key, value)
  } catch (e) {
    throw Error(`settings set_configuration_setting: key/value ${key}/${value}\n${e}`)
  }
}

export const get_configuration_setting = async (key) => {
  if (!(key in default_configuration_settings)) throw Error (`Error settings get_configuration_setting : key ${key} not valid`)
  try {
    let value;
      value = await get_value(key);
      if (value === undefined) {
        const default_setting = default_configuration_settings[key];
        await add(key, default_setting[0], default_setting[1]);
        value = default_setting[0];
      }
    return value
  } catch (e) {
    throw Error(`settings get_configuration_setting: key ${key}\n${e}`)
  }
}

export const get_configuration_settings = async () => {
  try {
    let settings = {}
    for (const k in default_configuration_settings) {
      settings[k] = await get_configuration_setting(k);
    }
    return settings
  } catch(e) {
    throw Error(`settings get_configuration_settings:\n${e}`)
  }
}

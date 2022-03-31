import * as msetting from "model/Setting";

export const get = async ( req, res) => {
  try {
    const default_data = await msetting.get_configuration_settings()
    res.end(JSON.stringify({status: true, data: default_data}));
  } catch(e) {
    res.end(JSON.stringify({status: false, data: `Could not get settings:\n${e}`}))
  }
}

export const post = async (req, res) => {
  try {
    for (const [ck, cv] of Object.entries(req.body)) {
      if ('submit' in cv && cv['submit']) {
        for (const [k, v] of Object.entries(cv)) {
          if (k === 'submit') continue
          await msetting.set_configuration_setting(k, v);
        }
      }
    }
    res.end(JSON.stringify({status: true}))
  } catch (e) {
    res.end(JSON.stringify({status: false, data: `Could not save settings:\n${e}`}))

  }
}
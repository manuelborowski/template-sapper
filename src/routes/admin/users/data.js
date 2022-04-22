import * as mduser from 'model/User'
import * as ldatatables from "lib/datatables";
import {config_a} from "./config";

export async function get( req, res) {
  try {
    const data_res = await ldatatables.get_data(req.query, config_a, mduser.get_users);
    res.end(JSON.stringify(data_res));
  } catch (e) {
    res.end(JSON.stringify({error: e.message}));
  }
}

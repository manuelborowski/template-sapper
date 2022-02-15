import * as muser from 'model/User'
import { get_data } from "lib/datatables";
import { _ } from 'lib/polyglot';

const config = {
  data_route: '/admin/users/data',
  columns: [
    {label: _.t('username'), data: 'username', type: String},
    {label: _.t('level'), data: 'level', type: Number}
  ]
}

export async function get( req, res) {
  const { slug } = req.params;

  if(slug === 'data') {
    const data_res = await get_data(req.query, config, muser.get_users);
    res.end(JSON.stringify(data_res));
  }
  if (slug === 'config') {
    res.end(JSON.stringify(config));
  }
}


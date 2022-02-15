import * as muser from 'model/User'
import { get_data } from "lib/datatables";

const config = {
  data_route: '/admin/users/data',
  columns: [
    {label: 'Username', data: 'username', type: String},
    {label: 'Level', data: 'level', type: Number}
  ]
}

export async function get( req, res) {
  const { slug } = req.params;

  if(slug === 'data') {
    const data_res = await get_data(req.query, config, muser.get_users);
    // let sort = [];
    // if ('order' in req.query) {
    //   req.query.order.forEach(o => {
    //     sort.push([config.columns[o.column].data, o.dir]);
    //   });
    // }
    // let search = {}
    // if ('search' in req.query && req.query.search.value !== '') {
    //   let temp = []
    //   config.columns.forEach(c => {
    //     let search_field = {}
    //     if (c.type === String) {
    //       search_field[c.data] = {$regex: req.query.search.value};
    //       temp.push(search_field);
    //     } else if (c.type === Number && !isNaN(req.query.search.value)) {
    //       search_field[c.data] = {$eq: req.query.search.value};
    //       temp.push(search_field);
    //     }
    //   });
    //   if (temp.length) {
    //     search['$or'] = temp;
    //   }
    // }
    // const paginate = 'start' in req.query ? {page: parseInt(req.query.start), limit: parseInt(req.query.length)} : {};
    // let data = await muser.get_users(sort, search, paginate)
    // let dt_resp = {
    //   draw: req.query.draw,
    //   recordsTotal: data.totalDocs,
    //   recordsFiltered: data.totalDocs,
    //   data: data.docs
    // }
    res.end(JSON.stringify(data_res));
  }
  if (slug === 'config') {
    res.end(JSON.stringify(config));
  }
}


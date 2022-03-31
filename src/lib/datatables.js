
export const get_data = async (query, config, model_get_data) => {
  try {
    let sort = [];
    if ('order' in query) {
      query.order.forEach(o => {
        sort.push([config.columns[o.column].data, o.dir]);
      });
    }
    let search = {}
    if ('search' in query && query.search.value !== '') {
      let temp = []
      config.columns.forEach(c => {
        let search_field = {}
        if (c.type === String) {
          search_field[c.data] = {$regex: query.search.value};
          temp.push(search_field);
        } else if (c.type === Number && !isNaN(query.search.value)) {
          search_field[c.data] = {$eq: query.search.value};
          temp.push(search_field);
        }
      });
      if (temp.length) {
        search['$or'] = temp;
      }
    }
    const paginate = 'start' in query ? {page: parseInt(query.start), limit: parseInt(query.length)} : {};
    let data = await model_get_data(sort, search, paginate);
    return {
      draw: query.draw,
      recordsTotal: data.totalDocs,
      recordsFiltered: data.totalDocs,
      data: data.docs,
    };
  } catch (e) {
    throw Error(`datatables get_data: ${req.query}\n${e}`);
  }
}

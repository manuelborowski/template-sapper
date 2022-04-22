
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


// Create a row of clickable buttons, one for each column.  These toggle the visibility of a column
export const init_column_visibility = (table, doc_element, table_config) => {

  let column_visible_div = document.querySelector(doc_element);
  let column_visible_settings = JSON.parse(localStorage.getItem(`ColumnsVisible-${table_config.tag}`));
  if (!column_visible_settings || column_visible_settings.length !== table_config.columns.length) {
    column_visible_settings = []
    table_config.columns.forEach((column, i) => {
      column_visible_settings.push({name: column.data, visible: column.visible});
    });
    localStorage.setItem(`ColumnsVisible-${table_config.tag}`, JSON.stringify(column_visible_settings));
  }
  column_visible_settings.forEach((column, i) => {
    if (column.visible !== 'never') {
      let a = document.createElement('p');
      a.appendChild(document.createTextNode(`${column.name}`));
      a.setAttribute("data-column", i);
      a.setAttribute("class", column.visible === 'yes' ? "column-visible-a": "column-invisible-a")
      table.column(i).visible(column.visible === 'yes');
      a.addEventListener('click', e => {
        e.preventDefault();
        let c = table.column(e.currentTarget.dataset['column']);
        c.visible(!c.visible());
        e.currentTarget.classList.toggle('column-invisible-a')
        e.currentTarget.classList.toggle('column-visible-a')
        column_visible_settings[e.currentTarget.dataset.column].visible = c.visible() ? 'yes' : 'no';
      });
      column_visible_div.appendChild(a);
    }
  });
  localStorage.setItem(`ColumnsVisible-${table_config.tag}`, JSON.stringify(column_visible_settings));

}
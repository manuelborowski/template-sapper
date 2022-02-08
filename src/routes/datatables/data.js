
export async function get( req, res) {

  let data = [
      [ "Tiger Nixon", "System Architect", "Edinburgh", "5421", "2011/04/25", "$320,800" ],
      [ "Garrett Winters", "Accountant", "Tokyo", "8422", "2011/07/25", "$170,750" ],
      [ "Ashton Cox", "Junior Technical Author", "San Francisco", "1562", "2009/01/12", "$86,000" ],
      [ "Bshton Cox", "Junior Technical Author", "San Francisco", "1562", "2009/01/12", "$86,000" ],
      [ "cshton Cox", "Junior Technical Author", "San Francisco", "1562", "2009/01/12", "$86,000" ],
      [ "dshton Cox", "Junior Technical Author", "San Francisco", "1562", "2009/01/12", "$86,000" ],
      [ "eshton Cox", "Junior Technical Author", "San Francisco", "1562", "2009/01/12", "$86,000" ],
      [ "fshton Cox", "Junior Technical Author", "San Francisco", "1562", "2009/01/12", "$86,000" ],
      [ "gshton Cox", "Junior Technical Author", "San Francisco", "1562", "2009/01/12", "$86,000" ],
      [ "ishton Cox", "Junior Technical Author", "San Francisco", "1562", "2009/01/12", "$86,000" ],
      [ "xshton Cox", "Junior Technical Author", "San Francisco", "1562", "2009/01/12", "$86,000" ],
      [ "yshton Cox", "Junior Technical Author", "San Francisco", "1562", "2009/01/12", "$86,000" ],
      [ "jshton Cox", "Junior Technical Author", "San Francisco", "1562", "2009/01/12", "$86,000" ],
      [ "kshton Cox", "Junior Technical Author", "San Francisco", "1562", "2009/01/12", "$86,000" ],
      [ "lshton Cox", "Junior Technical Author", "San Francisco", "1562", "2009/01/12", "$86,000" ],
    ]
  if (req.query.search.value) {
    data = data.filter(e => e.find(f => f.includes(req.query.search.value)))
  }
  const order = req.query.order[0].dir === 'asc' ? -1 : 1;
  data.sort((a, b) => {
    console.log(a[req.query.order[0].column], b[req.query.order[0].column], a[req.query.order[0].column] < b[req.query.order[0].column])
    return a[req.query.order[0].column] < b[req.query.order[0].column] ? order : order * -1
  })
  data = data.slice(req.query.start, req.query.start + req.query.length)
  let dt_resp = {
    draw: req.query.draw,
    recordsTotal:15,
    recordsFiltered: 15,
    data
  }

  res.end(JSON.stringify(dt_resp));
}


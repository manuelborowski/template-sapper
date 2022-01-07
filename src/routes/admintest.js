import { guard_admin_access } from '../lib/server/nav_guard.js';

//BOROWSKI: just to check that in this case, the server is always accessed AND it is checked if the user has the
//right kevel (in this case, admin)
export async function get( req, res, next) {
  try {
    if (guard_admin_access(req)) {
      res.end(JSON.stringify({message: "youre the best and you too..."}));
    }
    res.end();
  } catch (error) {
    res.end(JSON.stringify({ error: error.message }));
  }
}
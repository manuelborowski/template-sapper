import { validate_user } from '../model/User.js';
import { level as access_level } from 'lib/user_access_levels';

export async function post(req, res) {
  try {
    console.log('login via username/password')
    const { username, password } = req.body;
    //BOROWSKI: At this point, the database should be checked to see it the user is present and what its authorizationlevel is.
    const { valid, user } = await validate_user(username, password);
    if (valid) {
      req.session.user_id = user.id;
      req.session.user_level = user.level;
    } else {
      req.session.user_level = 0
    }
    res.end(JSON.stringify({ user_level: req.session.user_level }));
  } catch (error) {
    res.end(JSON.stringify({ error: error.message }));
  }
}

export async function get(req, res) {
  try {
    console.log('login via key')
    const key = req.query["key"];
    //BOROWSKI: it is possible to log in with a key
    if (key === process.env.KEY_ADMIN) {
      req.session.user_level = access_level.admin_access;
    } else if (key === process.env.KEY_USER) {
      req.session.user_level = access_level.user_access;
    } else {
      req.session.user_level = access_level.no_access;
    }
    res.writeHead(301, {Location: "/guest"}).end();
  } catch (error) {
    res.end(JSON.stringify({ error: error.message }));
  }
}
import { validate_user } from '../model/User.js';

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
    const key = req.query["api-key"];
    //BOROWSKI: it is possible to log in with a key
    if (key === "admin") {
      req.session.email = "key-admin";
      req.session.user_level = 5;
    } else if (key === "user") {
      req.session.email = "key-user";
      req.session.user_level = 1;
    } else {
      req.session.user_level = 0;
    }
    res.writeHead(301, {Location: "/home"}).end();
    //
    // res.end(JSON.stringify({ user_level: req.session.user_level }));
  } catch (error) {
    res.end(JSON.stringify({ error: error.message }));
  }
}
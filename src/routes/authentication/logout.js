export async function post(req, res) {
  try {
    console.log('logout called')
    req.session.user_level = 0;
    req.session.destroy(error => {
      if (error) {
        console.log(`Could not destroy session: ${error}`)
      }
    });
    res.end(JSON.stringify({ user_level: 0 }));
  } catch (error) {
    res.end(JSON.stringify({ error: error.message }));
  }
}
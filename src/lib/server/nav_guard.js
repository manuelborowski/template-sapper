const level_no_access = 0;
const level_guest_access = 1;
const level_user_access = 2;
const level_supervisor_access = 3;
const level_admin_access = 4;

//BOROWSKI: prohibit access to a non-authorized endpoint on the SERVER
export const guard_admin_access = (req) => {
  console.log("server admin access");
  return req.session.user_level && req.session.user_level === level_admin_access
  };
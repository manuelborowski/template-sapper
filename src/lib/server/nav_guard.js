import { level } from 'lib/user_access_levels'

//BOROWSKI: prohibit access to a non-authorized endpoint on the SERVER
export const guard_admin_access = (req) => {
  console.log("server admin access");
  return req.session.user_level && req.session.user_level >= level.admin_access
  };

export const guard_user_access = (req) => {
  console.log("server user access");
  return req.session.user_level && req.session.user_level >= level.user_access
};
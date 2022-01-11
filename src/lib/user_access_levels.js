export const level = {
  no_access: 0,
  guest_access: 1,
  user_access: 2,
  supervisor_access: 3,
  admin_access: 4,
}

const label_to_level = {
  guest: level.guest_access,
  user: level.user_access,
  supervisor: level.supervisor_access,
  admin: level.admin_access
}


// first part of the path identifies the authorization level.  /admin/settings => "admin" indicates admin level is
// required.
export const url_path_to_level = (path) => {
  const level = label_to_level[path.split('/')[1]];
  return level || 0;
}
export let user_level;

export const level = {
   no_access: 0,
   guest_access: 1,
   user_access: 2,
   supervisor_access: 3,
   admin_access: 4,
}

//BOROWSKI: on the CLIENT, used to show the correct pages, depending on the user level
export const my_preload = (page, session, my_this) => {
  console.log(page, session);
  user_level  = session.user_level;
  const route = page.path;
  if (route.includes("admin")) {
    if (user_level < level.admin_access) {
      my_this.redirect(302, "/");
    }
  } else if (route.includes("user")) {
    if (user_level < level.guest_access) {
      my_this.redirect(302, "/");
    }
  }
}

//BOROWSKI: prohibit access to a non-authorized page
export const guard_admin_access = (page, session, ctxt) => {
  console.log("admin_access");
  user_level  = session.user_level;
  if (user_level < level.admin_access) {
      ctxt.redirect(302, "/");
    }
}

export const guard_user_access = (page, session, ctxt) => {
  console.log("user_access");
  user_level  = session.user_level;
  if (user_level < level.guest_access) {
    ctxt.redirect(302, "/");
  }
}
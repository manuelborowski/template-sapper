<script context="module">
  import { guard_user_access } from '../lib/client/nav_guard.js';
  export function preload(page, session) {
    return guard_user_access(page, session, this);
  }
</script>

<h1>This is the user page</h1>
<script context="module">
  //BOROWSKI: check if this page may be accessed by the current user
  import { guard_admin_access } from '../lib/client/nav_guard.js';
  export function preload(page, session) {
    return guard_admin_access(page, session, this);
  }
</script>

<script>
    import { onMount} from "svelte";
    import { fetch } from 'cross-fetch';

    let message;

    onMount( async () => {
        const response = await fetch("/admintest", {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        const parsed = await response.json();
        message = parsed.message;
    });
</script>

<h1>This is the admin page</h1>
<p>{message}</p>
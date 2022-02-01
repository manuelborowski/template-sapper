<script>
  import {goto, stores} from '@sapper/app';
  import fetch from 'cross-fetch';
  import {level} from 'lib/client/nav_guard.js';

  //BOROWSKI: use the stored user level to hide/display certain entries of the navigation menu.
  //user level 0 is 'not logged in yet', 1 is 'guest level authorization', ..., 4 is 'admin level authorization'
  const {session} = stores();
  export let segment;

  const handleLogout = async () => {
    const response = await fetch("/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const parsed = await response.json();
    if (parsed.error) {
      // error = parsed.error;
    } else {
      console.log("handleLogout");
      await goto("/");
      $session.user_level = 0;
    }
  };

</script>

{#if $session.user_level === level.no_access || segment === undefined }
    <li><a class="hover:text-gray-200" href="/">Login</a></li>
{:else}
    <li><a class="hover:text-gray-200" href="/guest">Home</a></li>
    {#if $session.user_level >= level.admin_access}
        <li class="admin-main">
            <btn class="hover:text-gray-200">Admin</btn>
            <ul class="hidden admin-sub py-4 my-auto font-semibold space-y-1">
                <li>link 1</li>
                <li>link 2</li>
            </ul>
        </li>
    {/if}
    {#if $session.user_level >= level.user_access}
        <li><a class="hover:text-gray-200" href="/user">User</a></li>
    {/if}
    <li><a class="hover:text-gray-200" href={"#"} on:click={handleLogout}>Logout</a></li>
{/if}

<style>
   .admin-main:hover .admin-sub {display: block;}
</style>
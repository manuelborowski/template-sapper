<script>
  import {goto, stores} from '@sapper/app';
  import { _ } from 'lib/polyglot';

  const {session} = stores();

  let password = "";
  let username = "";
  let error;

  //BOROWSKI: Ask for email and password, send to server for validation and go to the home page.
  const handleLogin = async () => {
    const response = await fetch("/authentication/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({username, password}),
    });
    const parsed = await response.json();
    if (parsed.error) {
      error = parsed.error;
    } else {
      console.log("handleLogin, set user_level to ", parsed.user_level);
      //BOROWSKI: use the session store to save the user level so it can be used elsewhere
      $session.user_level = parsed.user_level;
      await goto("/guest");
    }
  };
</script>

<!-- component -->
<form on:submit|preventDefault="{handleLogin}" method="post">
    <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
        <div class="mb-4">
            <label class="block text-gray-500 text-sm font-bold mb-2" for="username">
              {_.t('username')}
            </label>
            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker" id="username"
                   type="text" placeholder="{_.t('username')}" bind:value={username}>
        </div>
        <div class="mb-6">
            <label class="block text-gray-500 text-sm font-bold mb-2" for="password">
              {_.t('password')}
            </label>
            <input class="shadow appearance-none border border-red rounded w-full py-2 px-3 text-grey-darker mb-3"
                   id="password" type="password" placeholder="******************" bind:value={password}
                   autocorrect="off" autocapitalize="none" autocomplete="off">
        </div>
        <div class="flex items-center justify-between">
            <button class="bg-blue-400 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded" type="submit">
              {_.t('log_in')}
            </button>
        </div>
    </div>
</form>

{#if error}
    <p>{error}</p>
{/if}


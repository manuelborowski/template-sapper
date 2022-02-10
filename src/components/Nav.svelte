<script>
  import {goto, stores } from '@sapper/app';
  import fetch from 'cross-fetch';
  import {level} from 'lib/user_access_levels'

  //BOROWSKI: use the stored user level to hide/display certain entries of the navigation menu.
  //user level 0 is 'not logged in yet', 1 is 'guest level authorization', ..., 4 is 'admin level authorization'
  const { page, session} = stores();

  export let segment;
  let navbar_title = 'Template Sapper';
  let hamburger_open = false;

  const main_menu_visible = (force_close = false) => {
    const main_ul = document.querySelector('.main-menu');
    if (force_close) {
      main_ul.classList.add('hidden');
      document.querySelectorAll('.sub-menu').forEach((menu) => menu.classList.add('hidden'));
    } else {
      if (main_ul.classList.contains('hidden')) {
        main_ul.classList.remove('hidden');
      } else {
        main_ul.classList.add('hidden');
      }
    }
  }

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

  const sub_menu_visible = (e) => {
    const ul = e.target.nextElementSibling;
    if (ul.classList.contains('hidden')) {
      document.querySelectorAll('.sub-menu').forEach((menu) => menu.classList.add('hidden'));
      ul.classList.remove('hidden');
    } else {
      ul.classList.add('hidden');
    }
  }

  const menu = [
    {type: 'link', label: 'Home', level: level.guest_access, href: '/guest'},
    {
      type: 'sub', label: 'Admin', level: level.admin_access, menu: [
        {type: 'link', label: 'Admin', level: level.guest_access, href: '/admin'},
        {type: 'link', label: 'Users', level: level.guest_access, href: '/admin/users', title: 'Users'},
        {type: 'link', label: 'Settings', level: level.guest_access, href: '/admin/settings'},
      ]
    },
    {
      type: 'sub', label: 'User', level: level.user_access, menu: [
        {type: 'link', label: 'U1', level: level.user_access, href: '/user'},
        {type: 'link', label: 'settings', level: level.user_access, href: '/user/settings'},
      ]
    },
    {type: 'link', label: 'Datatables', level: level.guest_access, href: '/datatables', title: 'Datatable test'},
  ];

  const navbar_titles = {};
  const create_navbar_titles = menu => {
    menu.forEach(e => {
        if (e.type === 'sub') {
          create_navbar_titles(e.menu)
        } else {
          navbar_titles[e.href] = 'title' in e ? e.title : e.label;
        }
    })
  }

  create_navbar_titles(menu);

  page.subscribe(({ path, params, query }) => {
    const pathname = process.browser ? path : "Template sapper";
    navbar_title = pathname in navbar_titles ? navbar_titles[pathname] : pathname;
  })
</script>

<!-- navbar -->
<nav class="flex  place-content-between items-center px-5 bg-gray-900 text-white w-screen h-full ">
    <div class="flex self-center mr-12" on:click|stopPropagation={() => {main_menu_visible()}}>
        <button class="navbar-burger">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 hover:text-gray-200" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
        </button>
    </div>
    <div class="py-3">
        {navbar_title}
    </div>
    <a class="text-3xl font-bold pr-4" href={"/"}>
         <img class="h-9" src="sapper.png" alt="logo">
    </a>
</nav>

<div class:hidden={!hamburger_open} class="main-menu">
    <ul class="flex-col my-auto font-semibold space-y-1 text-white">

        {#if $session.user_level === level.no_access || segment === undefined }
            <li><a href="/">Login</a></li>
        {:else}

            {#each menu as item}
                {#if item.type === 'link'}
                    {#if $session.user_level >= item.level}
                        <li><a href="{item.href}">{item.label}</a></li>
                    {/if}
                {/if}
                {#if item.type === 'sub'}
                    <div class="relative">
                        {#if $session.user_level >= item.level}
                            <li on:click|stopPropagation={(e) => sub_menu_visible(e)}>{item.label}</li>
                            <div class="hidden sub-menu">
                                <ul class="{item.label} ml-2">
                                    {#each item.menu as item}
                                        {#if item.type === 'link'}
                                            {#if $session.user_level >= item.level}
                                                <li><a href="{item.href}">{item.label}</a></li>
                                            {/if}
                                        {/if}
                                    {/each}
                                </ul>
                            </div>
                        {/if}
                    </div>
                {/if}
            {/each}
            <li><a href={"#"} on:click={handleLogout}>Logout</a></li>
        {/if}
    </ul>
</div>

<svelte:body on:click={() => {main_menu_visible(true)}}/>

<style>
    li:hover {
        @apply text-gray-200;
    }

    .main-menu {
        @apply relative bg-blue-600 w-fit px-4 rounded-lg border-2 border-white space-y-2
    }

    .sub-menu {
        @apply absolute ml-12 bg-green-700 p-1 pr-4 rounded-lg border-2 border-white top-2 w-max space-y-2
    }
</style>


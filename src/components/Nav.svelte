<script>
  import {_} from 'lib/polyglot';
  import {goto, stores} from '@sapper/app';
  import fetch from 'cross-fetch';
  import {level} from 'lib/user_access_levels'

  //BOROWSKI: use the stored user level to hide/display certain entries of the navigation menu.
  //user level 0 is 'not logged in yet', 1 is 'guest level authorization', ..., 4 is 'admin level authorization'
  const {page, session} = stores();

  export let segment;
  let navbar_title = 'Template Sapper';
  let hamburger_open = false;


  const show_menu = async e => {
    e.stopPropagation()
    const parent_li = e.target.closest('li');
    if (parent_li) {
      const menu_level = parent_li.getAttribute('data-menu-level');
      if (menu_level === 'dropdown-2') {
        document.querySelectorAll('.dropdown-2 > li').forEach(li => li.style.display = 'none');
      }
      const lis = parent_li.querySelectorAll(`.${menu_level} > li`);
      lis.forEach(li => li.style.display = 'block');
    }
  }

  const hide_menu = async e => {
    e.stopPropagation();
    document.querySelectorAll('.dropdown-1 li').forEach(li => li.style.display = 'none');
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
    {type: 'link', label: _.t('home'), level: level.guest_access, href: '/guest'},
    {
      type: 'sub', label: _.t('admin'), level: level.admin_access, menu: [
        {type: 'link', label: _.t('home'), level: level.guest_access, href: '/admin'},
        {type: 'link', label: _.t('users'), level: level.guest_access, href: '/admin/users', title: _.t('users')},
        {type: 'link', label: _.t('settings'), level: level.guest_access, href: '/admin/settings'},
      ]
    },
    {
      type: 'sub', label: _.t('user'), level: level.user_access, menu: [
        {type: 'link', label: 'U1', level: level.user_access, href: '/user'},
        {type: 'link', label: _.t('settings'), level: level.user_access, href: '/user/settings'},
      ]
    },
    {type: 'link', label: _.t('datatables'), level: level.guest_access, href: '/datatables', title: 'Datatable test'},
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

  page.subscribe(({path, params, query}) => {
    const pathname = process.browser ? path : "Template sapper";
    navbar_title = pathname in navbar_titles ? navbar_titles[pathname] : pathname;
  })

</script>

<!-- navbar -->
<nav class="flex  place-content-between items-center px-5 bg-gray-900 text-white w-screen h-full ">
  <div class="main-menu" >
    <ul on:click={show_menu} on:mouseover={show_menu} on:focus={show_menu} on:mouseleave={hide_menu}>
      <li class="flex flex-col self-center mr-12 block" data-menu-level="dropdown-1">
        <button class="navbar-burger" >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 hover:text-gray-200" fill="none"
               viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
        <ul class="dropdown-1">
          {#if $session.user_level === level.no_access || segment === undefined }
            <li><a href="/">{_.t('login')}</a></li>
          {:else}

            {#each menu as item}
              {#if item.type === 'link'}
                {#if $session.user_level >= item.level}
                  <li  data-menu-level="dropdown-2"><a href="{item.href}">{item.label}</a></li>
                {/if}
              {/if}
              {#if item.type === 'sub'}
                <li data-menu-level="dropdown-2"><p>{item.label}</p>
                  {#if $session.user_level >= item.level}
                    <ul class="{item.label} dropdown-2">
                      {#each item.menu as item}
                        {#if item.type === 'link'}
                          {#if $session.user_level >= item.level}
                            <li><a href="{item.href}">{item.label}</a></li>
                          {/if}
                        {/if}
                      {/each}
                    </ul>
                  {/if}
                </li>
              {/if}
            {/each}
            <li><a href={"#"} on:click={handleLogout}>{_.t('logout')}</a></li>
          {/if}
        </ul>
      </li>
    </ul>
  </div>

  <div class="py-3">
    {navbar_title}
  </div>
  <a class="text-3xl font-bold pr-4" href={"/"}>
    <img class="h-9" src="sapper.png" alt="logo">
  </a>
</nav>


<style>
    .main-menu {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    .main-menu a, p {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffff;
        background: #cb3529;
        height: 50px;
        padding-left: 1rem;
        padding-right: 1rem;
    }

    .main-menu a:hover, p:hover {
        background: tomato;
    }

    .main-menu > ul {
        position: absolute;
    }

    .main-menu ul {
        list-style: none;
        display: flex;
    }

    .main-menu ul li {
        position: relative;
        width: 100%;
        text-align: center;
        top: 0;
        display: none;
    }

    .main-menu > ul > li {
        text-align: left;
        display: block;
    }


    .dropdown-1 {
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .dropdown-2 {
        flex-direction: column;
        position: absolute;
        top:0;
        left: 100%;
        width:100%;
        display: none;
    }
</style>


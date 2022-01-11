<script>
	import {goto, stores} from '@sapper/app';
	import fetch from 'cross-fetch';
	import { level } from 'lib/client/nav_guard.js';

	//BOROWSKI: yse the stored user level to hide/display certain entries of the navigation menu.
	//user level 0 is 'not logged in yet', 1 is 'guest level authorization', ..., 4 is 'admin level authorization'
	const { session } = stores();
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

<nav>
	<ul>
		{#if $session.user_level === level.no_access || segment === undefined }
			<li><a aria-current="page" href="/">login</a></li>
		{:else}
			<li><a aria-current="{segment === 'guest' ? 'page' : 'false'}" href="guest">home</a></li>
			{#if $session.user_level >= level.admin_access}
				<li><a aria-current="{segment === 'admin' ? 'page' : undefined}" href="admin">admin</a></li>
			{/if}
			<li><a aria-current="{segment === 'user' ? 'page' : undefined}" href="user">user</a></li>
			<li><a href={"#"} on:click={handleLogout}>logout</a></li>
		{/if}
	</ul>
</nav>

<style>
	nav {
		border-bottom: 1px solid rgba(255,62,0,0.1);
		font-weight: 300;
		padding: 0 1em;
	}

	ul {
		margin: 0;
		padding: 0;
	}

	/* clearfix */
	ul::after {
		content: '';
		display: block;
		clear: both;
	}

	li {
		display: block;
		float: left;
	}

	[aria-current] {
		position: relative;
		display: inline-block;
	}

	[aria-current]::after {
		position: absolute;
		content: '';
		width: calc(100% - 1em);
		height: 2px;
		background-color: rgb(255,62,0);
		display: block;
		bottom: -1px;
	}

	a {
		text-decoration: none;
		padding: 1em 0.5em;
		display: block;
	}
</style>


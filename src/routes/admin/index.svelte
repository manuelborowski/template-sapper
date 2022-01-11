<script>
    import { onMount} from "svelte";
    import { fetch } from 'cross-fetch';

    let message;

    onMount( async () => {
        const response = await fetch("/admin/test", {
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
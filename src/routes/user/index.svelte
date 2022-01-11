<script>
  import { onMount} from "svelte";
  import { fetch } from 'cross-fetch';

  let message;

  onMount( async () => {
    const response = await fetch("/user/test", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const parsed = await response.json();
    message = parsed.message;
  });
</script>

<h1>This is the user page</h1>
<p>{message}</p>

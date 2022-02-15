<script context="module">
    export async function preload(page, session) {
      const res = await this.fetch('/admin/users/config');
      const config = await res.json();
      return { config }
    }
</script>

<script>
  import Datatables from "components/Datatables.svelte";
  export let config;
</script>

<Datatables {config} />
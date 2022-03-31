<script context="module">
    import {config_a} from './config.js';
    export async function preload() {
      const config = config_a;
      return { config }
    }
</script>

<script>
  import Datatables from "components/Datatables.svelte";
  export let config;
</script>

<Datatables {config} />
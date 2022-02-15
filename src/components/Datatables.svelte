<script>
  import { onDestroy, onMount } from "svelte";
  let el;
  let table;
  export let config;

  onMount(() => init());
  export const init = () => {
    table = jQuery(el).DataTable({
      ajax: config.data_route,
      serverSide: true,
      processing: true,
      lengthMenu: [2, 5, 10, 100],
      columns: config.columns,
    })
  };

  onDestroy(() => {
    if (table) {
      table.destroy();
    }
  });
</script>

<table bind:this={el} class="display" style="width:100%">
    <thead>
    <tr>
        {#each config.columns as column}
            <th>{column.label}</th>
        {/each}
    </tr>
    </thead>
    <tbody />
    <tfoot>
    <tr>
        {#each config.columns as column}
            <th>{column.label}</th>
        {/each}
    </tr>
    </tfoot>
</table>

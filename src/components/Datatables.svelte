<script>
  import { onDestroy, onMount } from "svelte";
  import {_} from "lib/polyglot";
  import * as mdatatables from 'lib/datatables';

  let svelte_table;
  let table;
  export let config;
  let visibility_elements = [];
  let column_visible_settings =[];
  // let column_visible_settings =[{"name":"username","visible":"yes"},{"name":"role","visible":"yes"}];


  onMount(() =>  {
    if ('width' in config) svelte_table.style.width = config.width;

    table = jQuery(svelte_table).DataTable({
      ajax: config.data_endpoint,
      serverSide: true,
      processing: true,
      lengthMenu: [5, 10, 100],
      columns: config.columns,
    })

    init_column_visibility(table, '.column-visibility-div', config);
  });

  onDestroy(() => {
    if (table) {
      table.destroy();
    }
  });

  const update_visibility = e => {
    e.preventDefault();
    let index = e.currentTarget.dataset.column;
    let column = table.column(index);
    column.visible(!column.visible());
    column_visible_settings[index].visible = column.visible() ? 'yes' : 'no';
    localStorage.setItem(`ColumnsVisible-${config.tag}`, JSON.stringify(column_visible_settings));

  }


  // Create a row of clickable buttons, one for each column.  These toggle the visibility of a column
  const init_column_visibility =  (table, doc_element, table_config) => {

    let column_visible_div = document.querySelector(doc_element);
    column_visible_settings = JSON.parse(localStorage.getItem(`ColumnsVisible-${table_config.tag}`));
    if (!column_visible_settings || column_visible_settings.length !== table_config.columns.length) {
      column_visible_settings = []
      table_config.columns.forEach((column, i) => {
        column_visible_settings.push({name: column.data, visible: column.visible});
      });
      localStorage.setItem(`ColumnsVisible-${table_config.tag}`, JSON.stringify(column_visible_settings));
    }
    column_visible_settings.forEach((column, i) => {table.column(i).visible(column.visible === 'yes');});
  }

</script>

<div class="column-visibility-div">
  <div>{_.t('column_visible')}:</div>
  {#each column_visible_settings as column, i}
    {#if column.visible !== 'never'}
      <p data-column="{i}" class="{column.visible === 'yes' ? 'visible' : 'unvisible'}" on:click={update_visibility}> {column.name}</p>
    {/if}
  {:else}
    <p>{_.t('patience_please')}...</p>
  {/each}
</div>

<table bind:this={svelte_table} class="display" >
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

<style>
  .column-visibility-div {
      display: flex;
  }
  .visible {
      background-color: lightgreen;
  }
  .unvisible {
      background-color: lightsalmon;
  }
  .column-visibility-div p {
      margin-top: 2px;
      margin-left: 3px;
      margin-right: 3px;
      border-right: 5px;
      padding: 3px;
  }

</style>
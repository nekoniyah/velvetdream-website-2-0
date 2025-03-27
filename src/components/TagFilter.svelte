<script lang="ts">
    export let tags = [];
    export let selectedTags = [];
  
    function toggleTag(tag:string) {
      if (selectedTags.includes(tag)) {
        selectedTags = selectedTags.filter(t => t !== tag);
      } else {
        selectedTags = [...selectedTags, tag];
      }
    }
  </script>
  
  <div class="tag-filter">
    {#each tags as tag}
      <button 
        class="tag-button {selectedTags.includes(tag) ? 'active' : ''}"
        on:click={() => toggleTag(tag)}
      >
        {tag}
      </button>
    {/each}
  </div>
  
  <style>
    :global(.tag-filter) {
      margin: 1rem 0;
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
  
    :global(.tag-button) {
      padding: 0.5rem 1rem;
      border: 1px solid var(--color-primary);
      color: var(--color-primary);
      border-radius: 20px;
      background: none;
      cursor: pointer;
      transition: all 0.3s ease;
    }
  
    :global(.tag-button.active) {
      background: var(--color-primary);
      color: var(--color-light);
    }
  </style>
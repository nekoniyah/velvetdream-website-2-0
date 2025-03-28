<script lang="ts">
  import { onMount } from 'svelte';

  let error: Error | null = null;
  let errorInfo: string = '';

  function handleError(e: Error | ErrorEvent | PromiseRejectionEvent): void {
    if (e instanceof Error) {
      error = e;
      errorInfo = e.stack || '';
    } else if (e instanceof ErrorEvent) {
      error = e.error;
      errorInfo = e.error?.stack || '';
    } else if (e instanceof PromiseRejectionEvent) {
      error = e.reason instanceof Error ? e.reason : new Error(String(e.reason));
      errorInfo = error.stack || '';
    }
  }

  onMount(() => {
    const errorHandler = (event: ErrorEvent) => handleError(event);
    const rejectionHandler = (event: PromiseRejectionEvent) => handleError(event);

    window.addEventListener('error', errorHandler);
    window.addEventListener('unhandledrejection', rejectionHandler);

    return () => {
      window.removeEventListener('error', errorHandler);
      window.removeEventListener('unhandledrejection', rejectionHandler);
    };
  });
</script>

{#if error}
  <div class="error-boundary">
    <h2>Something went wrong</h2>
    <p class="error-message">{error.message}</p>
    {#if process.env.NODE_ENV === 'development'}
      <details>
        <summary>Error Details</summary>
        <pre>{errorInfo}</pre>
      </details>
    {/if}
    <button on:click={() => window.location.reload()}>
      Reload Page
    </button>
  </div>
{:else}
  <slot />
{/if}

<style lang="scss">
  .error-boundary {
    padding: 2rem;
    margin: 1rem;
    border: 1px solid #ff5555;
    border-radius: 8px;
    background-color: #fff5f5;
    text-align: center;
  }

  h2 {
    color: #e53e3e;
    margin-bottom: 1rem;
  }

  .error-message {
    margin-bottom: 1rem;
    color: #2d3748;
  }

  details {
    margin: 1rem 0;
    padding: 1rem;
    background-color: #f7fafc;
    border-radius: 4px;
  }

  pre {
    overflow-x: auto;
    white-space: pre-wrap;
    word-wrap: break-word;
    font-size: 0.875rem;
    color: #4a5568;
  }

  button {
    padding: 0.5rem 1rem;
    background-color: #4299e1;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: #3182ce;
    }
  }
</style>

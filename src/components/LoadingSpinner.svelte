<script lang="ts">
  export let size: string = '40px';
  export let color: string = '#4299e1';
  export let overlay: boolean = false;
</script>

<div class="spinner-container" class:overlay>
  <div 
    class="spinner" 
    style="width: {size}; height: {size}; border-color: {color};"
  />
</div>

<style lang="scss">
  .spinner-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;

    &.overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(255, 255, 255, 0.8);
      z-index: 1000;
    }
  }

  .spinner {
    border: 3px solid transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  }
</style>

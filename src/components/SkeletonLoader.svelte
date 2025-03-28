<script lang="ts">
  export let width: string = '100%';
  export let height: string = '20px';
  export let borderRadius: string = '4px';
  export let margin: string = '0';
</script>

<div 
  class="skeleton" 
  style="
    width: {width}; 
    height: {height}; 
    border-radius: {borderRadius};
    margin: {margin};
  "
/>

<style lang="scss">
  .skeleton {
    background: linear-gradient(
      90deg,
      #f0f0f0 25%,
      #e0e0e0 50%,
      #f0f0f0 75%
    );
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
  }

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
</style>

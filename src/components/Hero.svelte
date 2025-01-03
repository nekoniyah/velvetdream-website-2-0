<script>
  // No props or state needed for this component
</script>

<section class="hero-wrapper">
  <div class="hero-content">
    <img src="/logo.png" alt="VelvetDream" />
    <p>Where imagination knows no bounds</p>
  </div>
</section>

<style>
  .hero-wrapper {
    background-color: var(--color-dark);
    min-height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 2rem;
  }

  .hero-content {
    max-width: 1200px;
    width: 100%;
  }

  img {
    max-width: 800px;
    width: 90%;
    height: auto;
    margin-bottom: 2rem;
  }

  p {
    font-size: 1.5rem;
    font-weight: 300;
    color: var(--color-light);
    margin-top: 2rem;
    font-family: var(--font-body);
  }
</style>
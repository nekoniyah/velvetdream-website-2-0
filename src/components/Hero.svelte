<script>
</script>

<section class="hero-wrapper">
  <div class="hero-content animate__animated animate__backInDown">
    <img src="/logo.png" alt="VelvetDream" class="glow-effect" />
    <p class="tagline animate__animated animate__fadeIn animate__delay-1s">Where imagination knows no bounds</p>
  </div>
  <div class="hero-overlay"></div>
</section>

<style>
  .hero-wrapper {
    background-color: var(--color-dark);
    min-height: 90vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: var(--spacing-xl);
    position: relative;
    overflow: hidden;
  }

  .hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, transparent 0%, var(--color-dark) 80%);
    z-index: 1;
  }

  .hero-content {
    max-width: 1200px;
    width: 100%;
    position: relative;
    z-index: 2;
  }

  img {
    max-width: 800px;
    width: 50%;
    height: auto;
    margin-bottom: var(--spacing-lg);
    transition: transform var(--transition-speed) ease;
  }

  .glow-effect {
    filter: drop-shadow(0 0 15px var(--color-secondary-light));
    animation: glow 3s ease-in-out infinite alternate;
  }

  @keyframes glow {
    from {
      filter: drop-shadow(0 0 15px var(--color-secondary-light));
    }
    to {
      filter: drop-shadow(0 0 25px var(--color-primary-light));
    }
  }

  .tagline {
    font-size: 2rem;
    font-weight: 300;
    color: var(--color-light);
    margin-top: var(--spacing-lg);
    font-family: var(--font-body);
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    letter-spacing: 2px;
  }

  @media (max-width: 768px) {
    .hero-wrapper {
      padding: var(--spacing-lg);
    }

    img {
      width: 80%;
    }

    .tagline {
      font-size: 1.5rem;
    }
  }
</style>

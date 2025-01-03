<script>
  // No imports needed since we're using Svelte's built-in styling

    import "../app.css";
</script>

<div class="about-wrapper">
  <h1>About VelvetDream</h1>
  
  <div class="about-content">
    <img 
      src="https://picsum.photos/800/600" 
      alt="VelvetDream Creative Process" 
    />
    
    <div class="about-text">
      <section>
        <h2>Our Story</h2>
        <p>
          VelvetDream is a creative house born from a passion for imagination and an aesthetic that fuses softness, diversity, and elegance. Inspired by Japanese culture, particularly anime, and enchanting fantasy universes, VelvetDream seeks to captivate hearts and awaken curiosity.
        </p>
      </section>
      
      <section>
        <h2>Our Mission</h2>
        <p>
          Our mission is to offer immersive and collaborative experiences through various projects: board games, video games, animated series... Each creation is set in the universe of Raoronia, a rich and vibrant world that embodies our values: inclusivity, creativity, and authenticity.
        </p>
      </section>
      
      <section>
        <h2>Our Vision</h2>
        <p>
          At VelvetDream, we believe in the power of collective and diversity. Our aesthetic blends "fluffy" and "cute" influences with elegant and captivating designs, inspiring a wide audience while honoring our roots in the LGBT+ community and the Furry Fandom. This balance allows VelvetDream to touch everyone while remaining true to its essence.
        </p>
      </section>
    </div>
  </div>
</div>

<style>

  .about-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 4rem 1rem;
  }

  .about-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    align-items: center;
  }

  img {
    width: 100%;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .about-text {
    font-size: 1.1rem;
    line-height: 1.6;
  }

  section {
    margin-bottom: 2rem;
  }

  @media (max-width: 768px) {
    .about-content {
      grid-template-columns: 1fr;
    }
  }
</style>
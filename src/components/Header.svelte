<script>
  import { Link } from "svelte-routing";
  let isMenuOpen = false;

  const toggleMenu = () => {
    isMenuOpen = !isMenuOpen;
  };
</script>

<header class="header-wrapper">
  <nav>
    <Link to="/">
      <img src="/icon.png" alt="VelvetDream Logo" class="logo" />
    </Link>

    <!-- Hamburger Button -->
    <button class="hamburger" on:click={toggleMenu} aria-label="Toggle menu">
      <span class="hamburger-line" class:open={isMenuOpen}></span>
      <span class="hamburger-line" class:open={isMenuOpen}></span>
      <span class="hamburger-line" class:open={isMenuOpen}></span>
    </button>

    <!-- Navigation Links -->
    <ul class="nav-links" class:active={isMenuOpen}>
      <li><Link to="/" on:click={toggleMenu}>Home</Link></li>
      <li><Link to="/about" on:click={toggleMenu}>About</Link></li>
      <li><Link to="/community" on:click={toggleMenu}>Community</Link></li>
      <li><Link to="/projects" on:click={toggleMenu}>Projects</Link></li>
      <li><Link to="/store" on:click={toggleMenu}>Store</Link></li>
      <li><Link to="/contact" on:click={toggleMenu}>Contact</Link></li>
    </ul>
  </nav>
</header>

<style>
  .header-wrapper {
    background-color: var(--color-light);
    padding: 1rem 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    position: relative;
  }

  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .logo {
    height: 50px;
    z-index: 2;
  }

  .hamburger {
    display: none;
    flex-direction: column;
    justify-content: space-around;
    width: 30px;
    height: 25px;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    z-index: 2;
  }

  .hamburger-line {
    width: 30px;
    height: 3px;
    background-color: var(--color-primary);
    transition: all 0.3s ease;
    position: relative;
  }

  .hamburger-line.open:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }

  .hamburger-line.open:nth-child(2) {
    opacity: 0;
  }

  .hamburger-line.open:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -7px);
  }

  .nav-links {
    display: flex;
    list-style-type: none;
    gap: 2rem;
  }

  /* Mobile styles */
  @media (max-width: 768px) {
    .hamburger {
      display: flex;
    }

    .nav-links {
      display: none;
      flex-direction: column;
      position: fixed;
      top: 0;
      right: 0;
      height: 100vh;
      width: 100%;
      background-color: var(--color-light);
      padding: 80px 2rem;
      text-align: center;
      gap: 2rem;
      z-index: 1;
    }

    .nav-links.active {
      display: flex;
    }

    .nav-links li {
      margin: 1rem 0;
    }
  }

  :global(.nav-links a) {
    font-family: var(--font-display);
    font-weight: bold;
    color: var(--color-primary);
    transition: color 0.3s ease;
  }

  :global(.nav-links a:hover) {
    color: var(--color-secondary);
  }
</style>

<script>
  import { Link } from "svelte-routing";
</script>

<header class="header-wrapper">
  <nav>
    <Link to="/">
      <img src="/icon.png" alt="VelvetDream Logo" class="logo" />
    </Link>
    <ul class="nav-links">
      <li><Link to="/">Home</Link></li>
      <li><Link to="/about">About</Link></li>
      <li><Link to="/projects">Projects</Link></li>
      <li><Link to="/store">Store</Link></li>
      <li><Link to="/contact">Contact</Link></li>
    </ul>
  </nav>
</header>

<style>
  .header-wrapper {
    background-color: var(--color-light);
    padding: 1rem 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  }

  .nav-links {
    display: flex;
    list-style-type: none;
    gap: 2rem;
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
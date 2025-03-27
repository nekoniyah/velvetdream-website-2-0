<script lang="ts">
  import { Link } from "svelte-routing";
  import { currentPath } from "../stores";
  import { onMount } from "svelte";
  let isMenuOpen = false;

  const toggleMenu = () => {
    isMenuOpen = !isMenuOpen;
  };

  onMount(() => {
    let ul = document.querySelector(".nav-links");
    let a = ul.querySelectorAll("div a") as NodeListOf<HTMLLinkElement>;

    for (let l of a) {
      l.addEventListener("click", (ev) => {
        currentPath.set(l.href);

        a.forEach((l) => {
          l.classList.remove("current");
        });

        l.classList.add("current");
      });
    }
  });
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
      <div>
        <li><Link to="/about" on:click={toggleMenu}>About</Link></li>
        <span></span>
      </div>
      <div>
        <li><Link to="/community" on:click={toggleMenu}>Community</Link></li>
        <span></span>
      </div>
      <div>
        <li><Link to="/projects" on:click={toggleMenu}>Projects</Link></li>
        <span></span>
      </div>
      <div>
        <li><Link to="/store" on:click={toggleMenu}>Store</Link></li>
        <span></span>
      </div>
      <div>
        <li><Link to="/contact" on:click={toggleMenu}>Contact</Link></li>
        <span></span>
      </div>
    </ul>
  </nav>
</header>

<style>
  .header-wrapper {
    height: 80px;
    box-shadow: var(--box-shadow);
    position: sticky;
    top: 0;
    left: 0;
    background-image: url(/background.png);
    background-repeat: no-repeat;
    background-size: 110%;
    background-position: 10% 10%;
    z-index: 1000;
    backdrop-filter: blur(5px);
    transition: all var(--transition-speed) ease;
  }

  nav {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--spacing-md);
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo {
    height: 70px;
    transition: transform var(--transition-speed) ease;
  }

  .logo:hover {
    transform: scale(1.05);
  }

  :global(.nav-links) {
    display: flex;
    gap: var(--spacing-lg);
    list-style: none;
  }

  :global(.nav-links div) {
    position: relative;
  }

  :global(.nav-links a) {
    color: var(--color-light);
    font-family: var(--font-display);
    font-size: 1.4rem;
    font-weight: bold;
    text-decoration: none;
    padding: var(--spacing-xs) var(--spacing-sm);
    transition: all var(--transition-speed) ease;
    text-transform: uppercase;
    text-shadow: 2px 2px 20px var(--color-primary);
  }

  :global(.nav-links a:hover) {
    color: var(--color-secondary);
  }

  :global(.nav-links a.current) {
    color: var(--color-secondary);
  }

  :global(.nav-links span) {
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 5px;
    background-color: var(--color-secondary);
    transition: width 0.6s ease-in-out;
    border-radius: 99px;
  }

  :global(.nav-links div:hover span) {
    width: 100%;
  }

  :global(.hamburger) {
    display: none;
    flex-direction: column;
    justify-content: space-around;
    width: 30px;
    height: 25px;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    z-index: 10;
  }

  :global(.hamburger-line) {
    width: 100%;
    height: 2px;
    background-color: var(--color-light);
    transition: all var(--transition-speed) ease;
  }

  @media (max-width: 768px) {
    :global(.hamburger) {
      display: flex;
    }

    :global(.nav-links) {
      position: fixed;
      top: 0;
      right: -100%;
      height: 100vh;
      width: 100%;
      background: var(--color-dark-2);
      flex-direction: column;
      justify-content: center;
      align-items: center;
      transition: right var(--transition-speed) ease;
      backdrop-filter: blur(10px);
    }

    :global(.nav-links.active) {
      right: 0;
    }

    :global(.nav-links a) {
      font-size: 1.8rem;
      margin: var(--spacing-md) 0;
    }

    :global(.hamburger-line.open:nth-child(1)) {
      transform: rotate(45deg) translate(5px, 5px);
    }

    :global(.hamburger-line.open:nth-child(2)) {
      opacity: 0;
    }

    :global(.hamburger-line.open:nth-child(3)) {
      transform: rotate(-45deg) translate(7px, -6px);
    }
  }
</style>

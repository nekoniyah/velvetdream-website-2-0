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
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    left: 0;
    background-image: url(/background.png);
    background-repeat: no-repeat;
    background-size: 110%;
    background-position: 10% 10%;
    z-index: 1;
  }

  nav {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .logo {
    height: 70px;
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
    position: static;
    top: 0;
    right: 0;
    text-align: center;
    z-index: 1;
    list-style-type: none;
    gap: 2rem;
  }

  :global(.nav-links div) {
    display: flex;
    align-items: center;
    flex-direction: column;
  }

  /* Mobile styles */
  @media (max-width: 768px) {
    .hamburger {
      display: flex;
    }

    .nav-links {
      display: none;
    }

    .nav-links.active {
      display: flex;
    }

    .nav-links div li {
      margin: 1rem 0;
    }
  }

  :global(.nav-links div li a) {
    font-family: var(--font-display);
    font-weight: bold;
    color: #fbfbfb;
    text-shadow: 2px 2px 20px var(--color-primary);

    transition: border-bottom 0.3s cubic-bezier(0.39, 0.575, 0.565, 1);
    font-size: 1.4rem;
    text-transform: uppercase;
  }

  @keyframes border_bot {
    0% {
      width: 0px;
      height: 5px;
      background-color: var(--color-secondary);
      border-radius: 99px;
    }

    100% {
      width: 100%;
      height: 5px;
      background-color: var(--color-secondary);
      border-radius: 99px;
    }
  }

  @keyframes border_bot_2 {
    0% {
      width: 100%;
      height: 5px;
      border-radius: 99px;
    }

    100% {
      width: 0px;
      height: 5px;
      border-radius: 99px;
    }
  }

  :global(.nav-links div:hover span) {
    animation-name: border_bot;
    animation-duration: 0.6s;
    animation-fill-mode: forwards;
    animation-timing-function: ease-in-out;
    background-color: var(--color-secondary);
    border-radius: 99px;
  }

  :global(.nav-links div span) {
    animation-name: border_bot_2;
    animation-duration: 0.6s;
    animation-fill-mode: forwards;
    animation-timing-function: ease-in-out;
    background-color: var(--color-secondary);
    border-radius: 99px;
  }

  /* :global(.nav-links div a.current) {
    color: var(--color-secondary); */
  /* } */
</style>

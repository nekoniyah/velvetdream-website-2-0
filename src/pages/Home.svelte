<script>
  import Hero from "../components/Hero.svelte";
  import FeaturedProjects from "../components/FeaturedProjects.svelte";
  import About from "./About.svelte";

  import "../app.css";
  import Community from "./Community.svelte";
</script>

<div
  class="home-wrapper animate__animated animate__slideInDown animate__fadeIn"
>
  <Hero />
  <Community />
  <FeaturedProjects />
</div>

<style>
  .home-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }
</style>

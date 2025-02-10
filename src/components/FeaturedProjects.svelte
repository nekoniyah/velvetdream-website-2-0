<script>
  import { Link } from "svelte-routing";
  import ProjectCard from "./ProjectCard.svelte";

  const featuredProjects = [
    {
      id: 1,
      title: "Beast: Shapes of Gods",
      description:
        "BSOG (Beast: Shapes of Gods) is a TCG (Trading Card Game) inspired by League of Legends and MTG (Magic: The Gathering). Fight with your favorite heroes and spells in a fast-paced game.",
      image: "bsog.png",
      tags: ["TCG", "Card Game", "Strategy"],
    },
    {
      id: 2,
      title: "Blatant: Fight with skill",
      description:
        "Blatant is a board game where you must use your resources to enhance your pawns and reach the enemy base to win the game. Cast unique cards to surprise your enemies, capture other enemy pawns, manage your resources, etc. This is played between 2 and 4 players.",
      image: "blatant.png",
      tags: ["Board Game", "Strategy"],
    },
  ];
</script>

<section class="projects-wrapper">
  <div class="projects-content">
    <h2>Featured Projects</h2>
    <div class="project-grid">
      {#each featuredProjects as project (project.id)}
        <ProjectCard {project} />
      {/each}
    </div>
    <Link to="/projects" class="view-all">View All Projects</Link>
  </div>
</section>

<style>
  .projects-wrapper {
    padding: 4rem 0;
    background-color: #f9f9f9;
  }

  .projects-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  h2 {
    font-size: 2.5rem;
    text-align: center;
    margin-bottom: 2rem;
    color: var(--color-primary);
  }

  .project-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;
  }

  :global(.view-all) {
    display: block;
    text-align: center;
    font-weight: bold;
    color: var(--color-primary);
    transition: color 0.3s ease;
  }

  :global(.view-all:hover) {
    color: var(--color-secondary);
  }
</style>

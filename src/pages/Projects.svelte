<script lang="ts">
  import ProjectCard from "../components/ProjectCard.svelte";
  import TagFilter from "../components/TagFilter.svelte";

  let selectedTags = [];

  const projects = [
    {
      id: 1,
      title: "Beast: Shapes of Gods",
      description: "BSOG (Beast: Shapes of Gods) is a TCG (Trading Card Game) inspired by League of Legends and MTG (Magic: The Gathering). Fight with your favorite heroes and spells in a fast-paced game.",
      image: "bsog.png",
      tags: ["TCG", "Card Game", "Strategy"]
    },
    {
      id: 2,
      title: "Blatant: Fight with skill",
      description: "Blatant is a board game where you must use your resources to enhance your pawns and reach the enemy base to win the game. Cast unique cards to surprise your enemies, capture other enemy pawns, manage your resources, etc. This is played between 2 and 4 players.",
      image: "blatant.png",
      tags: ["Board Game", "Strategy"]
    },
    {
      id: 3,
      title: "Coming soon...",
      description: "We are working on new projects. Stay tuned!",
      image: "1.png",
      tags: ["New Project"]
    }
  ];
  // Extract unique tags from all projects
  const allTags = [...new Set(projects.flatMap((project) => project.tags))];

  $: filteredProjects =
    selectedTags.length > 0
      ? projects.filter((project) =>
          project.tags.some((tag) => selectedTags.includes(tag)),
        )
      : projects;
</script>

<div class="projects-wrapper">
  <h1>Our Projects</h1>
  <TagFilter tags={allTags} bind:selectedTags />
  <div class="project-grid">
    {#each filteredProjects as project (project.id)}
      <ProjectCard {project} />
    {/each}
  </div>
</div>

<style>
  .projects-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 4rem 1rem;
  }

  .project-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }
</style>

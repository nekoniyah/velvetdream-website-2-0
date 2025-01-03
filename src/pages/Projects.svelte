<script>
  import ProjectCard from "../components/ProjectCard.svelte";
  import "../app.css";
  
  const projects = [
    {
      id: 1,
      title: "Example Project 1",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
      image: "https://picsum.photos/600/400"
    },
    {
      id: 2,
      title: "Example Project 2",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
      image: "https://picsum.photos/600/400"
    },
    {
      id: 3,
      title: "Example Project 3",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
      image: "https://picsum.photos/600/400"
    }
  ];
</script>

<div class="projects-wrapper">
  <h1>Our Projects</h1>
  <div class="project-grid">
    {#each projects as project (project.id)}
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
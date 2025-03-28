<script lang="ts">
  interface Project {
    _id: string;
    title: string;
    description: string;
    image: string;
    tags: string[];
    githubUrl?: string;
    liveUrl?: string;
  }

  export let project: Project;
</script>

<div class="project-card animate__animated animate__fadeIn">
  <div class="project-image">
    <img src={"/"+project.image} alt={project.title} loading="lazy" />
  </div>
  <div class="project-content">
    <h3>{project.title}</h3>
    <p>{project.description}</p>
    <div class="tags">
      {#each project.tags as tag}
        <span class="tag">{tag}</span>
      {/each}
    </div>
    <div class="project-links">
      {#if project.githubUrl}
        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" class="btn github">
          <i class="fab fa-github"></i> View Code
        </a>
      {/if}
      {#if project.liveUrl}
        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" class="btn live">
          <i class="fas fa-external-link-alt"></i> Live Demo
        </a>
      {/if}
    </div>
  </div>
</div>

<style lang="scss">
  .project-card {
    background: var(--bg-secondary);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
    }
  }

  .project-image {
    width: 100%;
    height: 200px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.05);
      }
    }
  }

  .project-content {
    padding: 1.5rem;
  }

  h3 {
    font-size: 1.5rem;
    margin: 0 0 1rem;
    color: var(--text-primary);
  }

  p {
    color: var(--text-secondary);
    margin-bottom: 1rem;
    line-height: 1.6;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .tag {
    background: var(--primary-color);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 999px;
    font-size: 0.875rem;
    opacity: 0.9;
  }

  .project-links {
    display: flex;
    gap: 1rem;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-weight: 500;
    text-decoration: none;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.9;
    }

    i {
      font-size: 1.1rem;
    }
  }

  .github {
    background: #24292e;
    color: white;
  }

  .live {
    background: var(--primary-color);
    color: white;
  }

  @media (max-width: 768px) {
    .project-links {
      flex-direction: column;
    }

    .btn {
      width: 100%;
      justify-content: center;
    }
  }
</style>

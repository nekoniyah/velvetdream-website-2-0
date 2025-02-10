<script>
  export let project;
</script>

<div class="card">
  <img src={"/" + project.image} alt={project.title} />
  <div class="content">
    <h3>{project.title}</h3>
    <p>{project.description}</p>
  </div>
</div>

<style>
  .card {
    background-color: var(--color-light);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
  }

  .card:hover {
    transform: translateY(-5px);
  }

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }

  .content {
    padding: 1.5rem;
  }

  h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: var(--color-primary);
  }

  p {
    color: var(--color-dark);
  }
</style>

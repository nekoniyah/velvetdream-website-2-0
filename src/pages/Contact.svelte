<script>
  import "../app.css";

  let formData = {
    name: "",
    email: "",
    message: "",
  };
  let status = { message: "", type: "" };

  async function handleSubmit(event) {
    event.preventDefault();
    status = { message: "", type: "" };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to send message");

      status = {
        message: "Thank you for your message. We will get back to you soon!",
        type: "success",
      };
      formData = { name: "", email: "", message: "" };
    } catch (error) {
      status = {
        message: "Failed to send message. Please try again later.",
        type: "error",
      };
    }
  }
</script>

<div class="contact-wrapper">
  <h1>Contact Us</h1>

  {#if status.message}
    <div class="alert {status.type}">
      {status.message}
    </div>
  {/if}

  <form on:submit={handleSubmit}>
    <div class="form-group">
      <label for="name">Name</label>
      <input type="text" id="name" bind:value={formData.name} required />
    </div>

    <div class="form-group">
      <label for="email">Email</label>
      <input type="email" id="email" bind:value={formData.email} required />
    </div>

    <div class="form-group">
      <label for="message">Message</label>
      <textarea id="message" bind:value={formData.message} required></textarea>
    </div>

    <button type="submit">Send Message</button>
  </form>
</div>

<style>
  .contact-wrapper {
    max-width: 800px;
    margin: 0 auto;
    padding: 4rem 1rem;
  }

  h1 {
    font-size: 3rem;
    color: var(--color-primary);
    margin-bottom: 2rem;
    text-align: center;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
  }

  label {
    margin-bottom: 0.5rem;
    color: var(--color-primary);
  }

  input,
  textarea {
    padding: 0.5rem;
    border: 1px solid var(--color-primary);
    border-radius: 4px;
  }

  textarea {
    min-height: 150px;
    resize: vertical;
  }

  button {
    background-color: var(--color-primary);
    color: var(--color-light);
    padding: 0.8rem 1.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  button:hover {
    background-color: var(--color-secondary);
  }

  .alert {
    padding: 1rem;
    border-radius: 4px;
    margin-bottom: 1rem;
    text-align: center;
  }

  .success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }

  .error {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }
</style>

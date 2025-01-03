<script>
    import "../app.css";
    
  let formData = {
    name: "",
    email: "",
    message: ""
  };

  async function handleSubmit(event) {
    event.preventDefault();
    
    try {
      await fetch('/api/mail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      alert('Thank you for your message. We will get back to you soon!');
      formData = { name: '', email: '', message: '' };
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
</script>

<div class="contact-wrapper">
  <h1>Contact Us</h1>
  
  <form on:submit={handleSubmit}>
    <div class="form-group">
      <label for="name">Name</label>
      <input
        type="text"
        id="name"
        bind:value={formData.name}
        required
      />
    </div>
    
    <div class="form-group">
      <label for="email">Email</label>
      <input
        type="email"
        id="email"
        bind:value={formData.email}
        required
      />
    </div>
    
    <div class="form-group">
      <label for="message">Message</label>
      <textarea
        id="message"
        bind:value={formData.message}
        required
      ></textarea>
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

  input, textarea {
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
</style>
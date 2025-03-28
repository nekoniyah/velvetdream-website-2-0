<script lang="ts">
  import { loading } from '../stores/loading';
  import { api } from '../utils/api';
  import LoadingSpinner from '../components/LoadingSpinner.svelte';

  interface ContactForm {
    name: string;
    email: string;
    message: string;
  }

  interface FormErrors {
    name?: string;
    email?: string;
    message?: string;
  }

  let form: ContactForm = {
    name: '',
    email: '',
    message: ''
  };

  let errors: FormErrors = {};
  let submitStatus: 'idle' | 'success' | 'error' = 'idle';

  function validateForm(): boolean {
    errors = {};
    let isValid = true;

    if (!form.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }

    if (!form.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!form.message.trim()) {
      errors.message = 'Message is required';
      isValid = false;
    }

    return isValid;
  }

  async function handleSubmit() {
    if (!validateForm()) return;

    try {
      await api('/api/contact', {
        method: 'POST',
        body: JSON.stringify(form),
        loadingKey: 'contactSubmit'
      });

      submitStatus = 'success';
      form = { name: '', email: '', message: '' };

      // Reset success message after 5 seconds
      setTimeout(() => {
        submitStatus = 'idle';
      }, 5000);
    } catch (error) {
      submitStatus = 'error';
      console.error('Failed to send message:', error);
    }
  }
</script>

<div class="contact-container animate__animated animate__fadeIn">
  <h1>Contact Us</h1>
  <p class="subtitle">Have a question or want to work together? Drop us a message!</p>

  <form on:submit|preventDefault={handleSubmit} class="contact-form">
    <div class="form-group">
      <label for="name">Name</label>
      <input
        type="text"
        id="name"
        bind:value={form.name}
        class:error={errors.name}
        placeholder="Your name"
      />
      {#if errors.name}
        <span class="error-message">{errors.name}</span>
      {/if}
    </div>

    <div class="form-group">
      <label for="email">Email</label>
      <input
        type="email"
        id="email"
        bind:value={form.email}
        class:error={errors.email}
        placeholder="your@email.com"
      />
      {#if errors.email}
        <span class="error-message">{errors.email}</span>
      {/if}
    </div>

    <div class="form-group">
      <label for="message">Message</label>
      <textarea
        id="message"
        bind:value={form.message}
        class:error={errors.message}
        placeholder="Your message here..."
        rows="5"
      ></textarea>
      {#if errors.message}
        <span class="error-message">{errors.message}</span>
      {/if}
    </div>

    <button 
      type="submit" 
      class="submit-button" 
      disabled={$loading.contactSubmit}
    >
      {#if $loading.contactSubmit}
        <LoadingSpinner size="20px" color="white" />
      {:else}
        Send Message
      {/if}
    </button>

    {#if submitStatus === 'success'}
      <div class="alert success animate__animated animate__fadeIn">
        Message sent successfully! We'll get back to you soon.
      </div>
    {:else if submitStatus === 'error'}
      <div class="alert error animate__animated animate__fadeIn">
        Failed to send message. Please try again later.
      </div>
    {/if}
  </form>
</div>

<style lang="scss">
  .contact-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
  }

  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: var(--text-primary);
    text-align: center;
  }

  .subtitle {
    text-align: center;
    color: var(--text-secondary);
    margin-bottom: 2rem;
  }

  .contact-form {
    background: var(--bg-secondary);
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--text-primary);
    font-weight: 500;
  }

  input,
  textarea {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid var(--border-color);
    border-radius: 6px;
    background: var(--bg-primary);
    color: var(--text-primary);
    font-size: 1rem;
    transition: border-color 0.2s ease;

    &:focus {
      outline: none;
      border-color: var(--primary-color);
    }

    &.error {
      border-color: var(--error-color);
    }

    &::placeholder {
      color: var(--text-secondary);
      opacity: 0.7;
    }
  }

  .error-message {
    color: var(--error-color);
    font-size: 0.875rem;
    margin-top: 0.25rem;
    display: block;
  }

  .submit-button {
    width: 100%;
    padding: 1rem;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;

    &:hover:not(:disabled) {
      background: var(--primary-color-dark);
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }

  .alert {
    margin-top: 1rem;
    padding: 1rem;
    border-radius: 6px;
    text-align: center;

    &.success {
      background: var(--success-bg);
      color: var(--success-color);
      border: 1px solid var(--success-border);
    }

    &.error {
      background: var(--error-bg);
      color: var(--error-color);
      border: 1px solid var(--error-border);
    }
  }

  @media (max-width: 768px) {
    .contact-container {
      padding: 1rem;
    }

    h1 {
      font-size: 2rem;
    }

    .contact-form {
      padding: 1.5rem;
    }
  }
</style>

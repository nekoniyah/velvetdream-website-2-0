<script lang="ts">
  import { navigate } from 'svelte-routing';
  import { loading } from '../stores/loading';
  import { api } from '../utils/api';
  import LoadingSpinner from '../components/LoadingSpinner.svelte';

  interface LoginForm {
    username: string;
    password: string;
  }

  interface FormErrors {
    username?: string;
    password?: string;
    general?: string;
  }

  let form: LoginForm = {
    username: '',
    password: ''
  };

  let errors: FormErrors = {};
  let showPassword = false;

  function validateForm(): boolean {
    errors = {};
    let isValid = true;

    if (!form.username.trim()) {
      errors.username = 'Username is required';
      isValid = false;
    }

    if (!form.password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (form.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    return isValid;
  }

  async function handleSubmit() {
    if (!validateForm()) return;

    try {
      const response = await api<{ token: string; username: string }>('/api/login', {
        method: 'POST',
        body: JSON.stringify(form),
        loadingKey: 'login'
      });

      // Store token and username in localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('username', response.username);

      // Redirect to home page
      navigate('/');
    } catch (error) {
      errors.general = 'Invalid username or password';
      console.error('Login failed:', error);
    }
  }

  function togglePassword() {
    showPassword = !showPassword;
  }
</script>

<div class="login-container animate__animated animate__fadeIn">
  <h1>Login</h1>
  <p class="subtitle">Welcome back! Please login to your account.</p>

  <form on:submit|preventDefault={handleSubmit} class="login-form">
    {#if errors.general}
      <div class="alert error animate__animated animate__fadeIn">
        {errors.general}
      </div>
    {/if}

    <div class="form-group">
      <label for="username">Username</label>
      <input
        type="text"
        id="username"
        bind:value={form.username}
        class:error={errors.username}
        placeholder="Your username"
        autocomplete="username"
      />
      {#if errors.username}
        <span class="error-message">{errors.username}</span>
      {/if}
    </div>

    <div class="form-group">
      <label for="password">Password</label>
      <div class="password-input">
        {#if showPassword}
          <input
            type="text"
            id="password"
            bind:value={form.password}
            class:error={errors.password}
            placeholder="Your password"
            autocomplete="current-password"
          />
        {:else}
          <input
            type="password"
            id="password"
            bind:value={form.password}
            class:error={errors.password}
            placeholder="Your password"
            autocomplete="current-password"
          />
        {/if}
        <button 
          type="button" 
          class="toggle-password" 
          on:click={togglePassword}
        >
          <i class={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
        </button>
      </div>
      {#if errors.password}
        <span class="error-message">{errors.password}</span>
      {/if}
    </div>

    <button 
      type="submit" 
      class="submit-button" 
      disabled={$loading.login}
    >
      {#if $loading.login}
        <LoadingSpinner size="20px" color="white" />
      {:else}
        Login
      {/if}
    </button>

    <div class="form-footer">
      <p>
        Don't have an account? <a href="/register">Register here</a>
      </p>
      <a href="/forgot-password" class="forgot-password">Forgot Password?</a>
    </div>
  </form>
</div>

<style lang="scss">
  .login-container {
    max-width: 400px;
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

  .login-form {
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

  .password-input {
    position: relative;
    display: flex;
    align-items: center;
  }

  input {
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

  .toggle-password {
    position: absolute;
    right: 0.75rem;
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      color: var(--text-primary);
    }

    i {
      font-size: 1.1rem;
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
    margin-bottom: 1.5rem;

    &:hover:not(:disabled) {
      background: var(--primary-color-dark);
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }

  .form-footer {
    text-align: center;
    color: var(--text-secondary);

    a {
      color: var(--primary-color);
      text-decoration: none;
      font-weight: 500;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .forgot-password {
    display: block;
    margin-top: 1rem;
    font-size: 0.875rem;
  }

  .alert {
    margin-bottom: 1.5rem;
    padding: 1rem;
    border-radius: 6px;
    text-align: center;

    &.error {
      background: var(--error-bg);
      color: var(--error-color);
      border: 1px solid var(--error-border);
    }
  }

  @media (max-width: 768px) {
    .login-container {
      padding: 1rem;
    }

    h1 {
      font-size: 2rem;
    }

    .login-form {
      padding: 1.5rem;
    }
  }
</style>

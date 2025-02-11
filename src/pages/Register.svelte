<script>
  import { navigate } from "svelte-routing";

  let username = "";
  let email = "";
  let password = "";
  let confirmPassword = "";
  let error = null;

  async function handleRegister(event) {
    event.preventDefault();
    error = null;

    if (password !== confirmPassword) {
      error = "Passwords do not match";
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Registration failed");
      }

      // Registration successful
      navigate("/login");
    } catch (err) {
      error = err.message;
      password = "";
      confirmPassword = "";
    }
  }
</script>

<div class="register-wrapper">
  <h1>Register</h1>

  {#if error}
    <div class="error">{error}</div>
  {/if}

  <form on:submit={handleRegister}>
    <div class="form-group">
      <label for="username">Username</label>
      <input
        type="text"
        id="username"
        bind:value={username}
        required
        minlength="3"
      />
    </div>

    <div class="form-group">
      <label for="email">Email</label>
      <input type="email" id="email" bind:value={email} required />
    </div>

    <div class="form-group">
      <label for="password">Password</label>
      <input
        type="password"
        id="password"
        bind:value={password}
        required
        minlength="6"
      />
    </div>

    <div class="form-group">
      <label for="confirm-password">Confirm Password</label>
      <input
        type="password"
        id="confirm-password"
        bind:value={confirmPassword}
        required
      />
    </div>

    <button type="submit">Register</button>
  </form>

  <p class="login-link">
    Already have an account? <a href="/login">Login here</a>
  </p>
</div>

<style>
  .register-wrapper {
    max-width: 400px;
    margin: 4rem auto;
    padding: 2rem;
    background: var(--color-light);
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .error {
    color: #721c24;
    background-color: #f8d7da;
    padding: 1rem;
    border-radius: 4px;
    margin-bottom: 1rem;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--color-dark);
  }

  input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  button {
    width: 100%;
    padding: 0.75rem;
    background: var(--color-primary);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  button:hover {
    background: var(--color-secondary);
  }

  .login-link {
    text-align: center;
    margin-top: 1rem;
  }

  .login-link a {
    color: var(--color-primary);
    text-decoration: none;
  }

  .login-link a:hover {
    text-decoration: underline;
  }
</style>

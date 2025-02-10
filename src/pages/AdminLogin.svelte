<script>
  import { navigate } from "svelte-routing";

  let password = "";
  let error = null;

  async function handleLogin(event) {
    event.preventDefault();
    error = null;

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) throw new Error("Invalid credentials");

      const { token } = await response.json();
      localStorage.setItem("adminToken", token);
      navigate("/admin/dashboard");
    } catch (err) {
      error = err.message;
      password = "";
    }
  }
</script>

<div class="login-wrapper">
  <h1>Admin Login</h1>

  {#if error}
    <div class="error">{error}</div>
  {/if}

  <form on:submit={handleLogin}>
    <div class="form-group">
      <label for="password">Admin Password</label>
      <input type="password" id="password" bind:value={password} required />
    </div>
    <button type="submit">Login</button>
  </form>
</div>

<style>
  .login-wrapper {
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
</style>

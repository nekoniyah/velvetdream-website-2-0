<script>
  import { Link } from "svelte-routing";
  import { FaFacebookF, FaTwitter, FaInstagram } from 'svelte-icons/fa';
</script>

<footer class="footer-wrapper">
  <div class="footer-content">
    <div class="footer-section">
      <h3>Quick Links</h3>
      <ul class="footer-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/projects">Projects</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/privacy">Confidentiality Policy</Link></li>
      </ul>
    </div>

    <div class="footer-section">
      <h3>Connect With Us</h3>
      <div class="social-icons">
        <a 
          href="https://x.com/velvetdream_off" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <FaTwitter />
        </a>
        <a 
          href="https://www.instagram.com/velvetdream.off/" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <FaInstagram  />
        </a>
      </div>
    </div>

    <div class="footer-section">
      <h3>Contact Us</h3>
      <p>Email: contact@velvetdream.eu</p>
    </div>
  </div>
  <p class="copyright">&copy; 2024-2025 VelvetDream. All rights reserved.</p>
</footer>

<style>
  .footer-wrapper {
    background-color: var(--color-dark);
    color: var(--color-light);
    padding: 3rem 0 1rem;
  }

  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
    padding: 0 1rem;
  }

  .footer-section h3 {
    font-family: var(--font-display);
    color: var(--color-secondary);
    margin-bottom: 1rem;
  }

  .footer-links {
    list-style-type: none;
    padding: 0;
  }

  :global(.footer-links a) {
    color: var(--color-light);
    text-decoration: none;
    transition: color 0.3s ease;
  }

  :global(.footer-links a:hover) {
    color: var(--color-secondary);
  }

  :global(.social-icons) {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }

  :global(.social-icons a) {
    color: var(--color-light);
    font-size: 1.5rem;
    transition: color 0.3s ease;
    width: 2rem;
    height: 2rem;
  }

  .social-icons a:hover {
    color: var(--color-secondary);
  }

  .copyright {
    text-align: center;
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px solid #555;
  }
</style>
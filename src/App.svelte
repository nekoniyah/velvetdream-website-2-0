<script>
  import { Router, Link, Route } from "svelte-routing";
  import Header from "./components/Header.svelte";
  import Footer from "./components/Footer.svelte";
  import Home from "./pages/Home.svelte";
  import About from "./pages/About.svelte";
  import Projects from "./pages/Projects.svelte";
  import Contact from "./pages/Contact.svelte";
  
  export let url = "";
</script>

<Router {url}>
  <div class="App">
    <Header />
    <main>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/projects" component={Projects} />
      <Route path="/contact" component={Contact} />
    </main>
    <Footer />
  </div>
</Router>

<style>
  :global(:root) {
    --color-primary: #A41623;
    --color-secondary: #D4AF37;
    --color-dark: #0F0F0F;
    --color-light: #FFFFFF;
    --font-display: 'Aclonica', sans-serif;
    --font-body: 'Dosis', sans-serif;
  }
</style>
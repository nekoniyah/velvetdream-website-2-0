<script>
  import { Router, Route } from "svelte-routing";
  import Header from "./components/Header.svelte";
  import Footer from "./components/Footer.svelte";
  import Home from "./pages/Home.svelte";
  import About from "./pages/About.svelte";
  import Projects from "./pages/Projects.svelte";
  import Contact from "./pages/Contact.svelte";
  import Privacy from "./pages/Privacy.svelte";
  import Store from "./pages/Store.svelte";
  import Community from "./pages/Community.svelte";
  import Dashboard from "./pages/Dashboard.svelte";
  import AdminLogin from "./pages/AdminLogin.svelte";
  import Login from "./pages/Login.svelte";
  import Register from "./pages/Register.svelte";

  export let url = "";

  // Add routes to the store
  import { routes } from "./stores";
  import "animate.css";

  routes.update((routes) => [
    ...routes,
    { name: "About", path: "/about" },
    { name: "Projects", path: "/projects" },
    { name: "Contact", path: "/contact" },
    { name: "Privacy", path: "/privacy" },
    { name: "Store", path: "/store" },
    { name: "Community", path: "/community" },
  ]);
</script>

<Router {url}>
  <div class="App">
    <Header />
    <main>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/projects" component={Projects} />
      <Route path="/contact" component={Contact} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/store" component={Store} />
      <Route path="/community" component={Community} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={Dashboard} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Footer />
    </main>
  </div>
</Router>

<style>
</style>

import App from './App.svelte';
const target = document.getElementById('app');
if (!target) {
    throw new Error('Could not find app element');
}
const app = new App({
    target,
    props: {
        url: window.location.pathname,
    },
});
export default app;
//# sourceMappingURL=main.js.map
import { writable } from "svelte/store";

export let currentPath = writable("/")
export let routes:import("svelte/store").Writable<{path:string, name:string}[]> = writable([])

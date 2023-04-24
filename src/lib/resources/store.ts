import { writable } from "svelte/store"

export const logStore = writable({
  log: "none"
})
import { writable } from 'svelte/store';

interface LoadingState {
  [key: string]: boolean;
}

function createLoadingStore() {
  const { subscribe, update } = writable<LoadingState>({});

  return {
    subscribe,
    startLoading: (key: string) => {
      update(state => ({ ...state, [key]: true }));
    },
    stopLoading: (key: string) => {
      update(state => ({ ...state, [key]: false }));
    },
    isLoading: (key: string) => {
      let currentState: LoadingState = {};
      subscribe(state => {
        currentState = state;
      })();
      return currentState[key] || false;
    }
  };
}

export const loading = createLoadingStore();

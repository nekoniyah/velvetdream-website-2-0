import { writable } from 'svelte/store';
function createLoadingStore() {
    const { subscribe, update } = writable({});
    return {
        subscribe,
        startLoading: (key) => {
            update(state => ({ ...state, [key]: true }));
        },
        stopLoading: (key) => {
            update(state => ({ ...state, [key]: false }));
        },
        isLoading: (key) => {
            let currentState = {};
            subscribe(state => {
                currentState = state;
            })();
            return currentState[key] || false;
        }
    };
}
export const loading = createLoadingStore();
//# sourceMappingURL=loading.js.map
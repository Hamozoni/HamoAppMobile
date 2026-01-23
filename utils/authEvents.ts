type Listener = () => void;
const listeners = new Set<Listener>();

export const onAuthFailed = (cb: Listener) => listeners.add(cb);
export const emitAuthFailed = () => listeners.forEach(cb => cb());
import { migration001, Migration } from "./001_init";


export const migrations: Migration[] = [migration001];

if (__DEV__) {
    migrations.forEach((m, i) => {
        if (m.version !== i + 1) {
            throw new Error(`Migration "${m.name}" has version ${m.version}, expected ${i + 1}`);
        }
    });
}
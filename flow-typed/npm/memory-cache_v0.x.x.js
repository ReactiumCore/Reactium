// flow-typed signature: c67194e2056bf7f9cd3d63b045c42e21
// flow-typed version: 4ec3bc41cf/memory-cache_v0.x.x/flow_>=v0.99.x

declare module 'memory-cache' {
    declare class MemoryCache {
        put(
            key: string,
            value: *,
            time?: number,
            timeoutCallback?: (key: string, value: *) => void,
        ): void;
        get(key: string): *;
        del(key: string): boolean;
        clear(): void;
        size(): number;
        memsize(): number;
        debug(debug: boolean): void;
        hits(): number;
        misses(): number;
        keys(): string[];
        exportJson(): string;
        importJson(
            json: string,
            options?: { skipDuplicates: boolean, ... },
        ): number;
        Cache(): MemoryCache;
    }

    declare export default MemoryCache;
}

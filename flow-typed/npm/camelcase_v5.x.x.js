// flow-typed signature: d07a37f6156548f0018bb92c04065b60
// flow-typed version: c6154227d1/camelcase_v5.x.x/flow_>=v0.104.x

declare module 'camelcase' {
    declare module.exports: (
        input: string | string[],
        options?: { pascalCase?: boolean, ... },
    ) => string;
}

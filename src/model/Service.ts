import {MethodStub} from "./MethodStub";

type DependencyStub = {
    service: string,
    method: number
}

type InfrastructureDependencyStub = {
    infrastructure: string,
    specifications: string[]
}

class Service {
    constructor(
        public name: string,
        public version: string,
        public methods: MethodStub[],
        public dependencies: DependencyStub[],
    ) {
    }
    infrastructureDependencies?: InfrastructureDependencyStub[]
}

export { Service };
export type { DependencyStub, InfrastructureDependencyStub };

type InfrastructureDependency = {
    service: string
}

type InfrastructureInterface = {
    name: string
}

type InfrastructureType = 'database' | 'redis' | 'messageQueue'

class Infrastructure {
    constructor(
        public type: InfrastructureType,
        public name: string,
        public dependencies: InfrastructureDependency[],
        public interfaces: InfrastructureInterface[]
    ) {
    }
}

export type {InfrastructureDependency, InfrastructureInterface, InfrastructureType}
export {Infrastructure}
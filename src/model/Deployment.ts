import {Service} from "./Service";
import {Infrastructure} from "./Infrastructure";


class Deployment {
    constructor(
        public name: string,
        public version: string,
        public count: number
    ) {
    }
}

class ServiceDeployment extends Deployment {
    constructor(
        public name: string,
        public version: string,
        public count: number,
        public dockerLink: string,
        public service: Service
    ) {
        super(name, version, count);
    }
}

class InfrastructureDeployment extends Deployment {
    constructor(
        public name: string,
        public version: string,
        public count: number,
        public infrastructure: Infrastructure
    ) {
        super(name, version, count);
    }
}

export {Deployment, ServiceDeployment, InfrastructureDeployment}
import {Service} from "../model/Service";
import {Param, StructType} from "../model/MethodStub";


const save = (structs: StructType[], services: Service[]):string => {
    return JSON.stringify({
        structs: structs,
        services: services
    })
}



const loadFromJson = (source: string): {
    structs: StructType[],
    services: Service[]
} => {
    const structs: StructType[] = []
    const services: Service[] = []
    const topResult: {structs: [], services: []} = JSON.parse(source)

    for (let structRaw of topResult.structs) {
        const structResult: {name: string, params: []} = JSON.parse(structRaw)

        const params: Param[] = []
        for (let paramRaw of structResult.params) {

        }
        structs.push(new StructType(structResult.name, params))
    }

    return JSON.parse(source)
}

export {save, loadFromJson}
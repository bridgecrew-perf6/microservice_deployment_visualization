import {IntegerType, ListType, MapType, MethodStub, Param, StringType, StructType, Type} from "../model/MethodStub";
import {Service} from "../model/Service";

type FileResult = {
    structs: StructType[],
    services: Service[]
}

class StructStubType implements Type {
    constructor(
        public name: string
    ) {
    }
    getName(): string {
        return this.name
    }
}

const getDepth = (field: string):{
    from: number,
    to: number
}[] => {
    let results: {
        from: number, to: number
    }[] = []
    let closeIndex = 0
    for (let i = 0; i < field.length; i++) {
        const ch = field[i]
        if (ch === '<') {
            results.push({
                from: i,
                to: i
            })
            closeIndex++
        } else if (ch === '>') {
            results[--closeIndex].to = i + 1
        }
    }
    return results
}

const readBasicType = (expr: string) => {
    switch (expr) {
        case "string": return StringType
        case "int": return IntegerType
        case "int32": return IntegerType
    }
    return new StructStubType(expr)
}



const readDepthType = (expr: string, kind: 'list' | 'map'): Type => {
    const keyReg = /\w+(?=,)/
    const valueReg = /(?<=,\s*)[\w.]+(?=>)/
    const listReg = /[\w.]+(?=\s*>)/
    if (kind === "map") {
        const keyResult = keyReg.exec(expr)
        const valueResult = valueReg.exec(expr)
        const keyType = readBasicType(keyResult?.[0] ?? "")
        const valueType = readBasicType(valueResult?.[0] ?? "")

        return new MapType(keyType, valueType)
    }
    const listResult = listReg.exec(expr)
    if (listResult === null) {
        return StringType
    }
    return new ListType(readBasicType(listResult[0]))
}

/**
 * read list, map type
 * @param expr
 */
const readType = (expr: string):Type => {
    const pairs = getDepth(expr)
    let lastType: Type | null = null
    for (let d = pairs.length - 1; d >= 0; d--) {

        const { from, to } = pairs[d]
        const kind = expr[from - 1] === "t" ? 'list' : 'map'
        const type = readDepthType(expr.slice(from, to), kind)
        if (type instanceof MapType) {
            if (lastType !== null) {
                type.valueType = lastType
            }
            expr = expr.slice(0, from - 3) + "a".repeat(to - from + 3) + expr.slice(to, expr.length)
        } else if (type instanceof ListType) {
            if (lastType !== null) {
                type.itemType = lastType
            }
            expr = expr.slice(0, from - 4) + "a".repeat(to - from + 4) + expr.slice(to, expr.length)
        } else {
            expr = expr.slice(0, from) + "a".repeat(to - from) + expr.slice(to, expr.length)
        }
        lastType = type
    }
    return lastType ?? StringType
}


const readMessage = (message: string): StructType => {
    const nameReg = /(?<=message\s*)\w+(?=\s*{)/
    const structName: string = nameReg.exec(message)?.[0] ?? ""

    const fieldNameReg = /\w+(?=\s*=\s*\d+\s*;)/
    const mapReg = /(?<!list.*)map<[\w\s,<>.]+>(?=\s+\w+\s*=\s*\d+;)/
    const listReg = /(?<!map.*)list<[\w\s,.<>]+>(?=\s+\w+\s*=\s*\d+;)/
    const structReg = /(\w+\.)?\w+(?=\s+\w+\s*=\s*\d+;)/

    let params: Param[] = []

    for (const line of message.split('\n')) {
        const fieldNameResult = fieldNameReg.exec(line)
        if (fieldNameResult === null) {
            continue
        }
        const name = fieldNameResult[0]
        let type: Type = StringType
        let result = mapReg.exec(line)
        if (result !== null) {
            type = readType(result[0])
        } else if ((result = listReg.exec(line)) !== null) {
            type = readType(result[0])
        } else {
            const structResult = structReg.exec(line)
            if (structResult === null) {
                continue
            }
            type = readBasicType(structResult?.[0])
        }
        params.push({
            name: name,
            type: type
        })
    }

    return new StructType(structName, params)
}

const readMethod = (method: string): MethodStub => {
    const methodNameReg = /(?<=rpc\s+)\w+/
    const methodName = methodNameReg.exec(method)?.[0] ?? ""
    const returnTypeReg = /(?<=returns\s*\(\s*)[\w.]+(?=\s*\)\s+{\s*})/
    const returnTypeStr = returnTypeReg.exec(method)?.[0] ?? ""
    const paramListReg = /(?<=\(\s*)[\w,\s.]+(?=\s*\)\s*returns)/
    const paramListStr = paramListReg.exec(method)?.[0] ?? ""

    const paramGapReg = /\s*,\s*/
    const params: Param[] = []
    let index = 0
    for (let part of paramListStr.split(paramGapReg)) {
        params.push({
            name: "p" + index,
            type: readBasicType(part)
        })
        index++
    }

    return new MethodStub(
        methodName,
        params,
        readBasicType(returnTypeStr)
    )
}

const readService = (service: string):Service => {
    const nameReg = /(?<=service\s*)\w+(?=\s*{)/
    const serviceName = nameReg.exec(service)?.[0] ?? ""

    const validMethodReg = /rpc[()\w.\s,]+{}/
    const methods: MethodStub[] = []
    for (let methodStr of service.split('\n')) {
        if (validMethodReg.exec(methodStr) !== null) {
            methods.push(readMethod(methodStr))
        }
    }
    return {
        name: serviceName,
        version: "0.1",
        methods: methods,
        dependencies: []
    }
}

const readFile = (str: string):FileResult => {
    const structs: StructType[] = []
    const services: Service[] = []
    const messageReg = /message\s+\w+\s*{[\w\t\n\s=;,.<>]*}/g
    const serviceReg = /service\s+\w+\s*{([\w\s\n\t().,]|{\s*})+}/g
    let result: RegExpExecArray | null = null
    do {
        result = messageReg.exec(str)
        if (result !== null) {
            structs.push(readMessage(result[0]))
        }
    } while (result !== null)

    result = null
    do {
        result = serviceReg.exec(str)
        if (result !== null) {
            services.push(readService(result[0]))
        }
    } while (result !== null)

    return {
        structs: structs,
        services: services
    }
}


const linkType = (type: Type, structsTable: Map<string, StructType>):Type => {
    if (type instanceof StructStubType) {
        return structsTable.get(type.name) ?? StringType
    } else if (type instanceof MapType) {
        return new MapType(type.keyType, linkType(type.valueType, structsTable))
    } else if (type instanceof ListType) {
        return new ListType(linkType(type.itemType, structsTable))
    }
    return type
}

const linkStructs = (structsTable: Map<string, StructType>) => {
    structsTable.forEach(s => {
        for (let param of s.params) {
            param.type = linkType(param.type, structsTable)
        }
    })
}

const linkServices = (structsTable: Map<string, StructType>, services: Map<string, Service>) => {
    services.forEach((service, name) => {
        const key = name.split('.')[0]
        service.methods.forEach(m => {
            m.params.forEach(p => {
                if (p.type instanceof StructStubType && p.type.name.split('.').length === 1) {
                    p.type.name = key + "." + p.type.name
                }
                p.type = linkType(p.type, structsTable)
            })
            if (m.returnParam instanceof StructStubType && m.returnParam.name.split('.').length === 1) {
                m.returnParam.name = key + "." + m.returnParam.name
            }
            m.returnParam = linkType(m.returnParam, structsTable)
        })
    })
}

const parse = (files: Map<string, string>):{
    services: Service[]
    structs: StructType[],
    methods: MethodStub[]
} => {
    const structsTable: Map<string, StructType> = new Map<string, StructType>()
    const services: Map<string, Service> = new Map<string, Service>()
    files.forEach((value, key) => {
        const result = readFile(value)
        for (let struct of result.structs) {
            structsTable.set(key + "." + struct.name, struct)
        }
        for (let service of result.services) {
            services.set(key + "." + service.name, service)
        }
    })
    linkStructs(structsTable)
    linkServices(structsTable, services)
    structsTable.forEach((s, k) => {
        s.name = k
    })
    services.forEach((s, k) => s.name = k)

    const serviceList: Service[] = []
    const structsList: StructType[] = []
    const methodList: MethodStub[] = []
    structsTable.forEach(s => structsList.push(s))
    services.forEach(s => serviceList.push(s))
    services.forEach(s => s.methods.forEach(m => methodList.push(m)))
    return {
        services: serviceList,
        methods: methodList,
        structs: structsList
    }
}

export {parse}
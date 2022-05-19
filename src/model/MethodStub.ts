
interface Type {
    getName(): string
}

type Param = {
    name: string,
    type: Type
}

class SimpleType implements Type {
    getName(): string {
        return this.type
    }
    constructor(
        public type: string
    ) {}
}

class ListType implements Type {
    constructor(
        public itemType: Type
    ) {}
    getName(): string {
        return "list<" + this.itemType.getName() + ">"
    }
}

class MapType implements Type {
    constructor(
        public keyType: Type,
        public valueType: Type
    ) {}
    getName(): string {
        return "map<" + this.keyType.getName() + ", " + this.valueType.getName() + ">"
    }
}

class StructType implements Type {
    constructor(
        public name: string,
        public params: Param[],
    ) {}
    getName(): string {
        return this.name
    }
}

class MethodStub {
    constructor(
        public name: string,
        public params: Param[],
        public returnParam: Type
    ) {}

    getExpression(): string {
        let result = this.returnParam.getName() + " " + this.name + "("
        let isFirst = true
        for (let param of this.params) {
            if (!isFirst) {
                result += ", "
            }
            result += param.name + ": " + param.type.getName()
            isFirst = false
        }
        result += ")"
        return result
    }
}

const StringType = new SimpleType("string")
const IntegerType = new SimpleType("integer")

export {MethodStub, SimpleType, ListType, MapType, StructType, StringType, IntegerType}
export type { Type, Param }

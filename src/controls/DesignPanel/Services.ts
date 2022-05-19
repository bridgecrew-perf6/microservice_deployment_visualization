import {Service} from "../../model/Service";
import {MethodStub, SimpleType} from "../../model/MethodStub";


const method1 = new MethodStub(
    "logIn",
    [],
    new SimpleType("string")
)

const method2 = new MethodStub(
    "signUp",
    [],
    new SimpleType("string")
)

const service1 = new Service(
    "account",
    "0.1",
    [method1, method2],
    []
)

const service2 = new Service(
    "dao",
    "0.1",
    [method1],
    [
        /*{service: service1, method: method1}*/
    ]
)

export {service1, service2}
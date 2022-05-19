import React from "react";
import {Param} from "../model/MethodStub";
import {Service} from "../model/Service";

export const ServicesContext =
    React.createContext<{
        services: Service[],
        setServices: (services: Service[]) => void
    }>({
        services: [],
        setServices: services => {}
    })
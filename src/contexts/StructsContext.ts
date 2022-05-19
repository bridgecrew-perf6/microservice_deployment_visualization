import React from "react";
import {Param, StructType, Type} from "../model/MethodStub";

export const StructsContext =
    React.createContext<{
        structs: StructType[],
        setStructs: (structs: StructType[]) => void
    }>({
        structs: [],
        setStructs: structs => {}
    })
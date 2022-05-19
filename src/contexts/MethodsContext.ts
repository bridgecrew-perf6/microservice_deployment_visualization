import React from "react";
import {MethodStub} from "../model/MethodStub";

export const MethodsContext =
    React.createContext<{
        methods: MethodStub[],
        setMethods: (methods: MethodStub[]) => void
    }>({
        methods: [],
        setMethods: methods => {}
    })
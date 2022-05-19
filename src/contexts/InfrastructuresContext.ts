import React from "react";
import {Infrastructure} from "../model/Infrastructure";

export const InfrastructuresContext =
    React.createContext<{
        infrastructures: Infrastructure[],
        setInfrastructures: (infrastructures: Infrastructure[]) => void
    }>({
        infrastructures: [],
        setInfrastructures: infrastructures => {}
    })
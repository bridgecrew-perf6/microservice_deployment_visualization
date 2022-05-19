import {Infrastructure} from "../../model/Infrastructure";
import {InfrastructureDeployment} from "../../model/Deployment";

interface InfrastructureNodeData {
    label: string,
    infrastructureDeployment: InfrastructureDeployment
}

const InfrastructureNode = (props: {data: InfrastructureNodeData}) => {
    const { label, infrastructureDeployment } = props.data
    return (
        <div>
            {label}
        </div>
    )
}

export type {InfrastructureNodeData}
export default InfrastructureNode
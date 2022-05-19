import {Handle, Position} from "react-flow-renderer";
import {Service} from "../../model/Service";
import styles from './index.module.css'
import {ServiceDeployment} from "../../model/Deployment";

interface ServiceNodeData {
    label: string,
    serviceDeployment: ServiceDeployment
}

const ServiceNode = (props: {data: ServiceNodeData}) => {
    const { label, serviceDeployment } = props.data
    const { name, version, service, count } = serviceDeployment
    const dependencyGapPercentage = 50 / service.dependencies.length
    const methodGapPercentage = 50 / service.methods.length
    console.log(methodGapPercentage)
    return (
        <div className={styles.container}>
            {
                service
                    .dependencies
                    .map((dependency, index) =>
                        <Handle
                            type={"source"}
                            position={Position.Bottom}
                            id={"" + index}
                            style={{left: "" + (2 * dependencyGapPercentage * index + dependencyGapPercentage) + "%"}}
                        /> )
            }
            <div>
                {label}
            </div>
            <div className={styles.version}>{service.version}</div>
            {
                service
                    .methods
                    .map((method, index) =>
                        <Handle
                            type={"target"}
                            position={Position.Top}
                            id={"" + index}
                            style={{left: "" + (2 * methodGapPercentage * index + methodGapPercentage) + "%"}}
                        />)
            }
        </div>
    )
}

export type {ServiceNodeData}
export default ServiceNode
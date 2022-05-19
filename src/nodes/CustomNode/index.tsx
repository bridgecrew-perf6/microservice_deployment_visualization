import {Handle, Position} from "react-flow-renderer";
import styles from './index.module.css'

interface NodeData {
    name?: string,
    label: string
}

const Index = (props: {data: NodeData}) => {
    const sources = [1, 2, 3, 4, 5]
    return (
        <div className={styles.container}>
            <Handle type={"target"} position={Position.Top}/>
            <div>Text:</div>
            <input/>

            <div>
                {
                    sources.map(index => <Handle type={"source"} position={Position.Bottom} id={"" + index} style={{left: "" + (20 * index - 10) + "%"}}/> )
                }
            </div>
        </div>
    )
}

export {Index};
export type { NodeData };

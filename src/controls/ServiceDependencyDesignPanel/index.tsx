import styles from "./index.module.css";
import ReactFlow, {
    applyEdgeChanges,
    applyNodeChanges,
    Edge,
    EdgeChange,
    FitViewOptions,
    Handle, MarkerType,
    Node,
    NodeChange,
    Position,
    ReactFlowInstance,
    ReactFlowProvider
} from "react-flow-renderer";
import {Service} from "../../model/Service";
import React, {useCallback, useContext, useMemo, useRef, useState} from "react";
import {ServicesContext} from "../../contexts/ServicesContext";
import {Infrastructure} from "../../model/Infrastructure";
import {InfrastructuresContext} from "../../contexts/InfrastructuresContext";
import {Link} from "react-router-dom";

interface EditableServiceNodeData {
    label: string,
    service: Service
}

interface EditableInfrastructureNodeData {
    label: string,
    infrastructure: Infrastructure
}

const EditableInfrastructureNode = (props: { data: EditableInfrastructureNodeData }) => {
    const {infrastructure} = props.data
    const {name, type} = infrastructure
    return (
        <div className={styles.infrastructureNodeContainer}>
            {
                type === 'messageQueue' ? <>
                    <Handle type={"source"} position={Position.Right}/>
                    <Handle type={"target"} position={Position.Left}/>
                </> : <>
                    <Handle type={"source"} position={Position.Bottom}/>
                    <Handle type={"target"} position={Position.Top}/>
                </>
            }

            <div>{name}<span className={styles.nodeVersion}>({type})</span></div>
            <Link to={"/update/infrastructure/" + name}>edit</Link>

        </div>
    )
}

const EditableServiceNode = (props: { data: EditableServiceNodeData }) => {
    const {service} = props.data
    const {name, version, methods, dependencies} = service
    const methodGapPercentage = 50 / service.methods.length
    const {services} = useContext(ServicesContext)

    return (
        <div className={styles.nodeContainer}>
            <Handle type={"source"} position={Position.Bottom}/>
            <Handle type={"target"} position={Position.Right} id={"k"}/>
            <div>
                {name} <span className={styles.nodeVersion}>{version}</span>
            </div>
            {
                dependencies.map((d, i) => <div key={"d_" + i}
                                                className={styles.nodeDependency}>{d.service}::{services.filter(s => s.name === d.service)[0].methods[d.method].name}</div>)
            }
            {
                methods
                    .map((method, index) =>
                        <Handle
                            type={"target"}
                            position={Position.Top}
                            id={"" + index}
                            style={{left: "" + (2 * methodGapPercentage * index + methodGapPercentage) + "%"}}
                        />)
            }
            <Link to={"/update/service/" + service.name + "/" + service.version}>edit</Link>
        </div>
    )
}

const fitViewOptions: FitViewOptions = {
    padding: 0.2
}

const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string, service: Service) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('service', service.name)
}


const Cell = (props: { service: Service }) => {
    const {service} = props
    const [draggable, setDraggable] = useState(true)
    return (
        <div className={styles.cell} onDragStart={e => {
            onDragStart(e, 'service', service)
            setDraggable(false)
        }} draggable={draggable}>
            {service.name}
        </div>
    )
}

const DragPanel = (props: { services: Service[] }) => {
    const {services} = props
    return (
        <div className={styles.trayContainer}>
            {
                services.map((s, index) => <Cell service={s} key={"cell_" + index}/>)
            }
        </div>
    )
}

let index = 0

const EditPanel = () => {
    const {services, setServices} = useContext(ServicesContext)
    const {infrastructures} = useContext(InfrastructuresContext)

    const reactFlowWrapper = useRef<null | HTMLParagraphElement>(null)
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
    const initialEdgeList: Edge[] = []
    const initialNodeList: Node<EditableServiceNodeData | EditableInfrastructureNodeData>[] = services.map((s, index) => {
        return {
            id: "node_" + index,
            type: "service",
            data: {
                label: "",
                service: s
            },
            position: {
                x: 100, y: 100 * index
            }
        }
    })
    infrastructures.forEach((ins, index) => {
        initialNodeList.push({
            id: "node_ins_" + index,
            type: "infrastructure",
            data: {
                label: "",
                infrastructure: ins
            },
            position: {
                x: 400, y: 100 * index
            }
        })
        ins.dependencies.forEach((d, i) => {
            const serviceIndex = services.findIndex(s => s.name === d.service)
            initialEdgeList.push({
                id: "ins_node_" + i,
                source: "node_ins_" + index,
                target: "node_" + serviceIndex,
                targetHandle: "k",
                label: "",
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                }
            })
        })
    })
    services.forEach((s, index) => {
        s.dependencies.forEach((d, i) => {
            const fromIndex = index
            const toIndex = services.findIndex(s => s.name === d.service)
            const edge = {
                id: "edge_" + fromIndex + "_" + toIndex + "_" + d.method,
                source: "node_" + fromIndex,
                target: "node_" + toIndex,
                label: "",
                targetHandle: "" + i,
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                }
            }
            initialEdgeList.push(edge)
        })
        s.infrastructureDependencies?.map((d, i) => {
            const fromIndex = index
            const toIndex = infrastructures.findIndex(ins => ins.name === d.infrastructure)
            const edge = {
                id: "edge_i_" + fromIndex + "_" + toIndex,
                source: "node_" + fromIndex,
                target: "node_ins_" + toIndex,
                label: "",
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                }
            }
            initialEdgeList.push(edge)
        })
    })

    const [nodes, setNodes] = useState<Node<EditableServiceNodeData | EditableInfrastructureNodeData>[]>(initialNodeList);
    const [edges, setEdges] = useState<Edge[]>(initialEdgeList);

    const nodeTypes = useMemo(() => ({
        service: EditableServiceNode,
        infrastructure: EditableInfrastructureNode
    }), [])

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [setNodes]
    );
    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [setEdges]
    );


    return (
        <div className={styles.container}>
            <ReactFlowProvider>
                <div className={styles.topContainer}>
                    <div ref={reactFlowWrapper} className={styles.mainPanel}>
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            nodeTypes={nodeTypes}
                            fitView
                            fitViewOptions={fitViewOptions}
                            onInit={setReactFlowInstance}
                            onSelectionChange={({nodes, edges}) => {
                            }}
                        />
                    </div>
                </div>
                <DragPanel services={services}/>
            </ReactFlowProvider>
        </div>

    )
}

export {EditableServiceNode, EditPanel}
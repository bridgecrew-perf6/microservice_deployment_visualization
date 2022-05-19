import React, {useCallback, useMemo, useRef, useState} from 'react';
import ReactFlow, {
    addEdge,
    FitViewOptions,
    applyNodeChanges,
    applyEdgeChanges,
    Node,
    Edge,
    NodeChange,
    EdgeChange,
    Connection, ReactFlowInstance, ReactFlowProvider
} from 'react-flow-renderer';
import {Index, NodeData} from "../../nodes/CustomNode";
import styles from './index.module.css'
import DragPanel from "../DragPanel";
import PropertyEditingPanel from "../PropertyEditingPanel";
import ServiceNode, {ServiceNodeData} from "../../nodes/ServiceNode";
import InfrastructureNode, {InfrastructureNodeData} from "../../nodes/InfrastructureNode";


const initialNodes: Node<NodeData | ServiceNodeData | InfrastructureNodeData>[] = [
    { id: '1', data: { label: 'male1', name: "Penis" }, position: { x: 200, y: 0 }, type: "custom" },
    { id: '3', data: { label: 'female2' }, position: { x: 200, y: 100} },
    { id: '4', data: { label: 'female3' }, position: { x: 400, y: 100} },
];

const initialEdges: Edge[] = [
    { id: 'e1-3', source: '1', target: '3'},
    { id: 'e2-3', source: '1', target: '4'},
];

const fitViewOptions: FitViewOptions = {
    padding: 0.2
}

let id = 0;
const getId = () => `node_${id++}`;

const DesignPanel = () => {
    const reactFlowWrapper = useRef<null | HTMLParagraphElement>(null)
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

    const onDragOver = useCallback(event => {
        event.preventDefault()
        event.dataTransfer.dropEffect = 'move'
    }, [])

    const onDrop = useCallback(event => {
        event.preventDefault()
        if (reactFlowWrapper == null || reactFlowWrapper.current == null || reactFlowInstance == null) {
            return
        }
        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
        const type = event.dataTransfer.getData('application/reactflow');
        const name = event.dataTransfer.getData('name')

        if (typeof type === 'undefined' || !type) {
            return;
        }
        const position = reactFlowInstance.project({
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
        });

        const newNode = {
            id: getId(),
            type,
            data: { label: name },
            position
        }

        setNodes(nds => nds.concat(newNode))

    }, [reactFlowInstance])

    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>(initialEdges);

    const nodeTypes = useMemo(() => ({
        custom: Index,
        service: ServiceNode,
        infrastructure: InfrastructureNode
    }), [])

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [setNodes]
    );
    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [setEdges]
    );
    const onConnect = useCallback(
        (connection: Connection) => setEdges((eds) => {
            console.log(connection);
            return addEdge(connection, eds)
        }),
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
                            onConnect={onConnect}
                            nodeTypes={nodeTypes}
                            fitView
                            fitViewOptions={fitViewOptions}
                            onInit={setReactFlowInstance}
                            onDrop={onDrop}
                            onDragOver={onDragOver}
                            onSelectionChange={({nodes, edges}) => {
                                console.log(nodes)
                                console.log(edges)
                            }}
                        />
                    </div>
                    <PropertyEditingPanel />
                </div>
                <DragPanel/>
                <DragPanel/>
            </ReactFlowProvider>
        </div>

    )
}

export default DesignPanel
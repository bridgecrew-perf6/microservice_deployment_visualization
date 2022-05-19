import React, {DragEventHandler} from "react";
import styles from './index.module.css'

const onDragStart = (event:  React.DragEvent<HTMLDivElement>, nodeType: string, name: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('name', name)
}

const Cell = (props: {name: string}) => {
    const {name} = props
    return (
        <div className={styles.cell} onDragStart={e => onDragStart(e, 'default', name)} draggable={true}>
            {name}
        </div>
    )
}

const DragPanel = () => {


    return (
        <div className={styles.container}>
            <Cell name={"Dick"}/>
            <Cell name={"Fuck"}/>
            <Cell name={"Penis"}/>
            <Cell name={"Bitch"}/>
        </div>
    )
}

export default DragPanel
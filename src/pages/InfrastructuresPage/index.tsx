import {Button, Divider} from "antd";
import {useContext} from "react";
import {InfrastructuresContext} from "../../contexts/InfrastructuresContext";
import {Infrastructure} from "../../model/Infrastructure";
import styles from './index.module.css'
import commonStyles from "../common/index.module.css";
import {Link, useNavigate} from "react-router-dom";

const InfrastructureCell = (props: { infrastructure: Infrastructure }) => {
    const {type, name, dependencies, interfaces} = props.infrastructure
    return (
        <div className={styles.infrastructureCell}>
            <div className={styles.infrastructureName}>
                {name}
            </div>
            <div>
                {
                    dependencies.length === 0 ? <></> : <>
                        <div style={{textAlign: 'center'}}>dependent</div>
                        {
                            dependencies.map(d => <div>{d.service}</div>)
                        }</>
                }
            </div>
            <Link to={"/update/infrastructure/" + name}>edit</Link>
        </div>
    )
}

const InfrastructuresPage = () => {
    const {infrastructures, setInfrastructures} = useContext(InfrastructuresContext)
    const databases = infrastructures.filter(i => i.type === 'database')
    const messageQueues = infrastructures.filter(i => i.type === 'messageQueue')
    const redis = infrastructures.filter(i => i.type === 'redis')

    const navigate = useNavigate()
    return (
        <div>
            <Divider orientation="center">database</Divider>
            <div className={commonStyles.tube}>
                {
                    databases.map((s, index) => <InfrastructureCell infrastructure={s} key={"database_" + index}/>)
                }
            </div>
            <Divider orientation="center">message queue</Divider>
            <div className={commonStyles.tube}>
                {
                    messageQueues.map((s, index) => <InfrastructureCell infrastructure={s} key={"database_" + index}/>)
                }
            </div>
            <Divider orientation="center">redis</Divider>
            <div className={commonStyles.tube}>
                {
                    redis.map((s, index) => <InfrastructureCell infrastructure={s} key={"database_" + index}/>)
                }
            </div>
            <Button block={true} onClick={() => navigate("/create/infrastructure")}>create new infrastructure</Button>
        </div>
    )
}

export default InfrastructuresPage
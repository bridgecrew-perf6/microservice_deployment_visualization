import {MethodStub, StructType} from "../../model/MethodStub";
import {Service} from "../../model/Service";
import styles from './index.module.css'
import commonStyles from '../common/index.module.css'
import {useContext} from "react";
import {StructsContext} from "../../contexts/StructsContext";
import {Link, useNavigate} from "react-router-dom";
import {MethodsContext} from "../../contexts/MethodsContext";
import {ServicesContext} from "../../contexts/ServicesContext";
import {Button, Divider, Upload} from "antd";
import {loadFromJson, save} from "../../utils/JsonLoader";


const StructCell = (props: { struct: StructType }) => {
    const {name, params} = props.struct
    return (
        <div className={styles.structCell}>
            <div className={styles.structName}>
                {name}
            </div>
            <div className={styles.structFieldsContainer}>
                {
                    params.map((p, index) => <>
                        <div className={styles.paramName}>{p.name}:</div>
                        <div className={styles.paramType}>{p.type.getName()}</div>
                    </>)
                }
            </div>

        </div>
    )
}

const MethodCell = (props: { method: MethodStub }) => {
    const {name, params, returnParam} = props.method
    return (
        <div className={styles.methodCell}>
            <div className={styles.methodName}>
                {name}
            </div>
            <div className={styles.methodHeader}>params</div>
            {
                params.map((p, index) => <div key={"param_" + index}><span
                    className={styles.paramName}>{p.name}</span>: <span
                    className={styles.paramType}>{p.type.getName()}</span></div>)
            }
            <div>return: <span className={styles.paramType}>{returnParam.getName()}</span></div>
        </div>
    )
}

const ServiceCell = (props: { service: Service }) => {
    const {name, version, methods, dependencies, infrastructureDependencies} = props.service
    const {services} = useContext(ServicesContext)

    return (
        <div className={styles.serviceCell}>
            <div className={styles.serviceName}>
                {name}
            </div>
            <div className={styles.serviceVersion}>
                {version}
            </div>
            <div className={styles.methodHeader}>methods</div>
            {
                methods.map((m, index) => <div key={"method_" + index}>{m.getExpression()}</div>)
            }
            <div className={styles.methodHeader}>dependencies</div>
            {
                dependencies.map((d, index) => <div
                    key={"dependency_" + index}>{d.service}: {services.filter(s => s.name === d.service)[0].methods[d.method].name}</div>)
            }
            <div className={styles.methodHeader}>infrastructure dependencies</div>
            {
                infrastructureDependencies?.map((d, index) => <div key={"di_" + index}>{d.infrastructure}</div>)
            }
            <Link to={"/update/service/" + name + "/" + version}>edit</Link>
        </div>
    )
}

export default () => {
    const {structs, setStructs} = useContext(StructsContext)
    const {methods, setMethods} = useContext(MethodsContext)
    const {services, setServices} = useContext(ServicesContext)
    const navigate = useNavigate()

    return (
        <div>
            <Divider orientation="center">Structs</Divider>
            <div className={commonStyles.tube}>
                {
                    structs.map((s, index) => <StructCell struct={s} key={"struct_" + index}/>)
                }
                <div className={styles.structCell} onClick={() => navigate("/create/struct")}>+</div>
            </div>
            <Divider orientation="center">Methods</Divider>
            <div className={commonStyles.tube}>
                {
                    methods.map((m, index) => <MethodCell method={m} key={"method_" + index}/>)
                }
                <div className={styles.methodCell} onClick={() => navigate("/create/method")}>+</div>
            </div>
            <Divider orientation="center">Services</Divider>
            <div className={commonStyles.tube}>
                {
                    services.map((s, index) => <ServiceCell service={s} key={"service_" + index}/>)
                }
                <div className={styles.serviceCell} onClick={() => navigate("/create/service")}>+</div>
            </div>
            <Button block={true} type={"primary"} onClick={() => navigate("/design/dependencies")}>edit
                dependencies</Button>
            <Divider orientation="center">
                <a download={"a.json"} href={URL.createObjectURL(new Blob([save(structs, services)]))}>save to file</a>
            </Divider>
            {/*<Upload onChange={file => {

                const reader = new FileReader()
                if (file.file.originFileObj !== undefined) {
                    reader.readAsText(file.file.originFileObj)
                    reader.onload = () => {
                        if (typeof reader.result === 'string') {
                            const result = loadFromJson(reader.result)
                            console.log(result)
                            setServices(result.services)
                            setStructs(result.structs)
                            setMethods([])
                        } else if (reader.result !== null) {
                            console.log((new TextDecoder("utf-8")).decode(reader.result))
                        } else {
                            console.log("DIck")
                        }
                    }


                }
            }}>
                <Button>Click to Upload</Button>
            </Upload>*/}

        </div>
    )
}
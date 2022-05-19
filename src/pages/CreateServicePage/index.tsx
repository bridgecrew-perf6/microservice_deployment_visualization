import {useContext, useState} from "react";
import {MethodStub} from "../../model/MethodStub";
import {useNavigate} from "react-router-dom";
import {Button, Form, Input, List, Select} from "antd";
import {ServicesContext} from "../../contexts/ServicesContext";
import {DependencyStub, Service} from "../../model/Service";
import {MethodsContext} from "../../contexts/MethodsContext";
import {Infrastructure, InfrastructureDependency} from "../../model/Infrastructure";
import {InfrastructuresContext} from "../../contexts/InfrastructuresContext";


export default () => {
    const {methods} = useContext(MethodsContext)
    const {services, setServices} = useContext(ServicesContext)
    const {infrastructures} = useContext(InfrastructuresContext)
    const [name, setName] = useState('')
    const [version, setVersion] = useState('')

    const navigate = useNavigate()
    const [serviceMethods, setServiceMethods] = useState<MethodStub[]>([])
    const [serviceDependencies, setServiceDependencies] = useState<DependencyStub[]>([])
    const [newMethodIndex, setNewMethodIndex] = useState(0)

    const [dependencyServiceIndex, setDependencyServiceIndex] = useState(0)
    const [dependencyMethodIndex, setDependencyMethodIndex] = useState(0)

    const [dependentInfrastructures, setDependentInfrastructures] = useState<Infrastructure[]>([])
    const [newDependentInfrastructureIndex, setNewDependentInfrastructureIndex] = useState(0)

    const addNewMethod = () => {
        const method = methods[newMethodIndex]
        if (serviceMethods.filter(m => m === method).length > 0) {
            alert("duplicated method")
        } else {
            const newServiceMethods: MethodStub[] = [...serviceMethods, method]
            setServiceMethods(newServiceMethods)
        }
    }

    const addNewDependency = () => {
        const service = services[dependencyServiceIndex]
        const method = services[dependencyServiceIndex].methods[dependencyMethodIndex]
        const cnt = serviceDependencies.filter(d => d.service === service.name && d.method === dependencyMethodIndex).length
        if (cnt === 0) {
            const newDependencies: DependencyStub[] = [...serviceDependencies, {
                service: service.name,
                method: dependencyMethodIndex
            }]
            setServiceDependencies(newDependencies)
        } else {
            alert("duplicated dependency")
        }
    }

    const addService = () => {
        if (name === "" || version === "" || methods.length === 0) {
            alert("no methods or name or version")
        } else {
            const newServices: Service[] = [...services, new Service(name, version, serviceMethods, serviceDependencies)]
            setServices(newServices)
            navigate("/services")
        }
    }

    const deleteMethod = (method: MethodStub) => {
        const index = serviceMethods.indexOf(method)
        if (index === -1) {
            return
        }
        const newServiceMethods: MethodStub[] = [...serviceMethods.slice(0, index), ...serviceMethods.slice(index + 1, serviceMethods.length)]
        setServiceMethods(newServiceMethods)
    }

    const deleteDependency = (dependency: DependencyStub) => {
        const index = serviceDependencies.indexOf(dependency)
        if (index === -1) {
            return
        }
        const newServiceDependencies: DependencyStub[] =
            [...serviceDependencies.slice(0, index), ...serviceDependencies.slice(index + 1, serviceDependencies.length)]
        setServiceDependencies(newServiceDependencies)
    }

    const deletedDependentInfrastructure = (infrastructure: Infrastructure) => {
        const index = dependentInfrastructures.indexOf(infrastructure)
        if (index === -1) {
            return
        }
        const newList: Infrastructure[] = [...dependentInfrastructures.slice(0, index), ...dependentInfrastructures.slice(index + 1)]
        setDependentInfrastructures(newList)
    }

    const addNewDependentInfrastructure = () => {
        const ins = infrastructures[newDependentInfrastructureIndex]
        if (dependentInfrastructures.indexOf(ins) !== -1) {
            alert("repeated add")
            return
        }
        const newList = [...dependentInfrastructures, ins]
        setDependentInfrastructures(newList)
    }

    return (
        <Form
            name="basic"
            labelCol={{span: 4}}
            wrapperCol={{span: 16}}
            initialValues={{remember: true}}
            autoComplete="off"
        >
            <Form.Item
                label="name"
            >
                <Input value={name} onChange={e => setName(e.target.value)}/>
            </Form.Item>

            <Form.Item
                label="version"
            >
                <Input value={version} onChange={e => setVersion(e.target.value)}/>
            </Form.Item>

            <Form.Item label={"methods"}>
                <List
                    bordered
                    dataSource={serviceMethods}
                    renderItem={(item, index) => (
                        <List.Item>
                            <Button onClick={() => deleteMethod(item)}>delete</Button> {item.getExpression()}
                        </List.Item>
                    )}
                />
            </Form.Item>

            <Form.Item
                label="new method"
            >
                <Select defaultValue={newMethodIndex} onChange={value => setNewMethodIndex(value)}>
                    {
                        methods.map((m, index) =>
                            <Select.Option key={"method_" + index} value={index}>{m.getExpression()}</Select.Option>
                        )
                    }
                </Select>
            </Form.Item>

            <Form.Item wrapperCol={{offset: 8, span: 16}}>
                <Button type="primary" onClick={e => addNewMethod()}>
                    add new method
                </Button>
            </Form.Item>

            <Form.Item label={"dependencies"}>
                <List
                    bordered
                    dataSource={serviceDependencies}
                    renderItem={(item, index) => (
                        <List.Item>
                            <Button
                                onClick={() => deleteDependency(item)}>delete</Button> {item.service}.{services.filter(s => s.name === item.service)[0].methods[item.method].name}
                        </List.Item>
                    )}
                />
            </Form.Item>

            <Form.Item
                label="dependency service"
            >
                <Select defaultValue={0} onChange={value => setDependencyServiceIndex(value)}>
                    {
                        services.map((s, index) =>
                            <Select.Option key={"dependency_service_" + index}
                                           value={index}>{s.name}({s.version})</Select.Option>
                        )
                    }
                </Select>
            </Form.Item>

            <Form.Item
                label="dependency method"
            >
                <Select defaultValue={0} onChange={value => setDependencyMethodIndex(value)}>
                    {
                        services[dependencyServiceIndex].methods.map((m, index) =>
                            <Select.Option key={"dependency_method_" + index}
                                           value={index}>{m.getExpression()}</Select.Option>
                        )
                    }
                </Select>
            </Form.Item>

            <Form.Item wrapperCol={{offset: 8, span: 16}}>
                <Button type="primary" onClick={e => addNewDependency()}>
                    add new dependency
                </Button>
            </Form.Item>

            <Form.Item label={"infrastructures"}>
                <List
                    bordered
                    dataSource={dependentInfrastructures}
                    renderItem={(item, index) => (
                        <List.Item key={"di_" + index}>
                            <Button onClick={() => deletedDependentInfrastructure(item)}>delete</Button> {item.name}
                        </List.Item>
                    )}
                />
            </Form.Item>

            <Form.Item
                label="dependent infrastructures"
            >
                <Select defaultValue={0} onChange={value => setNewDependentInfrastructureIndex(value)}>
                    {
                        infrastructures.map((i, index) =>
                            <Select.Option key={"dependency_infrastructure_" + index}
                                           value={index}>{i.type}: {i.name}</Select.Option>
                        )
                    }
                </Select>
            </Form.Item>

            <Form.Item wrapperCol={{offset: 8, span: 16}}>
                <Button type="primary" onClick={addNewDependentInfrastructure}>
                    add new dependent infrastructure
                </Button>
            </Form.Item>

            <Form.Item wrapperCol={{offset: 8, span: 16}}>
                <Button type="primary" onClick={() => addService()}>
                    ok
                </Button>
            </Form.Item>
        </Form>
    )
}
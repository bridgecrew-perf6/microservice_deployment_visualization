import {useNavigate, useParams} from "react-router-dom";
import {useContext, useState} from "react";
import {InfrastructuresContext} from "../../contexts/InfrastructuresContext";
import {Button, Form, Input, List, Select, Tabs, Typography} from "antd";
import {ServicesContext} from "../../contexts/ServicesContext";
import {Service} from "../../model/Service";
import {Infrastructure, InfrastructureType} from "../../model/Infrastructure";
const {TabPane} = Tabs;

const UpdateInfrastructurePage = () => {
    const {name} = useParams<{name: string}>()
    const {infrastructures, setInfrastructures} = useContext(InfrastructuresContext)
    const {services} = useContext(ServicesContext)
    const navigate = useNavigate()

    const infrastructure = infrastructures.filter(s => s.name === name)[0]
    let initialTypeIndex = infrastructure.type === 'database' ? "1" : infrastructure.type === 'messageQueue' ? "2" : "3"
    const [typeKey, setTypeKey] = useState(initialTypeIndex)
    const [dependentServiceIndex, setDependentServiceIndex] = useState(0)
    const [dependentServices, setDependentServices] = useState<Service[]>(infrastructure.dependencies.map(d => services.filter(s => s.name === d.service)[0]))

    const addDependentService = () => {
        const service = services[dependentServiceIndex]
        if (dependentServices.indexOf(service) !== -1) {
            alert("already present")
            return
        }
        const newList = [...dependentServices, service]
        setDependentServices(newList)
    }

    const updateInfrastructure = () => {
        let type: InfrastructureType = 'database'
        if (typeKey === "2") {
            type = 'messageQueue'
        } else if (typeKey === "3") {
            type = 'redis'
        }
        let newInfrastructure: Infrastructure | null = null
        if (type === 'messageQueue') {
            newInfrastructure = new Infrastructure(type, name ?? "", dependentServices.map(d => {return {service: d.name}}), [{name: 'input'}])
        } else {
            newInfrastructure = new Infrastructure(type, name ?? "", [], [{name: 'input'}])
        }
        const index = infrastructures.findIndex(ins => ins.name === name)
        if (index !== -1 && newInfrastructure !== null) {
            const newList: Infrastructure[] = [...infrastructures.slice(0, index), newInfrastructure, ...infrastructures.slice(index + 1)]
            setInfrastructures(newList)
            navigate("/infrastructures")
        }
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
                <Input value={name} disabled={true}/>
            </Form.Item>

            <Form.Item label={"type"}>
                <Tabs defaultActiveKey={typeKey} centered onChange={key => setTypeKey(key)}>
                    <TabPane tab="database" key="1">
                    </TabPane>
                    <TabPane tab="message queue" key="2">
                        <Form labelCol={{span: 4}}
                              wrapperCol={{span: 16}}>
                            <Form.Item label={"current input services"}>
                                <List
                                    bordered
                                    dataSource={dependentServices}
                                    renderItem={item => (
                                        <List.Item>
                                            <Typography.Text mark>{item.name}</Typography.Text>
                                        </List.Item>
                                    )}
                                />
                            </Form.Item>
                            <Form.Item label={"new input service"}>
                                <Select defaultValue={dependentServiceIndex}
                                        onChange={value => setDependentServiceIndex(value)}>
                                    {
                                        services.map((s, index) => <Select.Option key={"d_" + index}
                                                                                  value={index}>{s.name}</Select.Option>)
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item label={" "}>
                                <Button block={true} onClick={addDependentService}>add</Button>
                            </Form.Item>
                        </Form>
                    </TabPane>
                    <TabPane tab="redis" key="3">
                    </TabPane>
                </Tabs>
            </Form.Item>

            <Form.Item wrapperCol={{offset: 8, span: 16}}>
                <Button htmlType="button" type="primary" onClick={updateInfrastructure}>
                    update
                </Button>
            </Form.Item>
        </Form>
    )
}

export default UpdateInfrastructurePage
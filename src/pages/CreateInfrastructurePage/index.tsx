import {Form, Input, Button, List, Select, Typography, Tabs} from 'antd';
import {useContext, useState} from "react";
import {ServicesContext} from "../../contexts/ServicesContext";
import {Service} from "../../model/Service";
import {useNavigate} from "react-router-dom";
import {Infrastructure, InfrastructureType} from "../../model/Infrastructure";
import {InfrastructuresContext} from "../../contexts/InfrastructuresContext";

const {TabPane} = Tabs;

const CreateInfrastructurePage = () => {
    const [name, setName] = useState('')
    const [typeKey, setTypeKey] = useState("1")
    const navigate = useNavigate()
    const {services} = useContext(ServicesContext)
    const [dependentServiceIndex, setDependentServiceIndex] = useState(0)
    const [dependentServices, setDependentServices] = useState<Service[]>([])
    const {infrastructures, setInfrastructures} = useContext(InfrastructuresContext)
    const createInfrastructure = () => {
        if (name.length === 0) {
            return
        }
        let type: InfrastructureType = 'database'
        if (typeKey === "2") {
            type = 'messageQueue'
        } else if (typeKey === "3") {
            type = 'redis'
        }
        let infrastructure: Infrastructure | null = null
        if (type === 'messageQueue') {
            infrastructure = new Infrastructure(type, name, dependentServices.map(d => {return {service: d.name}}), [{name: 'input'}])
        } else {
            infrastructure = new Infrastructure(type, name, [], [{name: 'input'}])
        }
        if (infrastructure !== null) {
            const newList: Infrastructure[] = [...infrastructures, infrastructure]
            setInfrastructures(newList)
            navigate("/infrastructures")
        }
    }
    const addDependentService = () => {
        const service = services[dependentServiceIndex]
        if (dependentServices.indexOf(service) !== -1) {
            alert("already present")
            return
        }
        const newList = [...dependentServices, service]
        setDependentServices(newList)
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
                <Button htmlType="button" type="primary" onClick={createInfrastructure}>
                    ok
                </Button>
            </Form.Item>
        </Form>
    )
}

export default CreateInfrastructurePage
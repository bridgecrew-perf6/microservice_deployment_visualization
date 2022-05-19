import {Form, Input, Button, List, Select, Typography, Tabs, Space} from 'antd';
import {useContext, useState} from "react";
import {IntegerType, ListType, MapType, Param, StringType, StructType, Type} from "../../model/MethodStub";
import {StructsContext} from "../../contexts/StructsContext";
import {useNavigate} from "react-router-dom";
const { TabPane } = Tabs;


export default () => {
    const { structs, setStructs } = useContext(StructsContext)
    const [name, setName] = useState('')
    const [params, setParams] = useState<Param[]>([])
    const [newParamName, setNewParamName] = useState('')
    const [newParamTypeIndex, setNewParamTypeIndex] = useState(0)
    const navigate = useNavigate()

    const [keyParamTypeIndex, setKeyParamTypeIndex] = useState(0)
    const [valueParamTypeIndex, setValueParamTypeIndex] = useState(0)
    const [paramTypeKey, setParamTypeKey] = useState("1")


    const addNewParam = () => {
        let type: Type = StringType
        if (paramTypeKey === "1") {
            type = types[newParamTypeIndex]
        } else if (paramTypeKey === "2") {
            type = new ListType(types[newParamTypeIndex])
        } else {
            type = new MapType(types[keyParamTypeIndex], types[valueParamTypeIndex])
        }
        const newParams: Param[] = [...params, {name: newParamName, type: type}]
        setParams(newParams)
    }

    const addStruct = () => {
        const newStructs: StructType[] = [...structs, new StructType(name, params)]
        setStructs(newStructs)
        navigate("/services")
    }

    const types: Type[] = [StringType, IntegerType, ...structs]


    return (
        <Form
            name="basic"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            autoComplete="off"
        >
            <Form.Item
                label="name"
            >
                <Input value={name} onChange={e => setName(e.target.value)}/>
            </Form.Item>

            <Form.Item label={"params"}>
                <List
                    bordered
                    dataSource={params}
                    renderItem={item => (
                        <List.Item>
                            <Typography.Text mark>{item.type.getName()}</Typography.Text> {item.name}
                        </List.Item>
                    )}
                />
            </Form.Item>

            <Form.Item
                label="param name"
            >
                <Input value={newParamName} onChange={e => setNewParamName(e.target.value)}/>
            </Form.Item>


            <Form.Item label={"param type"}>
                <Tabs defaultActiveKey={paramTypeKey} centered onChange={key => setParamTypeKey(key)}>
                    <TabPane tab="raw" key="1">
                        <Select defaultValue={newParamTypeIndex} onChange={value => setNewParamTypeIndex(value)}>
                            {
                                types.map((s, index) =>
                                    <Select.Option key={"s_" + index} value={index}>{s.getName()}</Select.Option>)
                            }
                        </Select>
                    </TabPane>
                    <TabPane tab="list" key="2">
                        <Select defaultValue={newParamTypeIndex} onChange={value => setNewParamTypeIndex(value)}>
                            {
                                types.map((s, index) =>
                                    <Select.Option key={"s_" + index} value={index}>{s.getName()}</Select.Option>)
                            }
                        </Select>
                    </TabPane>
                    <TabPane tab="map" key="3">
                        <Space>
                            Key type:
                            <Select defaultValue={keyParamTypeIndex} onChange={value => setKeyParamTypeIndex(value)} >
                                {
                                    types.map((s, index) =>
                                        <Select.Option key={"s_" + index} value={index}>{s.getName()}</Select.Option>)
                                }
                            </Select>
                            Value type:
                            <Select defaultValue={valueParamTypeIndex} onChange={value => setValueParamTypeIndex(value)}>
                                {
                                    types.map((s, index) =>
                                        <Select.Option key={"s_" + index} value={index}>{s.getName()}</Select.Option>)
                                }
                            </Select>
                        </Space>

                    </TabPane>
                </Tabs>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" onClick={() => addNewParam()}>
                    add new param
                </Button>
                <Button htmlType="button" type="primary" style={{marginLeft: '8px'}} onClick={() => addStruct()}>
                    ok
                </Button>
            </Form.Item>
        </Form>
    )
}
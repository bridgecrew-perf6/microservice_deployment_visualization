import {useContext, useState} from "react";
import {StructsContext} from "../../contexts/StructsContext";
import {IntegerType, MethodStub, Param, StringType, StructType, Type} from "../../model/MethodStub";
import {useNavigate} from "react-router-dom";
import {Button, Form, Input, List, Select, Typography} from "antd";
import {MethodsContext} from "../../contexts/MethodsContext";


export default () => {
    const { structs, setStructs } = useContext(StructsContext)
    const { methods, setMethods } = useContext(MethodsContext)
    const [name, setName] = useState('')
    const [params, setParams] = useState<Param[]>([])

    const [newParamName, setNewParamName] = useState('')
    const [newParamTypeIndex, setNewParamTypeIndex] = useState(0)
    const [returnTypeIndex, setReturnTypeIndex] = useState(0)
    const navigate = useNavigate()

    const addNewParam = (name: string, type: Type) => {
        const newParams: Param[] = [...params, {name: name, type: type}]
        setParams(newParams)
    }

    const addMethod = () => {
        if (name !== "") {
            const newMethods: MethodStub[] = [...methods, new MethodStub(name, params, types[returnTypeIndex])]
            setMethods(newMethods)
            navigate("/services")
        } else {
            alert("name is empty")
        }
    }

    const types: Type[] = [StringType, IntegerType, ...structs]

    return (
        <Form
            name="basic"
            labelCol={{ span: 8 }}
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

            <Form.Item
                label="param type"
            >
                <Select defaultValue={newParamTypeIndex} onChange={value => setNewParamTypeIndex(value)}>
                    {
                        types.map((s, index) =>
                            <Select.Option key={"s_" + index} value={index}>{s.getName()}</Select.Option>)
                    }
                </Select>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" onClick={() => addNewParam(newParamName, types[newParamTypeIndex])}>
                    add new param
                </Button>
            </Form.Item>

            <Form.Item
                label="return type"
            >
                <Select defaultValue={returnTypeIndex} onChange={value => setReturnTypeIndex(value)}>
                    {
                        types.map((s, index) =>
                            <Select.Option key={"s_" + index} value={index}>{s.getName()}</Select.Option>)
                    }
                </Select>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button htmlType="button" type="primary" onClick={() => addMethod()}>
                    ok
                </Button>
            </Form.Item>
        </Form>
    )
}
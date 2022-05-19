import { Form, Input, Button, Checkbox } from 'antd';
import styles from './index.module.css'

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const PropertyEditingPanel = (props: {
    name?: string,
    setName?: (name: string) => void
}) => {

    return (
        <Form className={styles.container} {...layout}>
            <Form.Item
                label="name"
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="service"
            >
                <Input />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
                <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    )
}

export default PropertyEditingPanel
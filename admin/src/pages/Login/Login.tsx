import { useStore } from '@nanostores/react';
import { Button, Form, Input, notification } from 'antd';
import { $login } from '../../stores/auth';
import type { iLogin } from '../../types';

export function LoginPage() {
  const { mutate } = useStore($login);

  async function onFinish(data: iLogin) {
    try {
      const resp = (await mutate(data)) as Response;

      if (resp.ok) return;

      const respData = await resp.json();

      if ('error' in respData && typeof respData.error === 'string') {
        return notification.error({ message: respData.error });
      }

      throw respData;
    } catch (e) {
      console.error(e);
      notification.error({ message: 'Unexpected error' });
    }
  }

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item<iLogin>
        label="Name"
        name="name"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<iLogin>
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Login
        </Button>
      </Form.Item>
    </Form>
  );
}

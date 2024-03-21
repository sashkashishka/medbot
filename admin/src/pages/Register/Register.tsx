import { useStore } from '@nanostores/react';
import { Button, Form, Input } from 'antd';
import toast from 'react-hot-toast';
import { $register } from '../../stores/auth';
import type { iRegister } from '../../types';

export function RegisterPage() {
  const { mutate } = useStore($register);

  async function onFinish(data: iRegister) {
    try {
      const resp = (await mutate(data)) as Response;

      if (resp.ok) return;

      const respData = await resp.json();

      if ('error' in respData && typeof respData.error === 'string') {
        return toast.error(respData.error);
      }

      throw respData;
    } catch (e) {
      console.error(e);
      toast.error('Unexpected error');
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
      <Form.Item<iRegister>
        label="Name"
        name="name"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<iRegister>
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Register
        </Button>
      </Form.Item>
    </Form>
  );
}

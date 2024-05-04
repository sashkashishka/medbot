import { Form, Input } from 'antd';

interface iProps {
  editing: boolean;
  name: string;
  value: string;
}
export function EditableCell({ editing, value, name }: iProps) {
  if (!editing) return value || '-';

  return (
    <Form.Item name={name} noStyle>
      <Input.TextArea rows={6} size="large" />
    </Form.Item>
  );
}

import { useStore } from '@nanostores/react';
import {
  Button,
  Flex,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Typography,
  notification,
} from 'antd';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import type { iProduct } from '../../types';
import {
  $createProduct,
  $deleteProduct,
  $editProduct,
  $products,
} from '../../stores/product';
import { ROUTES } from '../../constants/routes';

export function ProductPage() {
  const params = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const products = useStore($products);
  const { mutate: createProduct } = useStore($createProduct);
  const { mutate: editProduct } = useStore($editProduct);
  const { mutate: deleteProduct } = useStore($deleteProduct);

  async function onFinish(data: iProduct) {
    try {
      const mutate = params.id ? editProduct : createProduct;

      const resp = (await mutate(data)) as Response;
      const respData = await resp.json();

      if (resp.ok) {
        return navigate(
          generatePath(ROUTES.EDIT_PRODUCT, { id: String(respData.id) }),
        );
      }

      if ('error' in respData && typeof respData.error === 'string') {
        return notification.error({ message: respData.error });
      }

      throw respData;
    } catch (e) {
      console.error(e);
      notification.error({ message: 'Unexpected error' });
    }
  }

  async function onProductDelete({ id }: Partial<iProduct>) {
    try {
      const resp = (await deleteProduct({ id })) as Response;
      const respData = await resp.json();

      if (resp.ok) {
        return navigate(generatePath(ROUTES.PRODUCTS));
      }

      if ('error' in respData && typeof respData.error === 'string') {
        return notification.error({ message: respData.error });
      }

      throw respData;
    } catch (e) {
      console.error(e);
      notification.error({ message: 'Unexpected error' });
    }
  }

  const initialValues =
    products.data?.find?.((v) => v.id === Number(params.id)) || {};

  if (products.loading) {
    return null;
  }

  return (
    <>
      <Flex justify="space-between" align="center">
        <Typography.Title>
          {params.id ? 'Edit' : 'Create'} product
        </Typography.Title>

        {params.id ? (
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => onProductDelete({ id: Number(params.id) })}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        ) : null}
      </Flex>

      <Form
        name="product"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={initialValues}
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item<iProduct>
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<iProduct>
          label="Price"
          name="price"
          rules={[{ required: true, message: 'Please input price!' }]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item<iProduct>
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Please input description' }]}
        >
          <Input.TextArea rows={6} />
        </Form.Item>

        <Form.Item<iProduct>
          label="Member quantity"
          name="memberQty"
          rules={[{ required: true, message: 'Please input member quantity' }]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item<iProduct>
          label="Subscription duration in month"
          name="subscriptionDuration"
          rules={[
            { required: true, message: 'Please input subscription duration' },
          ]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" size="large">
            {params.id ? 'Save' : 'Create'}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

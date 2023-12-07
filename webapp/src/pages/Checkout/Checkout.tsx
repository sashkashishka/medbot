import { ReactElement } from 'react';
import { Form } from 'react-final-form';
import { Input } from '../../components/Input';

export function CheckoutPage(): ReactElement {
  return (
    <Form onSubmit={console.log}>
      {({ handleSubmit }) => {
        return (
          <form onSubmit={handleSubmit}>
            checkout form
            <Input fieldName="name" />
          </form>
        );
      }}
    </Form>
  );
}

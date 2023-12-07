import { ReactElement } from 'react';
import { Form } from 'react-final-form';
import { Input } from '../../components/Input';
import { TgBackButton } from '../../components/TgBackButton';

import styles from './Checkout.module.css';
import { required } from '../../utils/final-form';

export function CheckoutPage(): ReactElement {
  return (
    <>
      <TgBackButton />

      <Form onSubmit={console.log}>
        {({ handleSubmit }) => {
          return (
            <form onSubmit={handleSubmit} className={styles.container}>
              <h2>Замовлення</h2>
              <Input
                labelName="Прізвище"
                fieldName="surname"
                fieldConfig={{ validate: required('Обовʼязкове поле') }}
              />
              <Input
                labelName="Імʼя"
                fieldName="name"
                fieldConfig={{ validate: required('Обовʼязкове поле') }}
              />
              <Input labelName="По батькові" fieldName="patronymic" />
            </form>
          );
        }}
      </Form>
    </>
  );
}

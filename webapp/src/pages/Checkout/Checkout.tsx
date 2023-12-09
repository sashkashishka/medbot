import { ReactElement } from 'react';
import { Form } from 'react-final-form';

import { TgBackButton } from '../../components/TgBackButton';
import { Input } from '../../components/Input';
import { Datepicker } from '../../components/Datepicker';
import { composeValidators, email, required } from '../../utils/final-form';

import { getPersistDecorator } from './decorators/persist';
import type { iFormValues } from './types';

import styles from './Checkout.module.css';

const decorators = [getPersistDecorator()];

export function CheckoutPage(): ReactElement {
  return (
    <>
      <TgBackButton />

      <Form<iFormValues>
        onSubmit={console.log}
        decorators={decorators}
        subscription={{}}
      >
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

              <Datepicker
                labelName="Дата народження"
                fieldName="birthDate"
                fieldConfig={{
                  validate: required('Обовʼязкове поле'),
                }}
              />

              <Input
                labelName="Номер телефону"
                fieldName="phone"
                fieldConfig={{ validate: required('Обовʼязкове поле') }}
              />

              <Input
                labelName="Електронна пошта"
                fieldName="email"
                fieldConfig={{
                  validate: composeValidators(
                    required('Обовʼязкове поле'),
                    email('Email невірний'),
                  ),
                }}
              />
            </form>
          );
        }}
      </Form>
    </>
  );
}

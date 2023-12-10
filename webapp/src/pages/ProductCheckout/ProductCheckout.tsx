import { Component } from 'react';
import { Form } from 'react-final-form';

import { TgBackButton } from '../../components/TgBackButton';
import { Input } from '../../components/Input';
import { Datepicker } from '../../components/Datepicker';
import { composeValidators, email, required } from '../../utils/final-form';

import { getPersistDecorator } from './decorators/persist';
import type { iFormValues } from './types';

import styles from './ProductCheckout.module.css';
import { createApi } from '../../utils/api';
import { API } from '../../constants/api';

export class ProductCheckoutPage extends Component {
  get decorators() {
    return [getPersistDecorator()];
  }

  render() {
    return (
      <>
        <TgBackButton />

        <Form<iFormValues>
          onSubmit={console.log}
          decorators={this.decorators}
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

  getUserApi(isOrderWaitingForPayment: boolean) {
    return isOrderWaitingForPayment
      ? createApi(API.UPDATE_USER, { method: 'PATCH' })
      : createApi(API.CREATE_USER, { method: 'POST' });
  }

  getOrderApi(isOrderWaitingForPayment: boolean) {
    return isOrderWaitingForPayment
      ? createApi(API.UPDATE_ORDER, { method: 'PATCH' })
      : createApi(API.CREATE_ORDER, { method: 'POST' });
  }

  handleSubmit(values: iFormValues) {
    const userApi = this.getUserApi(!!values.orderId);
    const orderApi = this.getOrderApi(!!values.orderId);


    console.log(userApi, orderApi)
  }
}

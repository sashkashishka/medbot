import { Component, createRef, useState } from 'react';
import { Form } from 'react-final-form';
import { useStore } from '@nanostores/react';
import { generatePath, useParams } from 'react-router-dom';

import { TgBackButton } from '../../components/TgBackButton';
import { Input } from '../../components/Input';
import { Datepicker } from '../../components/Datepicker';
import { composeValidators, email, required } from '../../utils/final-form';
import { createApi } from '../../utils/api';
import { API } from '../../constants/api';
import { TIDS } from '../../constants/testIds';
import { createWaitingForPaymentOrder } from '../../stores/order';
import type { iOrder, iUser } from '../../types';

import { SubmitButton } from './components';
import { getPersistDecorator } from './decorators/persist';
import type { iFormValues } from './types';

import styles from './ProductCheckout.module.css';
import { FORM_ERROR } from 'final-form';

interface iProps {
  waitingForPaymentOrder?: iOrder;
}

class ProductCheckoutForm extends Component<iProps> {
  realSubmitButtonRef;

  constructor(props: iProps) {
    super(props);
    this.realSubmitButtonRef = createRef<HTMLButtonElement>();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.triggerSubmit = this.triggerSubmit.bind(this);
  }

  get decorators() {
    const { waitingForPaymentOrder } = this.props;

    return [getPersistDecorator(waitingForPaymentOrder)];
  }

  render() {
    return (
      <>
        <TgBackButton />

        <Form<iFormValues>
          onSubmit={this.handleSubmit}
          decorators={this.decorators}
          subscription={{}}
        >
          {({ handleSubmit }) => {
            return (
              <form onSubmit={handleSubmit} className={styles.container}>
                <h2>Замовлення</h2>
                <Input
                  data-testid={TIDS.INPUT_SURNAME}
                  labelName="Прізвище"
                  fieldName="surname"
                  fieldConfig={{ validate: required('Обовʼязкове поле') }}
                />
                <Input
                  data-testid={TIDS.INPUT_NAME}
                  labelName="Імʼя"
                  fieldName="name"
                  fieldConfig={{ validate: required('Обовʼязкове поле') }}
                />

                <Input
                  data-testid={TIDS.INPUT_PATRONYMIC}
                  labelName="По батькові"
                  fieldName="patronymic"
                />

                <Datepicker
                  testid={TIDS.INPUT_BIRTHDATE}
                  labelName="Дата народження"
                  fieldName="birthDate"
                  fieldConfig={{
                    validate: required('Обовʼязкове поле'),
                  }}
                />

                <Input
                  data-testid={TIDS.INPUT_PHONE}
                  labelName="Номер телефону"
                  fieldName="phone"
                  fieldConfig={{ validate: required('Обовʼязкове поле') }}
                />

                <Input
                  data-testid={TIDS.INPUT_EMAIL}
                  labelName="Електронна пошта"
                  fieldName="email"
                  fieldConfig={{
                    validate: composeValidators(
                      required('Обовʼязкове поле'),
                      email('Email невірний'),
                    ),
                  }}
                />

                <button
                  ref={this.realSubmitButtonRef}
                  type="submit"
                  className={styles.realSubmitButton}
                />

                <SubmitButton handleSubmit={this.triggerSubmit} />
              </form>
            );
          }}
        </Form>
      </>
    );
  }

  triggerSubmit() {
    this.realSubmitButtonRef.current?.click();
  }

  async handleSubmit(values: iFormValues) {
    if (!values.name) {
      const [, userCreateErr] = await this.createUser(values);

      if (userCreateErr) {
        return FORM_ERROR;
      }
    } else {
      const [, userUpdateErr] = await this.updateUser(values);

      if (userUpdateErr) {
        return FORM_ERROR;
      }
    }

    if (!values.orderId) {
      const [, orderCreateErr] = await this.createOrder(values);

      if (orderCreateErr) {
        return FORM_ERROR;
      }
    }
    // TODO payment form logic

    await this.proceedToAppointment();

    return undefined;
  }

  async createUser(values: iFormValues) {
    const body: Partial<iUser> = {
      id: values.userId,
      name: values.name,
      surname: values.surname,
      patronymic: values.patronymic,
      birthDate: values.birthDate,
      email: values.email,
      phone: values.phone,
    };

    const api = createApi(API.CREATE_USER, {
      method: 'POST',
      body: JSON.stringify(body),
    });

    try {
      return [await api.request<iUser>(), null] as const;
    } catch (e) {
      console.error(e);
      return [null, e] as const;
    }
  }

  async updateUser(values: iFormValues) {
    const body: Partial<iUser> = {
      name: values.name,
      surname: values.surname,
      patronymic: values.patronymic,
      birthDate: values.birthDate,
      email: values.email,
      phone: values.phone,
    };

    const api = createApi(
      generatePath(API.UPDATE_USER, { userId: String(values.userId) }),
      {
        method: 'PATCH',
        body: JSON.stringify(body),
      },
    );

    try {
      return [await api.request<iUser>(), null] as const;
    } catch (e) {
      console.error(e);
      return [null, e] as const;
    }
  }

  async createOrder(values: iFormValues) {
    const body: Partial<iOrder> = {
      userId: values.userId,
      productId: values.productId,
      // TODO set status WAITING_FOR_PAYMENT when will connect payment
      status: 'ACTIVE',
    };

    const api = createApi(API.CREATE_ORDER, {
      method: 'POST',
      body: JSON.stringify(body),
    });

    try {
      return [await api.request<iOrder>(), null] as const;
    } catch (e) {
      console.error(e);
      return [null, e] as const;
    }
  }

  async setOrderStatusActive(values: iFormValues) {
    const api = createApi(
      generatePath(API.UPDATE_ORDER, { orderId: String(values.orderId) }),
      {
        method: 'PATCH',
        body: JSON.stringify({
          status: 'ACTIVE',
        }),
      },
    );

    try {
      // TODO make navigation logic to appointment scene
      return [await api.request<iOrder>(), null] as const;
    } catch (e) {
      console.error(e);
      return [null, e] as const;
    }
  }

  async proceedToAppointment() {
    const api = createApi(API.MEDBOT_PROCEED_TO_APPOINTMENT, {
      method: 'GET',
    });

    try {
      // TODO make navigation logic to appointment scene
      return [await api.request(), null] as const;
    } catch (e) {
      console.error(e);
      return [null, e] as const;
    }
  }
}

export function ProductCheckoutPage() {
  const { productId } = useParams();
  const [waitingForPaymentOrder$] = useState(
    createWaitingForPaymentOrder(productId!),
  );
  const { loading, data } = useStore(waitingForPaymentOrder$);

  if (loading) {
    // TODO make skeleton
    return 'product checkout loading...';
  }

  return <ProductCheckoutForm waitingForPaymentOrder={data} />;
}

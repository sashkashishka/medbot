import { Component, createRef } from 'react';
import { FORM_ERROR } from 'final-form';
import { Form, Field } from 'react-final-form';
import { generatePath } from 'react-router-dom';
import createDecorator from 'final-form-focus';

import { TgBackButton } from '../../../../components/TgBackButton';
import { Input } from '../../../../components/Input';
import { Datepicker } from '../../../../components/Datepicker';
import {
  composeValidators,
  email,
  required,
} from '../../../../utils/final-form';
import { createApi } from '../../../../utils/api';
import { API } from '../../../../constants/api';
import { TIDS } from '../../../../constants/testIds';
import type { iConfig, iOrder, iProduct, iUser } from '../../../../types';
import { $user } from '../../../../stores/user';

import { SubmitButton } from './SubmitButton';
import { getPersistDecorator } from './decorators/persist';
import type { iFormValues } from './types';
import type { tTranslations } from '../../../../stores/i18n';
import { getUserId, tg } from '../../../../utils/tg';
import { ORDER_ERRORS } from './constants';
import { setLastProductId } from '../../../../stores/product';
import { getTimeZone, getTimezoneOffset } from '../../../../utils/date';

import styles from './Form.module.css';

interface iProps {
  waitingForPaymentOrder?: iOrder;
  product: iProduct;
  user?: iUser;
  t: tTranslations;
  config: iConfig;
}

const focusOnErrors = createDecorator<iFormValues>();

export class ProductCheckoutForm extends Component<iProps> {
  realSubmitButtonRef;

  constructor(props: iProps) {
    super(props);
    this.realSubmitButtonRef = createRef<HTMLButtonElement>();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.triggerSubmit = this.triggerSubmit.bind(this);
  }

  get decorators() {
    const { waitingForPaymentOrder } = this.props;

    return [getPersistDecorator(waitingForPaymentOrder), focusOnErrors];
  }

  componentDidMount(): void {
    const { product } = this.props;
    setLastProductId(product.id);
  }

  render() {
    const { t } = this.props;

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
              <>
                <div className={styles.container}>
                  <div>{this.props.product?.name}</div>
                  <div>₴{this.props.product?.price}</div>
                </div>
                <form onSubmit={handleSubmit} className={styles.container}>
                  <Field
                    name="timeZone"
                    initialValue={getTimeZone()}
                    type="hidden"
                    component="input"
                  />

                  <Field
                    name="timezoneOffset"
                    initialValue={getTimezoneOffset()}
                    type="hidden"
                    component="input"
                  />

                  <Input
                    data-testid={TIDS.INPUT_SURNAME}
                    labelName={t.surname}
                    fieldName="surname"
                    fieldConfig={{
                      validate: required(t.validationRequiredField),
                    }}
                  />
                  <Input
                    data-testid={TIDS.INPUT_NAME}
                    labelName={t.name}
                    fieldName="name"
                    fieldConfig={{
                      validate: required(t.validationRequiredField),
                    }}
                  />

                  <Input
                    data-testid={TIDS.INPUT_PATRONYMIC}
                    labelName={t.patronymic}
                    fieldName="patronymic"
                  />

                  <Datepicker
                    testid={TIDS.INPUT_BIRTHDATE}
                    labelName={t.birthDate}
                    fieldName="birthDate"
                    fieldConfig={{
                      validate: required(t.validationRequiredField),
                    }}
                  />

                  <Input
                    data-testid={TIDS.INPUT_PHONE}
                    labelName={t.phoneLabel}
                    fieldName="phone"
                    fieldConfig={{
                      validate: required(t.validationRequiredField),
                    }}
                  />

                  <Input
                    data-testid={TIDS.INPUT_EMAIL}
                    labelName={t.emailLabel}
                    fieldName="email"
                    fieldConfig={{
                      validate: composeValidators(
                        required(t.validationRequiredField),
                        email(t.validationEmailError),
                      ),
                    }}
                  />

                  <SubmitButton
                    ref={this.realSubmitButtonRef}
                    handleSubmit={this.triggerSubmit}
                  />
                </form>
              </>
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
    const { t, config } = this.props;

    try {
      tg.disableClosingConfirmation();
      const user = await this.getUserApi(values).request();
      // TODO TMP solution create order
      const order = await this.getOrderApi(values).request();

      if ('code' in order) {
        const errorText =
          t[ORDER_ERRORS[order.error]]?.({
            userId: getUserId()!,
            email: config.googleEmail,
          }) || t.unexpectedError;
        tg.showPopup({ message: errorText, buttons: [{ type: 'close' }] });
        return FORM_ERROR;
      }

      // TODO TMP solution update order
      await this.getOrderApi({ ...values, orderId: order.id }).request();

      $user.setKey('data', user);
      setLastProductId(0);

      // TODO payment form logic
      await this.getProceedToChatApi().request();
    } catch (e) {
      tg.enableClosingConfirmation();
      console.error(e);
      return FORM_ERROR;
    }
  }

  getUserApi(values: iFormValues) {
    const { user } = this.props;

    const endpoint = user
      ? (generatePath(API.UPDATE_USER, {
          userId: String(user.id),
        }) as API.UPDATE_USER)
      : API.CREATE_USER;

    const method = user ? 'PATCH' : 'POST';

    const body: Partial<iUser> = {
      id: values.userId,
      name: values.name,
      surname: values.surname,
      patronymic: values.patronymic,
      birthDate: values.birthDate,
      email: values.email,
      phone: values.phone,
      timezoneOffset: values.timezoneOffset,
      timeZone: values.timeZone,
    };

    return createApi(endpoint, {
      method,
      body: JSON.stringify(body),
    });
  }

  getOrderApi(values: iFormValues) {
    const { orderId } = values;

    const endpoint = orderId
      ? (generatePath(API.UPDATE_ORDER, {
          orderId: String(orderId),
        }) as API.UPDATE_ORDER)
      : API.CREATE_ORDER;

    const method = orderId ? 'PATCH' : 'POST';

    const body: Partial<iOrder> = {
      userId: values.userId,
      productId: values.productId,
      // TODO set status WAITING_FOR_PAYMENT when will connect payment
      status: orderId ? 'ACTIVE' : 'WAITING_FOR_PAYMENT',
    };

    return createApi(endpoint, {
      method,
      body: JSON.stringify(body),
    });
  }

  getProceedToChatApi() {
    return createApi(API.MEDBOT_PROCEED_TO_CHAT, {
      method: 'GET',
    });
  }
}

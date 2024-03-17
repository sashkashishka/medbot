import { Component, createRef } from 'react';
import { FORM_ERROR } from 'final-form';
import { Form } from 'react-final-form';
import { generatePath } from 'react-router-dom';

import { TgBackButton } from '../../../../components/TgBackButton';
import { Input } from '../../../../components/Input';
import { Datepicker } from '../../../../components/Datepicker';
import {
  composeValidators,
  email,
  required,
} from '../../../../utils/final-form';
import { createApi } from '../../../../utils/api';
import { tg } from '../../../../utils/tg';
import { API } from '../../../../constants/api';
import { TIDS } from '../../../../constants/testIds';
import type { iUser } from '../../../../types';
import { $user } from '../../../../stores/user';

import { SubmitButton } from './SubmitButton';
import { getPersistDecorator } from './decorators/persist';
import { BLOCK_REASON, ORDER_ERRORS } from './constants';
import type { iFormValues } from './types';

import styles from './Form.module.css';

interface iProps {
  user?: iUser;
}

export class ProductActivateCodeForm extends Component<iProps> {
  realSubmitButtonRef;

  constructor(props: iProps) {
    super(props);
    this.realSubmitButtonRef = createRef<HTMLButtonElement>();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.triggerSubmit = this.triggerSubmit.bind(this);
  }

  get decorators() {
    return [getPersistDecorator()];
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
                <Input
                  data-testid={TIDS.INPUT_CODE}
                  labelName="Код активації"
                  fieldName="code"
                  type="number"
                  min={0}
                  max={9999}
                  fieldConfig={{ validate: required('Обовʼязкове поле') }}
                />

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
    try {
      tg.disableClosingConfirmation();
      const user = await this.getUserApi(values).request();
      const order = await this.getOrderApi(values).request();

      if ('code' in order) {
        let errorText = '';

        if (order.error?.reason && order.error?.blockedUntil) {
          errorText = BLOCK_REASON?.[order.error.reason]?.(
            new Date(order.error.blockedUntil),
          );
        } else {
          errorText = ORDER_ERRORS[order.error.error];
        }

        errorText ||= 'Невідома помилка';

        tg.showPopup({ message: errorText, buttons: [{ type: 'close' }] });
        return FORM_ERROR;
      }

      $user.setKey('data', user);

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
    };

    return createApi(endpoint, {
      method,
      body: JSON.stringify(body),
    });
  }

  getOrderApi(values: iFormValues) {
    const { code } = values;

    const endpoint = generatePath(API.CREATE_ORDER_BY_CODE, {
      code: String(code),
    }) as API.CREATE_ORDER_BY_CODE;

    const body = {
      userId: values.userId,
    };

    return createApi(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  getProceedToChatApi() {
    return createApi(API.MEDBOT_PROCEED_TO_CHAT, {
      method: 'GET',
    });
  }
}

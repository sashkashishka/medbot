import { Component, createRef } from 'react';
import { FORM_ERROR } from 'final-form';
import { Field, Form } from 'react-final-form';
import { generatePath } from 'react-router-dom';
import createDecorator from 'final-form-focus';
import { differenceInMinutes, startOfMinute } from 'date-fns';

import { TgBackButton } from '../../../../components/TgBackButton';
import { Input } from '../../../../components/Input';
import { Datepicker } from '../../../../components/Datepicker';
import {
  composeValidators,
  email,
  required,
} from '../../../../utils/final-form';
import { createApi } from '../../../../utils/api';
import { getUserId, tg } from '../../../../utils/tg';
import { API } from '../../../../constants/api';
import { TIDS } from '../../../../constants/testIds';
import type { iConfig, iUser } from '../../../../types';
import { $user } from '../../../../stores/user';

import { SubmitButton } from './SubmitButton';
import { getPersistDecorator } from './decorators/persist';
import { BLOCK_REASON, ORDER_ERRORS } from './constants';
import type { iFormValues } from './types';
import { getTimeZone, getTimezoneOffset } from '../../../../utils/date';
import type { tTranslations } from '../../../../stores/i18n';

import styles from './Form.module.css';

interface iProps {
  user?: iUser;
  t: tTranslations;
  config: iConfig;
}

const focusOnErrors = createDecorator<iFormValues>();
const persist = getPersistDecorator();

export class ProductActivateCodeForm extends Component<iProps> {
  realSubmitButtonRef;

  constructor(props: iProps) {
    super(props);
    this.realSubmitButtonRef = createRef<HTMLButtonElement>();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.triggerSubmit = this.triggerSubmit.bind(this);
  }

  decorators = [persist, focusOnErrors];

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
                  data-testid={TIDS.INPUT_CODE}
                  labelName={t.activationCodeLabel}
                  fieldName="code"
                  type="number"
                  min={0}
                  max={9999}
                  fieldConfig={{
                    validate: required(t.validationRequiredField),
                  }}
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
      const order = await this.getOrderApi(values).request();

      if ('code' in order) {
        let errorText = '';

        if (typeof order.error === 'object') {
          errorText = t[BLOCK_REASON?.[order.error.reason]]?.({
            date: differenceInMinutes(
              new Date(order.error.blockedUntil),
              startOfMinute(new Date()),
            ),
          });
        } else {
          errorText = t[ORDER_ERRORS[order.error]]?.({
            email: config.googleEmail,
            userId: getUserId()!,
          });
        }

        errorText ||= t.unexpectedError;

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
      timezoneOffset: values.timezoneOffset,
      timeZone: values.timeZone,
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

import { Component, createRef } from 'react';
import { Form } from 'react-final-form';

import { API } from '../../../../constants/api';

import { Textarea } from '../../../../components/Textarea';
import { TgBackButton } from '../../../../components/TgBackButton';
import { SubmitButton } from './SubmitButton';

import { createApi } from '../../../../utils/api';
import { required } from '../../../../utils/final-form';

import { iAppointment } from '../../../../types';
import type { iFormValues } from './types';

import styles from './Form.module.css';
import { FORM_ERROR } from 'final-form';
import { activeAppointment$ } from '../../../../stores/appointment';
import { tg } from '../../../../utils/tg';
import { APPOINTMENT_ERRORS } from './constants';

interface iProps {
  activeAppointment?: iAppointment;
}

export class CreateAppointmentForm extends Component<iProps> {
  realSubmitButtonRef;

  constructor(props: iProps) {
    super(props);
    this.realSubmitButtonRef = createRef<HTMLButtonElement>();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.triggerSubmit = this.triggerSubmit.bind(this);
  }

  get submitButtonText() {
    const { activeAppointment } = this.props;

    if (activeAppointment) {
      return 'Оновити дані зустрічі';
    }

    return 'Назначити зустріч';
  }

  get title() {
    const { activeAppointment } = this.props;

    if (activeAppointment) {
      return 'Змінити дані зустрічі';
    }

    return 'Записатись на зустріч';
  }

  render() {
    const { activeAppointment } = this.props;

    return (
      <>
        <TgBackButton />

        <h2 className={styles.title}>{this.title}</h2>

        <Form<iFormValues>
          onSubmit={this.handleSubmit}
          initialValues={activeAppointment}
          subscription={{}}
        >
          {({ handleSubmit }) => {
            return (
              <form onSubmit={handleSubmit} className={styles.container}>
                <Textarea
                  labelName="Скарги"
                  fieldName="complaints"
                  rows={5}
                  fieldConfig={{ validate: required('Обовʼязкове поле') }}
                />

                <Textarea
                  labelName="Коли почались скарги?"
                  fieldName="complaintsStarted"
                  rows={5}
                  fieldConfig={{ validate: required('Обовʼязкове поле') }}
                />

                <Textarea
                  labelName="Які ліки приймали?"
                  fieldName="medicine"
                  rows={5}
                  fieldConfig={{ validate: required('Обовʼязкове поле') }}
                />

                <Textarea
                  labelName="Хронічні захворювання"
                  fieldName="chronicDiseases"
                  rows={5}
                  fieldConfig={{ validate: required('Обовʼязкове поле') }}
                />

                <SubmitButton
                  ref={this.realSubmitButtonRef}
                  handleSubmit={this.triggerSubmit}
                  text={this.submitButtonText}
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
    const { activeAppointment } = this.props;

    const endpoint = activeAppointment
      ? API.UPDATE_APPOINTMENT
      : API.CREATE_APPOINTMENT;

    const api = createApi(endpoint, {
      method: 'POST',
      body: JSON.stringify(values),
    });

    try {
      const data = await api.request();

      if ('code' in data) {
        if ('time' in data.error) {
          const errorText =
            APPOINTMENT_ERRORS[data.error.time] || 'Невідома помилка';
          tg.showPopup({ message: errorText, buttons: [{ type: 'close' }] });

          return {
            time: errorText,
          };
        }

        const errorText =
          APPOINTMENT_ERRORS[data.error.error] || 'Невідома помилка';
        tg.showPopup({ message: errorText, buttons: [{ type: 'close' }] });
        return FORM_ERROR;
      }

      activeAppointment$.setKey('data', data);

      // await this.proceedToAppointment();

      return undefined;
    } catch (e) {
      console.error(e);
      return [null, FORM_ERROR] as const;
    }
  }

  async proceedToAppointment() {
    const api = createApi(API.MEDBOT_PROCEED_TO_CHAT, {
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

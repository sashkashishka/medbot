import { Component, createRef } from 'react';
import { FORM_ERROR } from 'final-form';
import { Form } from 'react-final-form';
import { generatePath } from 'react-router-dom';

import { API } from '../../../../constants/api';
import { APPOINTMENT_ERRORS } from './constants';

import { Textarea } from '../../../../components/Textarea';
import { TgBackButton } from '../../../../components/TgBackButton';
import { ScheduleMeeting } from './ScheduleMeeting';
import { SubmitButton } from './SubmitButton';

import { refetchFreeSlots } from '../../../../stores/appointment';

import { createApi } from '../../../../utils/api';
import { getUserId, tg } from '../../../../utils/tg';
import { required } from '../../../../utils/final-form';

import { iAppointment, iOrder } from '../../../../types';
import type { iFormValues } from './types';

import styles from './Form.module.css';

interface iProps {
  activeAppointment?: iAppointment;
  activeOrder: iOrder;
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
              <form onSubmit={handleSubmit}>
                <div className={styles.container}>
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
                </div>
                <ScheduleMeeting />

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
    const { activeAppointment, activeOrder } = this.props;

    const isUpdate = Boolean(activeAppointment);

    const endpoint = isUpdate
      ? (generatePath(API.UPDATE_DELETE_APPOINTMENT, {
          appointmentId: String(activeAppointment!.id),
        }) as API.UPDATE_DELETE_APPOINTMENT)
      : API.CREATE_APPOINTMENT;

    const method = isUpdate ? 'PATCH' : 'PUT';

    const api = createApi(endpoint, {
      method,
      body: JSON.stringify({
        ...values,
        timezoneOffset: new Date().getTimezoneOffset(),
        status: 'ACTIVE',
        orderId: activeOrder.id,
        userId: getUserId(),
      }),
    });

    try {
      const data = await api.request();

      if ('code' in data) {
        refetchFreeSlots();

        if (typeof data.error === 'object') {
          const errorText =
            APPOINTMENT_ERRORS[data.error.time] || 'Невідома помилка';
          tg.showPopup({ message: errorText, buttons: [{ type: 'close' }] });

          return {
            time: errorText,
          };
        }

        const errorText = APPOINTMENT_ERRORS[data.error] || 'Невідома помилка';
        tg.showPopup({ message: errorText, buttons: [{ type: 'close' }] });
        return FORM_ERROR;
      }

      await this.sendAppointmentStatus(activeAppointment!, isUpdate);

      return undefined;
    } catch (e) {
      console.error(e);
      return [null, FORM_ERROR] as const;
    }
  }

  async sendAppointmentStatus(appointment: iAppointment, isUpdate: boolean) {
    const api = createApi(API.MEDBOT_SEND_APPOINTMENT_STATUS, {
      method: 'POST',
      body: JSON.stringify({
        status: isUpdate ? 'updated' : 'created',
        appointment,
      }),
    });

    try {
      tg.disableClosingConfirmation();
      await api.request();
    } catch (e) {
      tg.enableClosingConfirmation();
      console.error(e);
    }
  }
}

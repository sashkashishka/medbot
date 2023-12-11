import { Component, createRef } from 'react';
import { Form } from 'react-final-form';

import { TgBackButton } from '../../components/TgBackButton';
import { Textarea } from '../../components/Textarea';
import { required } from '../../utils/final-form';
import { API } from '../../constants/api';
import { createApi } from '../../utils/api';

import styles from './Appointment.module.css';

class AppointmentForm extends Component {
  realSubmitButtonRef;

  constructor(props) {
    super(props);
    this.realSubmitButtonRef = createRef<HTMLButtonElement>();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.triggerSubmit = this.triggerSubmit.bind(this);
  }

  // get decorators() {
  //   const { waitingForPaymentOrder } = this.props;

  //   return [getPersistDecorator(waitingForPaymentOrder)];
  // }

  render() {
    return (
      <>
        <TgBackButton />

        <Form<iFormValues>
          onSubmit={this.handleSubmit}
          // decorators={this.decorators}
          subscription={{}}
        >
          {({ handleSubmit }) => {
            return (
              <form onSubmit={handleSubmit} className={styles.container}>
                <h2>Замовлення</h2>
                <Textarea
                  labelName="Скарги"
                  fieldName="complaints"
                  // fieldConfig={{ validate: required('Обовʼязкове поле') }}
                />

                <Textarea
                  labelName="Коли почались скарги?"
                  fieldName="complaintsStarted"
                  // fieldConfig={{ validate: required('Обовʼязкове поле') }}
                />

                <Textarea
                  labelName="Які ліки приймали?"
                  fieldName="medicine"
                  // fieldConfig={{ validate: required('Обовʼязкове поле') }}
                />

                <Textarea
                  labelName="Хронічні захворювання"
                  fieldName="chronicDiseases"
                  // fieldConfig={{ validate: required('Обовʼязкове поле') }}
                />
                <button type="submit">Submit</button>
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

  async handleSubmit() {
    await this.proceedToAppointment();

    return undefined;
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

export function AppointmentPage() {
  return <AppointmentForm />;
}

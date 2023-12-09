import { ReactElement } from 'react';
import { Form } from 'react-final-form';

import { TgBackButton } from '../../components/TgBackButton';
import { Textarea } from '../../components/Textarea';
import { required } from '../../utils/final-form';

import styles from './Appointment.module.css';

export function AppointmentPage(): ReactElement {
  return (
    <>
      <TgBackButton />

      <Form onSubmit={console.log} subscription={{}}>
        {({ handleSubmit }) => {
          return (
            <form onSubmit={handleSubmit} className={styles.container}>
              <h2>Appointment</h2>
              <Textarea
                labelName="Скарги"
                fieldName="complaints"
                fieldConfig={{ validate: required('Обовʼязкове поле') }}
              />

              <Textarea
                labelName="Коли почались скарги?"
                fieldName="complaintsStarted"
                fieldConfig={{ validate: required('Обовʼязкове поле') }}
              />

              <Textarea
                labelName="Які ліки приймали?"
                fieldName="medicine"
                fieldConfig={{ validate: required('Обовʼязкове поле') }}
              />

              <Textarea
                labelName="Хронічні захворювання"
                fieldName="chronicDiseases"
                fieldConfig={{ validate: required('Обовʼязкове поле') }}
              />
            </form>
          );
        }}
      </Form>
    </>
  );
}

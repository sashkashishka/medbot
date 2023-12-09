import { ReactElement } from 'react';
import { Form } from 'react-final-form';
import { Input } from '../../components/Input';
import { TgBackButton } from '../../components/TgBackButton';
import { Textarea } from '../../components/Textarea';
import { required } from '../../utils/final-form';
import { persistDecorator } from './decorators/persist';

import styles from './Checkout.module.css';
import { createApi } from '../../utils/api';

const decorators = [persistDecorator];

const api = createApi('/api/medbot');

export function CheckoutPage(): ReactElement {
  return (
    <>
      <TgBackButton />

      <Form onSubmit={console.log} decorators={decorators}>
        {({ handleSubmit }) => {
          return (
            <form onSubmit={handleSubmit} className={styles.container}>
              <h2 onClick={() => api.request()}>Замовлення</h2>
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

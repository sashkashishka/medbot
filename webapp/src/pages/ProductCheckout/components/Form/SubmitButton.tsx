import { useFormState } from 'react-final-form';
import { TgMainButton } from '../../../../components/TgMainButton';
import { forwardRef } from 'react';

interface iProps {
  handleSubmit(): void;
}

export const SubmitButton = forwardRef<HTMLButtonElement, iProps>(
  ({ handleSubmit }, ref) => {
    const { submitting } = useFormState({
      subscription: { submitting: true },
    });

    return (
      <>
        <button ref={ref} type="submit" style={{ display: 'none' }} />

        <TgMainButton
          progress={submitting}
          text="Перейти до оплати"
          handleClick={handleSubmit}
        />
      </>
    );
  },
);

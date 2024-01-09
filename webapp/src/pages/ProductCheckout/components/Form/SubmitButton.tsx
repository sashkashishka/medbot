import { useFormState } from 'react-final-form';
import { TgMainButton } from '../../../../components/TgMainButton';
import { forwardRef } from 'react';

interface iProps {
  handleSubmit(): void;
}

export const SubmitButton = forwardRef<HTMLButtonElement, iProps>(
  ({ handleSubmit }, ref) => {
    const { hasValidationErrors } = useFormState({
      subscription: { hasValidationErrors: true },
    });

    if (hasValidationErrors) {
      return null;
    }

    return (
      <>
        <button ref={ref} type="submit" style={{ display: 'none' }} />

        <TgMainButton text="Перейти до оплати" handleClick={handleSubmit} />
      </>
    );
  },
);

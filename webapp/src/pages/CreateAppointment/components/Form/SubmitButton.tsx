import { useFormState } from 'react-final-form';
import { TgMainButton } from '../../../../components/TgMainButton';
import { forwardRef } from 'react';

interface iProps {
  handleSubmit(): void;
  text: string;
}

export const SubmitButton = forwardRef<HTMLButtonElement, iProps>(
  ({ handleSubmit, text }, ref) => {
    const { hasValidationErrors } = useFormState({
      subscription: { hasValidationErrors: true },
    });

    if (hasValidationErrors) {
      return null;
    }

    return (
      <>
        <button ref={ref} type="submit" style={{ display: 'none' }} />

        <TgMainButton text={text} disabled={true} handleClick={handleSubmit} />
      </>
    );
  },
);

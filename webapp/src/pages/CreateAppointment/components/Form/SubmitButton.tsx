import { useFormState } from 'react-final-form';
import { TgMainButton } from '../../../../components/TgMainButton';
import { forwardRef } from 'react';

interface iProps {
  handleSubmit(): void;
  text: string;
}

export const SubmitButton = forwardRef<HTMLButtonElement, iProps>(
  ({ handleSubmit, text }, ref) => {
    const { submitting } = useFormState({
      subscription: { submitting: true },
    });

    return (
      <>
        <button ref={ref} type="submit" style={{ display: 'none' }} />

        <TgMainButton
          progress={submitting}
          text={text}
          disabled={true}
          handleClick={handleSubmit}
        />
      </>
    );
  },
);

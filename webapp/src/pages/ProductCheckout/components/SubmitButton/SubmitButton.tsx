import { useFormState } from 'react-final-form';
import { TgMainButton } from '../../../../components/TgMainButton';

interface iProps {
  handleSubmit(): void;
}

export function SubmitButton({ handleSubmit }: iProps) {
  const { hasValidationErrors } = useFormState({
    subscription: { hasValidationErrors: true },
  });

  return (
    <TgMainButton
      text="Перейти до оплати"
      disabled={hasValidationErrors}
      handleClick={handleSubmit}
    />
  );
}

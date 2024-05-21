import { useFormState } from 'react-final-form';
import { forwardRef } from 'react';
import { useStore } from '@nanostores/react';
import { TgMainButton } from '../../../../components/TgMainButton';
import { $t } from '../../../../stores/i18n';

interface iProps {
  handleSubmit(): void;
}

export const SubmitButton = forwardRef<HTMLButtonElement, iProps>(
  ({ handleSubmit }, ref) => {
    const t = useStore($t);
    const { submitting } = useFormState({
      subscription: { submitting: true },
    });

    return (
      <>
        <button ref={ref} type="submit" style={{ display: 'none' }} />

        <TgMainButton
          progress={submitting}
          text={t.activateBtn}
          handleClick={handleSubmit}
        />
      </>
    );
  },
);

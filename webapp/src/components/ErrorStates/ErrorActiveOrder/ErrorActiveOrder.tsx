import { TIDS } from '../../../constants/testIds';

// TODO write message in uk
export function ErrorActiveOrder() {
  return (
    <div data-testid={TIDS.ERR_ACTIVE_ORDER}>
      There is already active order. Finish it before ordering new one.
      <br />
      Try again later
    </div>
  );
}

import { TIDS } from "../../../constants/testIds";

// TODO write message in uk
// TODO add reload button
export function ErrorProductsInit() {
  return (
    <div data-testid={TIDS.ERR_PRODUCTS_INIT}>
      There was an error during initialisation
      <br />
      Try again later
    </div>
  );
}


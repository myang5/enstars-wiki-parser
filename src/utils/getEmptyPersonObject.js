import { DETAILS_KEYS } from 'Constants';

export default function getEmptyPersonObject() {
  return {
    [DETAILS_KEYS.NAME]: '',
    [DETAILS_KEYS.LINK]: '',
  };
}

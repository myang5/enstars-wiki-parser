import { DETAILS_KEYS } from '../constants';

export default function getEmptyPersonObject() {
  return {
    [DETAILS_KEYS.NAME]: '',
    [DETAILS_KEYS.LINK]: '',
  };
}

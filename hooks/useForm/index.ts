import { useContext } from 'react';

import { FormContext } from '@/contexts/Form';

export function useForm() {
  return useContext(FormContext);
}

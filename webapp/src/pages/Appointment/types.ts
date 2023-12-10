import type { iAppointment } from '../../types';

export interface iFormValues {
  complaints: iAppointment['complaints'];
  complaintsStarted: iAppointment['complaintsStarted'];
  medicine: iAppointment['medicine'];
  chronicDiseases: iAppointment['chronicDiseases'];
}

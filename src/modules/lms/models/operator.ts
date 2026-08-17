
export type Shift = 'Morning' | 'Evening' | 'Night';
export type ShiftFilter = 'All Shifts' | Shift;
export type CertFilter = 'All' | 'Certified' | 'Not Certified';


export interface OperatorData {
  id: number | null;
  name: string;
  opId: string;
  email: string | null;
  machine: string;
  shift: Shift;
  certified: boolean;
}

export interface ShiftStyle {
  bg: string;
  color: string;
}
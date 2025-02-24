import { Event as RBCEvent } from 'react-big-calendar';

export interface WorkRequestEvent extends RBCEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  status: 'pending' | 'approved' | 'denied';
  address?: string;
  name?: string;
  type?: 'work-request' | 'blocked';
}
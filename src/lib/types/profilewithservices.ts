import type { Profile } from '@/lib/types/profile';
import type {Service} from '@/lib/types/service';

export type ProfileWithServices = Profile & {
  services: Service[];
};
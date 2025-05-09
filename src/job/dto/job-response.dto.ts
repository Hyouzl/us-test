import { Exclude, Expose } from 'class-transformer';
import { JobStatus } from '../enums/job-status.enum';

@Exclude()
export class JobResponseDTO {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  status: JobStatus;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;
}

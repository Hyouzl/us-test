import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { DbModule } from 'src/db/db.module';
import { JobSchedulerService } from './job-schedule.service';

@Module({
  imports: [DbModule],
  controllers: [JobController],
  providers: [JobService, JobSchedulerService],
})
export class JobModule {}

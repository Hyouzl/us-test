import { Module } from '@nestjs/common';
import { JobModule } from './job/job.module';
import { DbModule } from './db/db.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot(), JobModule, DbModule],
})
export class AppModule {}

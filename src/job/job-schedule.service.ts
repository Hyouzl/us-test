// job/job-scheduler.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as fs from 'fs';
import * as path from 'path';
import { JobStatus } from './enums/job-status.enum';
import { JsonDbService } from 'src/db/json-db.service';
import { Job } from './interfaces/job.interface';

@Injectable()
export class JobSchedulerService {
  private readonly logger = new Logger(JobSchedulerService.name);
  private readonly logFilePath = path.join(process.cwd(), 'logs.txt');

  constructor(private readonly dbService: JsonDbService) {}

  @Cron('*/60 * * * * *') // 매 1분마다 실행
  async handlePendingJobs() {
    const now = new Date().toISOString();
    try {
      // status 인덱스에서 'pending' 작업 ID만 추출
      const statusIndex = await this.dbService.getStatusIndex();
      const pendingIds = statusIndex?.[JobStatus.PENDING] ?? [];

      if (pendingIds.length === 0) {
        this.logger.log('변경할 PENDING 작업이 없습니다.');
        return;
      }
      // ID로 작업들 조회
      const jobs = await this.dbService.getJobsByIds(pendingIds);
      const updatedJobs: Job[] = [];

      for (const job of jobs) {
        const updated: Job = {
          ...job,
          status: JobStatus.COMPLETED,
          updatedAt: now,
        };

        this.logToFile(`[${now}] Job ${job.id} 상태를 'completed'로 변경`);
        this.logger.log(`Job ${job.id} → completed`);

        updatedJobs.push(updated);

        // 인덱스 변경: pending → completed
        await this.dbService.removeFromIndex(job); // 이전 상태 기준
        await this.dbService.addToIndex(updated); // 변경된 상태 기준
      }

      // map 구조로 변경 데이터 전체 저장
      const updatedMap: Record<string, Job> = {};

      for (const job of updatedJobs) {
        updatedMap[job.id] = job;
      }
      await this.dbService.mergeJobs(updatedJobs);
    } catch (err) {
      const msg = `[${new Date().toISOString()}] 배치 처리 중 오류 발생: ${err instanceof Error ? err.message : String(err)}`;
      this.logToFile(msg);
      this.logger.error(msg, err instanceof Error ? err.stack : '');
    }
  }

  private logToFile(message: string) {
    fs.appendFileSync(this.logFilePath, `${message}\n`, 'utf8');
  }
}

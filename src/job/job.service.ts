import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { nanoid } from 'nanoid';
import { JsonDbService } from 'src/db/json-db.service';
import { CreateJobDTO } from './dto/create-job.dto';
import { Job } from './interfaces/job.interface';
import { JobStatus } from './enums/job-status.enum';
import { Mutex } from 'async-mutex';
import { JobResponseDTO } from './dto/job-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class JobService {
  private readonly mutex = new Mutex();
  constructor(private readonly dbService: JsonDbService) {}

  async create(dto: CreateJobDTO): Promise<JobResponseDTO> {
    const now = new Date();
    const nowKST = new Date(now.getTime() + 9 * 60 * 60 * 1000); // KST는 UTC+9 (한국시간과 9시간 차이)
    const formattedNowKST = nowKST.toISOString(); // KST 시간을 ISO 8601 형식으로 변환
    const id = nanoid(8);
    const newJob: Job = {
      id,
      title: dto.title,
      description: dto.description,
      status: JobStatus.PENDING,
      createdAt: formattedNowKST,
      updatedAt: formattedNowKST,
    };

    // 락 획득
    const release = await this.mutex.acquire();
    try {
      // Map 방식 사용
      await this.dbService.addJob(newJob);
      // status 인덱싱
      await this.dbService.addToIndex(newJob);
    } catch {
      throw new InternalServerErrorException(
        'Job 저장 중 오류가 발생했습니다.',
      );
    } finally {
      // 락 해제
      release();
    }

    return newJob;
  }

  async findById(id: string): Promise<JobResponseDTO> {
    const job = await this.dbService.getJobsById(id);
    if (!job) {
      throw new NotFoundException(`존재하지 않는 Job 입니다.`);
    }
    return plainToInstance(JobResponseDTO, job);
  }

  async findAll(): Promise<JobResponseDTO[]> {
    try {
      const jobs = await this.dbService.getJobs();
      return plainToInstance(JobResponseDTO, jobs);
    } catch {
      throw new InternalServerErrorException(
        '작업 목록을 불러오지 못했습니다.',
      );
    }
  }

  async search(status?: string, title?: string): Promise<JobResponseDTO[]> {
    // status 유효성 검사
    const validStatuses = Object.values(JobStatus);
    if (status && !validStatuses.includes(status as JobStatus)) {
      throw new BadRequestException(
        `잘못된 상태 값입니다. 가능한 값: ${validStatuses.join(', ')}`,
      );
    }
    // status 인덱스
    let jobs: Job[] = [];
    if (status) {
      const statusIndex = await this.dbService.getStatusIndex();
      const ids: string[] = statusIndex?.[status as JobStatus] ?? [];
      if (ids && ids.length > 0) {
        jobs = await this.dbService.getJobsByIds(ids);
      }
    } else {
      jobs = await this.dbService.getJobs();
    }

    // 제목 필터링
    const filteredJobs = title
      ? jobs.filter((job) =>
          job.title.toLowerCase().includes(title.toLowerCase()),
        )
      : [];

    return plainToInstance(JobResponseDTO, filteredJobs);
  }
}

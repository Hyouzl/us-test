import { JsonDB, Config } from 'node-json-db';
import { Job } from 'src/job/interfaces/job.interface';
import { StatusIndex } from 'src/job/interfaces/status-index.type';

export class JsonDbService {
  private db: JsonDB;
  private jobCache: Record<string, Job> | null = null;

  constructor() {
    this.db = new JsonDB(new Config('jobs', true, true, '/'));
  }
  private async loadJobs(): Promise<Record<string, Job>> {
    if (this.jobCache) return this.jobCache;

    const data = (await this.db.getData('/jobs')) as Record<string, Job>;
    this.jobCache = data;
    return data;
  }

  async getJobs(): Promise<Job[]> {
    const allJobs = await this.loadJobs();
    return Object.values(allJobs);
  }

  async saveJobs(jobs: Record<string, Job>): Promise<void> {
    await this.db.push('/jobs', jobs, true);
    this.jobCache = null;
  }

  async addJob(job: Job): Promise<void> {
    await this.db.push(`/jobs/${job.id}`, job);
    this.jobCache = null;
  }
  async removeFromIndex(job: Job): Promise<void> {
    const path = `/indexes/status/${job.status}`;
    try {
      const list = (await this.db.getData(path)) as string[];
      const filtered = list.filter((id) => id !== job.id);
      await this.db.push(path, filtered, true);
    } catch (err: any) {
      if (
        err instanceof Error &&
        err.message.includes(
          `Can't find dataPath: /indexes/status/${job.status}`,
        )
      ) {
        throw err;
      }
    }
  }

  async addToIndex(job: Job) {
    const statusIndexPath = `/indexes/status/${job.status}`;

    // 상태 인덱스에 추가
    try {
      const statusList =
        ((await this.db.getData(statusIndexPath)) as string[]) || [];
      if (!statusList.includes(job.id)) {
        statusList.push(job.id);
        await this.db.push(statusIndexPath, statusList, true);
      }
      this.jobCache = null;
    } catch (err: any) {
      if (
        err instanceof Error &&
        err.message.includes("Can't find dataPath: /indexes/status")
      ) {
        // 경로가 없는 경우 새로 생성
        await this.db.push(statusIndexPath, [job.id], true);
      } else {
        throw err;
      }
    }
  }

  async getStatusIndex(): Promise<StatusIndex | null> {
    try {
      const index = (await this.db.getData('/indexes/status')) as StatusIndex;
      return index;
    } catch (err: any) {
      if (
        err instanceof Error &&
        err.message.includes("Can't find dataPath: /indexes/status")
      ) {
        return null; // 존재하지 않음: null로 처리
      }
      throw err;
    }
  }

  async getJobsByIds(ids: string[]): Promise<Job[]> {
    const allJobs = await this.loadJobs();
    const matched = ids.map((id) => allJobs[id]).filter((j): j is Job => !!j);
    return matched;
  }

  async getJobsById(id: string): Promise<Job | null> {
    try {
      const job = (await this.db.getData(`/jobs/${id}`)) as Job;
      return job;
    } catch (err: any) {
      if (
        err instanceof Error &&
        err.message.includes(`Can't find dataPath: /jobs/${id}`)
      ) {
        return null; // 존재하지 않음: null로 처리
      }
      throw err;
    }
  }

  async mergeJobs(jobsToUpdate: Job[]): Promise<void> {
    const all = await this.loadJobs(); // 전체 Record<string, Job> 캐싱 값 가져오기
    for (const job of jobsToUpdate) {
      all[job.id] = job;
    }
    await this.saveJobs(all); // 덮어쓰기
    this.jobCache = null;
  }
}

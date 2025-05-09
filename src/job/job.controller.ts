import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseFilters,
} from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDTO } from './dto/create-job.dto';
import { HttpExceptionFilter } from 'src/common/exception-filter/http.exception-filter';
import { JobResponseDTO } from './dto/job-response.dto';

@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  @UseFilters(HttpExceptionFilter)
  async create(@Body() dto: CreateJobDTO): Promise<JobResponseDTO> {
    return this.jobService.create(dto);
  }

  @Get('search')
  @UseFilters(HttpExceptionFilter)
  async search(
    @Query('status') status?: string,
    @Query('title') title?: string,
  ): Promise<JobResponseDTO[]> {
    return this.jobService.search(status, title);
  }

  @Get('/:id')
  @UseFilters(HttpExceptionFilter)
  async getJob(@Param('id') id: string): Promise<JobResponseDTO> {
    return this.jobService.findById(id);
  }

  @Get()
  @UseFilters(HttpExceptionFilter)
  async findAll(): Promise<JobResponseDTO[]> {
    return this.jobService.findAll();
  }
}

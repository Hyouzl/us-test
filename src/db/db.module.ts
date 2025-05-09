import { Module } from '@nestjs/common';
import { JsonDbService } from './json-db.service';

@Module({
  providers: [JsonDbService],
  exports: [JsonDbService],
})
export class DbModule {}

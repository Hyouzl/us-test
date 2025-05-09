import { IsNotEmpty, IsString } from 'class-validator';

export class CreateJobDTO {
  @IsString({
    message: 'title 은 string 타입을 넣어줘야합니다.',
  })
  @IsNotEmpty({
    message: 'title 값은 필수값 입니다.',
  })
  title: string;

  @IsString({ message: 'description 은 string 타입을 넣어줘야합니다.' })
  @IsNotEmpty({
    message: 'description 값은 필수값 입니다.',
  })
  description: string;
}

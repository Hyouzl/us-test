# 홍유리 프로젝트 과제 제출

## 프로젝트 설명

**NestJS** 프레임워크를 기반으로 **TypeScript**로 구현되었으며, **Yarn**을 패키지 매니저로 사용합니다.

## 프로젝트 실행 방법

### 1. 프로젝트 클론

먼저, 해당 프로젝트를 클론합니다.

```bash
git clone https://github.com/Hyouzl/us-test.git
cd job-manager
```

### 2. 의존성 설치

Yarn을 사용하여 의존성을 설치합니다.

```bash
yarn install
```

### 3. 빌드

NestJS 프로젝트를 빌드 합니다.

```bash
yarn build
```

### 4. 개발 서버 실행

개발 환경에서 서버를 실행합니다.

```bash
yarn start:dev
```

## API 사용법 (엔드포인트별 요청/응답 예시)

### End Point : POST `/jobs`

> #### **POST /jobs**
>
> 새로운 작업을 생성합니다.

#### 요청

```http
POST /jobs
Content-Type: application/json

body
{
  "title": "test",
  "description": "test"
}
```

#### 응답

```json
{
  "statusCode": 200,
  "message": "요청 성공",
  "data": {
    "id": "0jGxV6jR",
    "title": "test",
    "description": "test",
    "status": "pending",
    "createdAt": "2025-05-08T19:07:08.733Z",
    "updatedAt": "2025-05-08T19:07:08.733Z"
  }
}
```

### End Point : GET `/jobs/{id}`

> #### **GET /jobs/{id}**
>
> 특정 ID의 작업을 가져옵니다.

#### 요청 예시

```http
GET /jobs/{id}
Content-Type: application/json

```

#### 응답 예시

```json
{
    "statusCode": 200,
    "message": "요청 성공",
    "data": [
        {
            "id": {id},
            "title": "test",
            "status": "completed",
            "createdAt": "2025-05-08T18:01:08.566Z",
            "updatedAt": "2025-05-08T18:02:00.005Z"
        }
    ]
}
```

### End Point : GET `/jobs`

> #### **GET /jobs**
>
> 모든 작업 목록을 조회합니다.

#### 요청 예시

```http
GET /jobs
Content-Type: application/json

```

#### 응답 예시

```json
{
    "statusCode": 200,
    "message": "요청 성공",
    "data": [
        {
            "id": {id},
            "title": "test",
            "status": "completed",
            "createdAt": "2025-05-08T18:01:08.566Z",
            "updatedAt": "2025-05-08T18:02:00.005Z"
        }
    ]
}
```

### End Point : GET `/jobs/search`

> #### **GET /jobs/search?status={string}&title={string}**
>
> 모든 작업 목록을 조회합니다.

#### 요청 예시

```http
GET /jobs/search?status=pending&title=test
Content-Type: application/json

```

#### 응답 예시

```json
{
  "statusCode": 200,
  "message": "요청 성공",
  "data": [
    {
      "id": "1vOjySxl",
      "title": "test9",
      "status": "pending",
      "createdAt": "2025-05-08T19:07:04.888Z",
      "updatedAt": "2025-05-08T19:07:04.888Z"
    },
    {
      "id": "0jGxV6jR",
      "title": "test10",
      "status": "pending",
      "createdAt": "2025-05-08T19:07:08.733Z",
      "updatedAt": "2025-05-08T19:07:08.733Z"
    }
  ]
}
```

## 프로젝트 구조

```markdown
📦src
┣ 📂common
┃ ┣ 📂exception-filter
┃ ┃ ┣ 📜http.exception-filter.ts
┃ ┃ ┗ 📜non.exception-filter.ts
┃ ┗ 📂interceptors
┃ ┃ ┗ 📜response.interceptor.ts
┣ 📂db
┃ ┣ 📜db.module.ts
┃ ┗ 📜json-db.service.ts
┣ 📂job
┃ ┣ 📂dto
┃ ┃ ┣ 📜create-job.dto.ts
┃ ┃ ┗ 📜job-response.dto.ts
┃ ┣ 📂enums
┃ ┃ ┗ 📜job-status.enum.ts
┃ ┣ 📂interfaces
┃ ┃ ┣ 📜job.interface.ts
┃ ┃ ┗ 📜status-index.type.ts
┃ ┣ 📜job-schedule.service.ts
┃ ┣ 📜job.controller.spec.ts
┃ ┣ 📜job.controller.ts
┃ ┣ 📜job.module.ts
┃ ┣ 📜job.service.spec.ts
┃ ┗ 📜job.service.ts
┣ 📜app.module.ts
┗ 📜main.ts
```

- **common**: 공통으로 사용되는 예외 처리 및 인터셉터 파일
- **db**: 데이터베이스 관련 서비스 및 모듈이 담긴 파일
- **job**: 작업 관련 모듈을 생성한 파일
- **app.module.ts**: 메인 모듈 파일
- **main.ts**: 애플리케이션 진입점

## RESTful API 설계 원칙

REST(Representational State Transfer) 기반의 API 설계를 하기 위해 리소스 중심으로 API 엔드포인트를 정의하고,
HTTP 메서드를 사용하여 리소스에 대한 작업을 정의하였습니다.

## 데이터 처리 전략

#### 1. 맵(Map) 구조를 활용한 데이터 저장

효율적인 데이터 조회를 위해 맵 구조를 사용하여 데이터 구조를 설계하였습니다. 고유 ID를 키로 사용하므로, 특정 작업을 O(1) 시간 복잡도로 조회할 수 있도록 하였습니다.

#### 2. 인덱싱을 이용한 효율적인 조회

status에 대한 인덱스를 생성하여, 특정 상태(pending, completed)에 해당하는 작업들을 효율적으로 조회할 수 있도록 구현하였습니다.

#### 3. 데이터 무결성 및 동시성 관리

여러 요청이 동시에 처리될 때 발생할 수 있는 데이터 충돌을 방지하기 위해 async-mutex 라이브러리를 사용하여 동시성 문제를 해결하였습니다. **락(Lock)** 을 사용하여 데이터에 접근하는 동시 작업이 발생하지 않도록 보장하며, 이를 통해 데이터의 일관성과 무결성을 유지 하도록 구현하였습니다.

```ts
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
```

여러 요청이 동시에 들어와도 락을 사용하여 직렬 처리되므로, 데이터 충돌이 발생하지 않습니다. 예를 들어, 두 개의 요청이 동시에 **/jobs**에 작업을 추가하려고 할 때, 첫 번째 요청이 락을 획득하고 작업을 추가한 후, 두 번째 요청은 락이 해제될 때까지 대기합니다.
또한 async-mutex는 비동기 방식으로 동작하므로, 락을 대기하는 동안 다른 작업이 차단되지 않고 효율적으로 시스템 자원을 사용할 수 있습니다.

## 성능 관리 전략

#### 1. 캐싱 전략

node-json-db은 전체 데이터를 조회할 때마다 매번 파일 시스템에서 직접 데이터를 읽는 방식이기 때문에 성능에 영향을 미칠 수 있습니다.
이 문제를 해결하기 위해 캐싱 전략을 활용하였습니다.

데이터가 변경될 때마다 캐시를 초기화하고, 처음 조회 시에는 데이터를 캐싱하여 불필요한 I/O 작업을 줄이고자 하였습니다.

```ts
private async loadJobs(): Promise<Record<string, Job>> {
  if (this.jobCache) return this.jobCache;

  const data = (await this.db.getData('/jobs')) as Record<string, Job>;
  this.jobCache = data;
  return data;
}
```

매번 데이터베이스를 조회하는 하는 방식 대신 캐시를 활용하여 반복된 조회 요청에 대해 빠르게 데이터를 제공할 수 있도록 하였습니다.

#### 2. 인덱싱과 Map 구조를 통한 조회 성능 개선

특정 속성 값에 따라 빠르게 검색할 수 있도록 리스트에 해당 값을 저장하는 방식을 사용하였습니다. 스케줄러 구현이나 특정 속성 값에 해당하는 작업을 검색할 때 해당 방식으로 빠르게 조회할 수 있습니다.

고정된 값을 기준으로 검색하는 것은 인덱스를 사용하여 빠르게 처리할 수 있지만, title 로 검색 하는 것은 부분 문자열 검색으로 검색 범위가 커지고 조건이 다양해지기 때문에 인덱스를 이용한 효율적인 검색이 어려워져 인덱싱을 사용하지 않았습니다.

## 구현 디테일

### 에러 처리 및 응답 일관성 관리

#### 1. 전역적인 에러 처리 (HttpException & 비정형 Exception)

각 컨트롤러나 서비스에서 반복적으로 처리할 필요 없이 일관된 방식으로 모든 예외를 처리할 수 있도록 에러 처리 전략을 전역적으로 관리하였습니다.

HttpException 처리:

    HTTP 상태 코드와 관련된 예외를 처리합니다.
    예를 들어, 400 Bad Request, 404 Not Found와 같은 HTTP 상태 코드에 해당하는 예외들을 처리할 수 있습니다.

비정형 예외 처리:

    특정 Error 객체를 catch하여 처리하며, 예를 들어 DB 연결 실패, 서버 내부 오류 등 예외적인 상황을 처리할 수 있습니다.

#### 2. 응답 값 일관성 관리 (Interceptor 사용)

Interceptor를 사용하여 반환되는 응답 값의 일관성을 유지하였습니다.

모든 응답에 statusCode, message, data 구조를 일관되게 포함시키는 방식으로 처리함으로써, 응답 데이터 구조가 항상 일관되게 유지되어 클라이언트에서 예측 가능한 응답 방식을 제공할 수 있습니다.

### 시간 처리 및 고유 ID 생성

#### 1. **KST 시간 처리**:

코드에서 `now` 는 **현재 시간을 UTC 기준으로 가져옵니다**. 하지만 프로젝트에서는 **한국 표준시(KST, UTC+9)** 이 필요하다고 판단하였으므로, UTC 시간에 9시간을 더하여 KST 시간으로 변환하였습니다.

`formattedNowKST`는 이 시간을 **ISO 8601 형식**으로 변환하여 **한국 표준시**를 일관되게 사용할 수 있게 합니다. 이렇게 변환된 **KST 시간** 을 이후 데이터 저장 및 처리 시 **한국 시간**을 기준으로 사용할 수 있습니다.

#### 2. **고유 ID 생성**:

**`nanoid(8)`** 는 **고유한 8자리 ID**를 생성하는 함수로, 이 ID는 데이터베이스에서 **작업을 구분**할 때 중요한 역할을 합니다. `nanoid`는 **짧고 랜덤한 ID**를 생성할 수 있어, 데이터베이스에 저장할 때 **고유성**을 보장합니다.

이렇게 생성된 ID는 **데이터 식별**을 위한 중요한 값으로 사용됩니다. 예를 들어, **작업을 식별하는 ID**로 사용되어 **중복되지 않게** 데이터가 처리될 수 있습니다.

### 유효성 검사 구현

**interface** 와 달리 **class**는 런타임에서 데이터의 유효성을 검사할 수 있습니다. NestJS에서는 유효성 검사를 위해 데이터 생성에 필요한 값들을 정의한 **DTO**를 class로 정의하고(create-job.dto.ts), 데코레이터와 함께 **ValidationPipe**를 사용하여 유효성 검사를 처리하였습니다.

HttpExceptionFilter 에서 class-validator에서 발생한 에러를 400 Bad Request 오류로 식별해 데코레이터로 설정한 오류 메시지를 반환하도록 구현하였습니다.

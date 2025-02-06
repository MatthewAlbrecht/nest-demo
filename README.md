# NestJS Learning

## Postman Collection

[Postman Collection](./postman/collection.json)
[Postman Prod Environment](./postman/production-environment.json)

Hosted on Railway + Neon Postgres + Upstash KV

## Notes

- [x] Hit the hello world enpoint
- [x] add db service using vercel db & drizzle
- [x] host project on railway?
- [x] add users table, sessions table
- [x] add email pass auth
- [x] add organization table
- [x] add basic auth gaurd for organization endpoint
- [x] add redis for session management
- [x] add abac tables
- [x] add abac service
- [x] add abac guard
- [x] add email verification
- [ ] add IP rate limiting
- [ ] refactor email module to be generic and plug in resend
- [ ] add tests

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

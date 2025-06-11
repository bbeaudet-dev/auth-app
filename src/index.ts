import { Elysia, t } from "elysia"
import { swagger } from '@elysiajs/swagger'

export const app = new Elysia()
  .use(swagger())
  .get('/api/public/', "This is public information")
  .get('/api/protected/', "Only admin should be able to see this")
  .listen(3000)

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)

import { Elysia, t } from "elysia"
import { swagger } from '@elysiajs/swagger'

const users = [
  { id: 1, username: "ben", role: "peasant", password: "my-password" },
  { id: 2, username: "parth", role: "peasant", password: "not-my-password" },
  { id: 3, username: "andrew", role: "admin", password: "not-his-password" },
  { id: 4, username: "eugene", role: "basic", password: "not-this-password" },
  { id: 5, username: "paris", role: "basic", password: "not-that-password" }
]

export const app = new Elysia()
  .use(swagger({path: '/api-docs'}))
  .get('/api/public/', () => { 
    return { 
      message: 'This is public information',
      access: 'public'
    }
  })
  .get('/api/protected/', () => { 
    return {
      message: "Only admin should be able to see this",
      access: 'protected'
    }
  })
  .listen(3000)

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)

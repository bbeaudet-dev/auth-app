import { Elysia, status, t } from "elysia"
import { swagger } from '@elysiajs/swagger'

const users = [ // TODO use database instead of hardcoded array
  { id: 1, username: "ben", role: "peasant", password: "my-password" },
  { id: 2, username: "parth", role: "peasant", password: "not-my-password" },
  { id: 3, username: "andrew", role: "admin", password: "not-his-password" },
  { id: 4, username: "eugene", role: "basic", password: "not-this-password" },
  { id: 5, username: "paris", role: "basic", password: "not-that-password" }
]

export const app = new Elysia()
  .use(swagger({path: '/api-docs'}))
  
  // TODO use derive to pull user info from request rather than from users[]

  // Route for public info
  .get('/api/public/', () => { 
    console.log('Public route')
    return { message: 'This is public information' }
  })

  // Check for admin access
  .onBeforeHandle( () => {
    if (users[0].role !== "admin") { // FIXME Hardcoded user index
      return status(401)
    } 
  })

  // Route for protected info
  .get('/api/protected/', () => { 
    console.log('Protected route')
    return { message: "Only admin should be able to see this" }
  })

  .listen(3000)

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)

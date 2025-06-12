import { Elysia, t } from "elysia"
import { swagger } from '@elysiajs/swagger'

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

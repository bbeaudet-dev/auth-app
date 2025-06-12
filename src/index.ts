import { Elysia, status, t } from "elysia"
import { swagger } from '@elysiajs/swagger'
import { jwt } from '@elysiajs/jwt'

const users = [ // TODO use database instead of hardcoded array
	{ id: 1, username: "ben", role: "peasant", password: "my-password" , secret: "ben-secret" },
	{ id: 2, username: "parth", role: "peasant", password: "not-my-password", secret: "parth-secret" },
	{ id: 3, username: "andrew", role: "admin", password: "not-his-password", secret: "andrew-secret" },
	{ id: 4, username: "eugene", role: "basic", password: "not-this-password", secret: "eugene-secret" },
	{ id: 5, username: "paris", role: "basic", password: "not-that-password", secret: "paris-secret" }
] // STEP 6: ^These secrets are not safe! 

export const app = new Elysia()

	// Set up interactive API docs
	.use(swagger({path: '/api-docs'}))
	
	// Set up JWT with secret key
	.use(jwt({ 
		name: 'jwt',
		secret: 'Pack my box with five dozen liquor jugs'
	}))
	
	// Create new JWT token and store inside secure cookie
	.get('/sign/:name', async ({ jwt, cookie: { auth }, params }) => {
		auth.set({
			value: await jwt.sign(params), // create
			httpOnly: true, // stores
			maxAge: 7 * 86400, // 7 days
			path: '/profile', // cookie is only sent to /profile routes
		})
		return `Sign in as ${auth.value}`
	})

	// Verify token and load profile
	.get('/profile', async ({ jwt, set, cookie: { auth } }) => {
		const userProfile = await jwt.verify(auth.value)
		if (!userProfile) {
			set.status = 401 
			return 'Unauthorized'
		}
		return `Greetings ${userProfile.name}`
	})

	// User Authentication -- "who is this request from?"
	.derive( (request) => {
		const headers = request.headers
		const secret = headers['x-bens-server-secret']
		if (!secret) return {} // if no secret, user is undefined
		const user = users.find(user => user.secret === secret)
		if(!user) return {} // if no matching user, user is undefined
		console.log("Server: User found")
		return {user: user} // if matching user, add user context to request
	})

	// Authorization -- "is this request allowed?"
	.onBeforeHandle(({user}) => {
		if(!user) return status(401)
	})

	// Route for public info
	.get('/api/public/', () => { 
		console.log('Server: This is public information')
		return { message: 'Client: This is public information' }
	})

	// Route for protected info
	.get(
		'/api/protected/',
		({user}) => { 
			if (user.role !== "admin") return status(401)
			console.log("Server: Only admin should be able to see this")
			return { message: "Client: Only admin should be able to see this", user: user }
		}
	)

	.listen(3000)


console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)

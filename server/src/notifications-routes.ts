import WebPush from 'web-push'
import { FastifyInstance } from "fastify"
import { z } from 'zod'

const publicKey = 'BCxwlT7VjTQYy4mdFgtwdiaeWqfnrPi3cj319_frQf18NlPZLk1eRutkvXaL2QStlumrsZJqakFQhnbzoU_8XS0'
const privateKey = '6Kjy08DnA2iAvgssNbHUkaRd8oBe1ygaZXxs--iiifE'

WebPush.setVapidDetails('http://localhost:3333', publicKey, privateKey)

export async function notificationsRoutes(app: FastifyInstance) {
    app.get('/push/public_key', () => {
        return {
            publicKey,
        }
    })

    app.post('/push/register', (request, reply) => {
        return reply.status(201).send()
    })

    app.post('/push/send', async (request, reply) => {
        const sendPushBody = z.object({
            subscription: z.object({
                endpoint: z.string(),
                keys: z.object({
                    p256dh: z.string(),
                    auth: z.string()
                })
            })
        })

        const { subscription } = sendPushBody.parse(request.body)

        WebPush.sendNotification(subscription, 'HELLO DO BACKEND')

        return reply.status(201).send()
    })
}

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function feedbackStoragePlugin() {
  return {
    name: 'feedback-storage-plugin',
    configureServer(server) {
      server.middlewares.use('/api/feedback', (req, res) => {
        const filePath = path.resolve(__dirname, 'feedback.json')
        
        if (req.method === 'POST') {
          let body = ''
          req.on('data', chunk => {
            body += chunk
          })
          req.on('end', () => {
            try {
              const data = JSON.parse(body || '{}')
              data.id = 'fb_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4)
              data.createdAt = new Date().toISOString()

              let feedbacks = []
              if (fs.existsSync(filePath)) {
                try {
                  const content = fs.readFileSync(filePath, 'utf-8').trim()
                  if (content) feedbacks = JSON.parse(content)
                } catch {
                  feedbacks = []
                }
              }
              feedbacks.push(data)
              fs.writeFileSync(filePath, JSON.stringify(feedbacks, null, 2), 'utf-8')

              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: true, count: feedbacks.length, feedback: data }))
            } catch (err) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: err.message }))
            }
          })
        } else if (req.method === 'GET') {
          try {
            let feedbacks = []
            if (fs.existsSync(filePath)) {
              const content = fs.readFileSync(filePath, 'utf-8').trim()
              if (content) feedbacks = JSON.parse(content)
            }
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: true, count: feedbacks.length, feedbacks }))
          } catch (err) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: err.message }))
          }
        } else {
          res.statusCode = 404
          res.end()
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), feedbackStoragePlugin()],
  build: {
    outDir: 'dist',
  },
})


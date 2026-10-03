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
        const feedbackDir = path.resolve(__dirname, 'feedback')
        if (!fs.existsSync(feedbackDir)) {
          fs.mkdirSync(feedbackDir, { recursive: true })
        }
        const summaryFile = path.resolve(feedbackDir, 'feedbacks.json')
        
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

              // 1. Update aggregated list in feedback/feedbacks.json
              let feedbacks = []
              if (fs.existsSync(summaryFile)) {
                try {
                  const content = fs.readFileSync(summaryFile, 'utf-8').trim()
                  if (content) feedbacks = JSON.parse(content)
                } catch {
                  feedbacks = []
                }
              }
              feedbacks.push(data)
              fs.writeFileSync(summaryFile, JSON.stringify(feedbacks, null, 2), 'utf-8')

              // 2. Also write an individual JSON file for this feedback in feedback/
              const safeName = (data.name || 'anonymous').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 20)
              const individualFile = path.resolve(feedbackDir, `feedback_${Date.now()}_${safeName}.json`)
              fs.writeFileSync(individualFile, JSON.stringify(data, null, 2), 'utf-8')

              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: true, count: feedbacks.length, feedback: data, savedTo: individualFile }))
            } catch (err) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: err.message }))
            }
          })
        } else if (req.method === 'GET') {
          try {
            let feedbacks = []
            if (fs.existsSync(summaryFile)) {
              const content = fs.readFileSync(summaryFile, 'utf-8').trim()
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


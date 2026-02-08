const express = require('express')
const cors = require('cors')
const multer = require('multer')
const { MongoClient, GridFSBucket, ObjectId } = require('mongodb')
const { Readable } = require('stream')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI

app.use(cors())
app.use(express.json())

const upload = multer({ storage: multer.memoryStorage() })

let db
let bucket

async function connectDb() {
  if (db && bucket) return
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is missing in .env')
  }
  const client = new MongoClient(MONGODB_URI)
  await client.connect()
  db = client.db()
  bucket = new GridFSBucket(db, { bucketName: 'photos' })
}

app.post('/api/registrations', upload.single('photo'), async (req, res) => {
  try {
    await connectDb()
    const { name, age, bikeNo } = req.body
    const file = req.file

    if (!name || !age || !bikeNo || !file) {
      return res.status(400).json({ message: 'All fields are required.' })
    }

    const uploadStream = bucket.openUploadStream(file.originalname, {
      contentType: file.mimetype,
      metadata: { name, age, bikeNo }
    })

    Readable.from(file.buffer)
      .pipe(uploadStream)
      .on('error', () => {
        res.status(500).json({ message: 'Upload failed.' })
      })
      .on('finish', () => {
        res.json({
          message: 'Registration received.',
          data: {
            name,
            age,
            bikeNo,
            photoId: uploadStream.id
          }
        })
      })
  } catch (err) {
    res.status(500).json({ message: 'Server error.' })
  }
})

app.get('/api/photos/:id', async (req, res) => {
  try {
    await connectDb()
    const fileId = new ObjectId(req.params.id)
    const downloadStream = bucket.openDownloadStream(fileId)
    downloadStream.on('error', () => {
      res.status(404).json({ message: 'Photo not found.' })
    })
    downloadStream.pipe(res)
  } catch (err) {
    res.status(400).json({ message: 'Invalid photo id.' })
  }
})

app.get('/api/registrations/latest', async (req, res) => {
  try {
    await connectDb()
    const file = await db.collection('photos.files').find().sort({ uploadDate: -1 }).limit(1).next()
    if (!file) {
      return res.status(404).json({ message: 'No registrations found.' })
    }
    const { metadata } = file
    res.json({
      data: {
        name: metadata?.name || '',
        age: metadata?.age || '',
        bikeNo: metadata?.bikeNo || '',
        photoId: file._id
      }
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error.' })
  }
})

app.get('/api/registrations', async (req, res) => {
  try {
    await connectDb()
    const files = await db
      .collection('photos.files')
      .find()
      .sort({ uploadDate: -1 })
      .limit(50)
      .toArray()

    const data = files.map((file) => ({
      name: file.metadata?.name || '',
      age: file.metadata?.age || '',
      bikeNo: file.metadata?.bikeNo || '',
      photoId: file._id
    }))

    res.json({ data })
  } catch (err) {
    res.status(500).json({ message: 'Server error.' })
  }
})

app.delete('/api/registrations/:id', async (req, res) => {
  try {
    await connectDb()
    const fileId = new ObjectId(req.params.id)
    await bucket.delete(fileId)
    res.json({ message: 'Registration deleted.' })
  } catch (err) {
    res.status(400).json({ message: 'Delete failed.' })
  }
})

app.get('/api/health', (req, res) => {
  res.json({ ok: true })
})

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`)
})

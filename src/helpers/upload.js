const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/images')
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}.jpg`)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 20000000 },
  fileFilter(req, file, cb) {
    if (file.originalname.match(/\.(png)\b/)) {
      cb(null, true)
    } else {
      cb("File must be jpg or jpeg!", null)
    }
  }
})

module.exports = upload

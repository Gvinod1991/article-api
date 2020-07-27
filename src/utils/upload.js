const multer = require('multer')
const Path = require('path')
const cryptoRandomString = require('crypto-random-string');
const maxSize = 1 * 1000 * 1000; //1 MB  file size restriction 
function upload() {
  let storage = multer.diskStorage({
    destination: function (req, files, cb) {
      if (files.fieldname == 'topicImage') {
        cb(null, 'public/uploads/topics')
      } else if (files.fieldname == 'articleImage'){
        cb(null, 'public/uploads/articles')
      }
    },
    filename: function (req, files, cb) {
      cb(null, cryptoRandomString({ length: 20 }) + files.originalname)
    }
  })
  let fileFilter= function (req, file, cb) {
    try {

        if (file.mimetype == 'image/png' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/jpg') {
            cb(null, true)
        } else {
            return cb(new Error('Only specific extensions are allowed'))
        }
    } catch (e) {
        return cb(e)
    }
}
  const methods = {
    fileUpload: multer({
        storage: storage,
        fileFilter:fileFilter,
        limits: { fileSize: maxSize }
    })
  }
  return Object.freeze(methods)
}

module.exports = upload()

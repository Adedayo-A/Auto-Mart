const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');

cloudinary.config({
  cloud_name: 'ddf91r8gu',
  api_key: '724667567854695',
  api_secret: 'rKYUG6gXrlsWEmqOx_Sp4SNAsf8',
});

// Set The Storage Engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Check File Type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  }
  return cb('Error: Images Only!');
}

// Init Upload
const upload = multer({
  storage,
  limits: { fileSize: 1000000 },
  fileFilter(req, file, cb) {
    checkFileType(file, cb);
  },
}).single('myImage');

const respondErr = (err, res) => {
  console.log(err);
  res.status(500).json({
    status: 500,
    error: {
      message: 'error encountered',
    },
  });
};

const imgUploader = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      respondErr(err, res);
    } else if (req.file === undefined) {
      res.status(401).json({
        data: {
          msg: 'Error: No File Selected!',
        },
      });
    } else {
      const filepath = `public/uploads/${req.file.filename}`;
      cloudinary.uploader.upload(filepath, { tags: 'gotemps', resource_type: 'auto' })
        .then((file) => {
          console.log(`Public id of the file is ${file.public_id}`);
          console.log(`Url of the file is  ${file.url}`);
          const imageUrl = file.url;
          res.status(200).json({
            data: {
              msg: 'File Uploaded!',
              image_url: imageUrl,
            },
          });
        }).catch((err) => {
          if (err) {
            respondErr(err, res);
          }
        });
    }
  });
};

export default imgUploader;

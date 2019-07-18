const cloudinary = require('cloudinary').v2;
const jwt = require('jsonwebtoken');
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
  filename: function(req, file, cb) {
      cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  
// Init Upload
const upload = multer({
  storage,
  limits: {fileSize: 1000000 },
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single('myImage');

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
  cb('Error: Images Only!');
}

const imgUploader = (req, res) => {
  jwt.verify(req.token, process.env.JWT_KEY, (err, authData) => {
    const email = authData.user.email;
    if (err) {
      res.status(401).json({
        error: {
          message: 'error..invalid token',
        }
      });
    } else {
      upload(req, res, (err) => {
        if (err) {
          console.log(`error ${err}`);
          res.status(500).json({
            error: {
              msg: err,
            },
          });
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
                res.status(500).json({
                  error: {
                    msg: err,
                  },
                });
              }
            });
        }
        // }
      });
    }
  });
};

module.exports = {
  imgUploader,
};

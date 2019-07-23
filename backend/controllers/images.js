"use strict";

var cloudinary = require('cloudinary').v2;

var jwt = require('jsonwebtoken');

var multer = require('multer');

var path = require('path');

cloudinary.config({
  cloud_name: 'ddf91r8gu',
  api_key: '724667567854695',
  api_secret: 'rKYUG6gXrlsWEmqOx_Sp4SNAsf8'
}); // Set The Storage Engine

var storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function filename(req, file, cb) {
    cb(null, "".concat(file.fieldname, "-").concat(Date.now()).concat(path.extname(file.originalname)));
  }
}); // Init Upload

var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000
  },
  fileFilter: function fileFilter(req, file, cb) {
    checkFileType(file, cb);
  }
}).single('myImage'); // Check File Type

function checkFileType(file, cb) {
  // Allowed ext
  var filetypes = /jpeg|jpg|png|gif/; // Check ext

  var extname = filetypes.test(path.extname(file.originalname).toLowerCase()); // Check mime

  var mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  }

  cb('Error: Images Only!');
}

var imgUploader = function imgUploader(req, res) {
  jwt.verify(req.token, process.env.JWT_KEY, function (err, authData) {
    var email = authData.user.email;

    if (err) {
      res.status(401).json({
        error: {
          message: 'error..invalid token'
        }
      });
    } else {
      upload(req, res, function (err) {
        if (err) {
          console.log("error ".concat(err));
          res.status(500).json({
            error: {
              msg: err
            }
          });
        } else if (req.file === undefined) {
          res.status(401).json({
            data: {
              msg: 'Error: No File Selected!'
            }
          });
        } else {
          var filepath = "public/uploads/".concat(req.file.filename);
          cloudinary.uploader.upload(filepath, {
            tags: 'gotemps',
            resource_type: 'auto'
          }).then(function (file) {
            console.log("Public id of the file is ".concat(file.public_id));
            console.log("Url of the file is  ".concat(file.url));
            var imageUrl = file.url;
            res.status(200).json({
              data: {
                msg: 'File Uploaded!',
                image_url: imageUrl
              }
            });
          })["catch"](function (err) {
            if (err) {
              res.status(500).json({
                error: {
                  msg: err
                }
              });
            }
          });
        } // }

      });
    }
  });
};

module.exports = {
  imgUploader: imgUploader
};
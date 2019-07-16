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
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
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
  } else {
    cb('Error: Images Only!');
  }
}

var imgUploader = function imgUploader(req, res) {
  jwt.verify(req.token, process.env.JWT_KEY, function (err, authData) {
    var email = authData.user.email;

    if (err) {
      res.status(403).json({
        message: 'error..invalid token'
      });
    } else {
      upload(req, res, function (err) {
        if (err) {
          console.log('error ' + err);
          res.send({
            msg: err
          });
        } else {
          if (req.file == undefined) {
            res.send({
              msg: 'Error: No File Selected!'
            });
          } else {
            var file = "public/uploads/".concat(req.file.filename);
            cloudinary.uploader.upload(file, {
              tags: 'gotemps',
              resource_type: 'auto'
            }).then(function (file) {
              console.log('Public id of the file is  ' + file.public_id);
              console.log('Url of the file is  ' + file.url);
              var image_url = file.url;
              res.send({
                msg: 'File Uploaded!',
                image_url: image_url
              });
            })["catch"](function (err) {
              if (err) {
                console.log('error here' + err);
              }
            });
          }
        }
      });
    }
  });
};

module.exports = {
  imgUploader: imgUploader
};
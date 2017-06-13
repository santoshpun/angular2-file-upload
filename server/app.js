var express = require('express');
var ExifImage = require('exif').ExifImage;
var multer = require('multer');
var app = express();
var fs = require('fs');
var srcImage = "source_images/butterfly.jpg";
var desPath = "destination_images/";
var path = require('path');
var cors = require('cors');
var bodyParser = require('body-parser');
var fs = require('fs');
var sizeOf = require('image-size');

var storage = multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, './public/uploads');
	},
	filename: function (req, file, callback) {
		var datetimestamp = Date.now();
        callback(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
	}
});

var upload = multer({
		 storage: storage,
		 //check extension of uploaded files
		 fileFilter: function (req, file, cb) {
		 	//only image format file are supported
		 	var filetypes = /jpeg|jpg/;
		    var mimetype = filetypes.test(file.mimetype);
		    var extname = filetypes.test(path.extname(file.originalname).toLowerCase());

		    if (mimetype && extname) {
		      return cb(null, true);
		    }
		    cb("Error: File upload only supports the following filetypes - " + filetypes);
		 }
		}).single('file');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//serve static files
app.use("/public", express.static(path.join(__dirname, 'public')));

//server base url
app.get('/', function (req, res) {
	res.sendFile(__dirname + "/index.html");
});

//upload api for user photo
app.post('/api/photo', function (req, res) {
	//console.log(req.file.ext);

	upload(req, res, function (err) {
        if (err) {
            res.json({error_code: 1, err_desc: err, message: 'Error while processing your request'});
            return;
        }

        console.log(req.file);

        fs.stat('./public/uploads/'+req.file.filename, function (err, stats) {
		   if (err) {
		       return console.error(err);
		   }

		   var dimensions = sizeOf('./public/uploads/'+req.file.filename);
		   console.log(dimensions.width, dimensions.height);

		   console.log('Image uploaded successfully.');

        		res.json({error_code: 0, err_desc: null, filename: req.file.filename});

		   //check if image dimension match
		   // if(dimensions.width == 2880 && dimensions.height == 1800){
		   // 		console.log('Image uploaded successfully.');

     //    		res.json({error_code: 0, err_desc: null, filename: req.file.filename});
		   // }else{
		   // 		 fs.unlink('./public/uploads/'+req.file.filename,function(err){
				 //        if(err) return console.log(err);
				 //        console.log('file deleted successfully');
				 //   });  
		   // 		 res.json({error_code: 1, err_desc: "Image dimension must be 2880x1800", message: "Image dimension must be 2880x1800"});
		   // }
		});
    });
});


app.listen('3000', function () {
	console.log("connected to port 3000");
})
const multer = require('multer');
const path = require('path');
const fs = require("fs");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '/../../public/uploads/'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const fileExtension = `.${file.mimetype.split("/")[1]}`
        cb(null, uniqueSuffix + fileExtension);
    }
});

const upload = multer({ storage });

const deleteImage = (imageUrl) => {
    // todo
    const imagePath = path.resolve(__dirname, '../../' + imageUrl.split('http://localhost:3000/')[1])
    if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log(`Deleted image file: ${imagePath}`);
    } else {
        console.log(`Image file not found: ${imagePath}`);
    }
};

module.exports = {
    upload,
    deleteImage
};

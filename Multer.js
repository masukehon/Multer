const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public');
    },
    filename: (req, file, cb) => {
        const fileExtension = file.originalname.substring(file.originalname.lastIndexOf(".") + 1);
        cb(null, `${Date.now()}.${fileExtension}`);
    }
});

function fileFilter(req, file, cb) {
    if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png")
        return cb(new Error("Định dạng file không hợp lệ"));
    cb(null, true);
}

const upload = multer({ storage, fileFilter, limits: { fileSize: 10240000 } });

module.exports = { upload };
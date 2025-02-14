const express = require("express");
const router = express.Router()
const productController = require("../controllers/productController");
const multer = require('multer');
const path = require("path");
const {body} = require("express-validator");

const { createProductValidation } = require('../validations/productsValidation');

const storage = multer.diskStorage({
    destination:(req, file, cb) => {
        cb(null, path.join(__dirname, '../../public/img/imagenes-platos'))
    },
    filename :(req,file,cb) =>{
        const newFilename = file.fieldname + Date.now() + "-" + path.extname(file.originalname);
        cb( null, newFilename );
    } 
});

const upload = multer({ 
    storage: storage, 
    fileFilter: (req, file, cb)=>{
        const extensionesAceptadas = ['.jpg', '.png', '.txt'];

        const info = path.extname(file.originalname)

        const result = extensionesAceptadas.includes(info)

        //Se agrego esta linea de codigo//
        if(!result){
            req.file = file;
        }
        //------------------------------//

        cb(null, result);
    } 
})

router.get("/list", productController.list);
router.get("/detail/:id", productController.detail);
router.get("/create", productController.create);
router.post("/create", upload.single("image"), createProductValidation, productController.store);
router.get("/edit/:id", productController.edit);
router.put("/edit/:id", upload.single("image"), productController.update);
router.delete("/delete/:id", productController.destroy);

module.exports = router
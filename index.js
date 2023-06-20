import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import AWS from "aws-sdk";
import multer from "multer";
import multerS3 from 'multer-s3';
dotenv.config();

const s3 = new AWS.S3();
const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

try {
  mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(console.log("DB Connected"))
    .catch((err) => console.log("Error in url: ", err));
} catch (error) {
  console.log("DB not Connected");
}
const ProductSchema = mongoose.Schema(
  {
    ProductName: {
      type: String,
      required: true,
    },
    ProductPrice: {
      type: Number,
      required: true,
    },
    ProductMainImgUrl: {
      type: String,
      required: true,
    },
    ProductShortDesc: {
      type: String,
      required: true,
    },
    ProductLongDesc: {
      type: String,
      required: true,
    },
    ProductImgs: [
      {
        Img1: {
          type: String,
        },
        Img2: {
          type: String,
        },
        Img3: {
          type: String,
        },
      },
    ],
    ProductCategory: {
      type: String,
      required: true,
    },
    ProductSubCategory: {
      type: String,
      required: true,
    },
    ProductBrand: {
      type: String,
      required: true,
    },
    ProductSize: {
      type: String,
    },
    ProductQuantity: {
      type: Number,
      required: true,
    },
    ProductReviewRating: {
      type: String,
    },
    ProductReviewName: {
      type: String,
    },
    ProductReviewComment: {
      type: String,
    },
    created_at: { type: Date },
    updated_at: { type: Date, default: Date.now },
  },
  { versionKey: false },
  { strict: false }
);

const Products = new mongoose.model("Products", ProductSchema);

app.post("/AddProduct", (req, res) => {
  const {
    ProductName,
    ProductPrice,
    ProductMainImgUrl,
    ProductShortDesc,
    ProductLongDesc,
    ProductImgs,
    ProductCategory,
    ProductSubCategory,
    ProductBrand,
    ProductSize,
    ProductQuantity,
    ProductReviewRating,
    ProductReviewName,
    ProductReviewComment,
  } = req.body;
  const UploadProduct = new Products({
    ProductName,
    ProductPrice,
    ProductMainImgUrl,
    ProductShortDesc,
    ProductLongDesc,
    ProductImgs,
    ProductCategory,
    ProductSubCategory,
    ProductBrand,
    ProductSize,
    ProductQuantity,
    ProductReviewName,
    ProductReviewRating,
    ProductReviewComment,
  });
  UploadProduct.save()
    .then((res) => {
      res.status(200).send({ message: "Item Added", Data: res });
    })
    .catch((err) => {
      console.log("unable to save to db", err);
      res.status(402).send("unable to save to database");
    });
});

const s3Storage = multerS3({
  s3: s3, // s3 instance
  bucket: process.env.CYCLIC_BUCKET_NAME, // change it as per your project requirement
  acl: "public-read", 
  metadata: (req, file, cb) => {
    cb(null, { fieldname: file.fieldname });
  },
  key: (req, file, cb) => {
    const fileName =
      Date.now() + "_" + file.fieldname + "_" + file.originalname;
    cb(null, fileName);
  },
});

const uploadImage = multer({
  storage: s3Storage,
  limits: {
    fileSize: 1024 * 1024 * 2, // 2mb file size
  },
});

app.post("/uploadImage", uploadImage.single("image"), async (req, res) => {
  let data = {};
  if (req.file) {
    data.image = req.file.location;
    console.log(req.file.location);
  }
  res.send(data);
  console.log(data);

});

app.get("/", (req, res) => {
  res.send("GET Request Called");
});

app.listen(PORT, () => console.log("server is running on " + PORT));

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

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
    ProductMRP:{
      type: Number,
      required:true
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
    ProductColor:{
      type:String,
    },
    ProductPriceTag:{
      type:String,
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
    ProductMRP,
    ProductPrice,
    ProductMainImgUrl,
    ProductShortDesc,
    ProductLongDesc,
    ProductImgs:[{
      Img1,
      Img2,
      Img3,
    }],
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
    ProductMRP,
    ProductPrice,
    ProductMainImgUrl,
    ProductShortDesc,
    ProductLongDesc,
    ProductImgs:[{
      Img1,
      Img2,
      Img3,
    }],
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
    .then((item) => {
      res.send({ message: "Item Added", Data: item });
    })
    .catch((err) => {
      console.log("unable to save to db", err);
      res.send("unable to save to database");
    });
});

app.get("/", (req, res) => {
  res.send("GET Request Called");
});

app.listen(PORT, () => console.log("server is running on " + PORT));

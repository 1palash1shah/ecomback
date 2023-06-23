import express from "express";
import { connect, model, Schema } from "mongoose";
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
  connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(console.log("DB Connected"))
    .catch((err) => console.log("Error in url: ", err));
} catch (error) {
  console.log("DB not Connected");
}

const AdminSchema = Schema(
  {
    AdminUsername: {
      type: String,
    },
    AdminPassword: {
      type: String,
    },
  },
  { versionKey: false },
  { strict: false }
);

const VendorSchema = Schema(
  {
    VendorUsername: {
      type: String,
    },
    VendorPassword: {
      type: String,
    },
  },
  { versionKey: false },
  { strict: false }
);

const ProductSchema = Schema(
  {
    ProductName: {
      type: String,
      required: true,
    },
    ProductMRP: {
      type: Number,
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
    ProductColor: {
      type: String,
    },
    ProductPriceTag: {
      type: String,
    },
    ProductSize: {
      type: String,
    },
    ProductQuantity: {
      type: Number,
      required: true,
    },
    ProductReviewerUserId: [
      {
        RevieweruserID: { type: String },
      },
    ],
    VendorId: {
      type: String,
      required: true,
    },
    RewardCoin: {
      type: Number,
      default: 0,
    },
    Status: {
      type: String,
      default: "Pending",
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  { versionKey: false },
  { strict: false }
);

const Products = new model("Products", ProductSchema);
const Vendor = new model("Vendor", VendorSchema);
const Admin = new model("Admin", AdminSchema);

app.post("/AdminLogin", (req, res) => {
  try {
    const { AdminUsername, AdminPassword } = req.body;
    Admin.findOne({ $and: [{ AdminUsername }, { AdminPassword }] })
      .then((item) => {
        res.send({ message: "Admin Login Successfully", data: item });
      })
      .catch((err) => {
        res.send({ message: "Can't Find Admin" });
      });
  } catch {
    res.send({ message: "Admin Login Failed" });
  }
});

app.post("/VendorLogin", (req, res) => {
  try {
    console.log(req.body);
    const { VendorUsername, VendorPassword } = req.body;
    Vendor.findOne({ $and: [{ VendorUsername }, { VendorPassword }] })
      .then((item) => {
        res.send({ message: "Vendor Login Successfully", data: item });
      })
      .catch((err) => {
        res.send({ message: "Can't Find Vendor" });
      });
  } catch {
    res.send({ message: "Vendor Login Failed" });
  }
});

app.post("/VendorRegister", (req, res) => {
  try {
    console.log(req.body);
    const { VendorUsername, VendorPassword } = req.body;
    const Vendors = new Vendor({
      VendorUsername,
      VendorPassword,
    });
    Vendors.save()
      .then((item) => {
        res.send({ message: "Vendor Registration Successfully", data: item });
      })
      .catch((err) => {
        res.send({ message: "Registration Failed" });
      });
  } catch {
    res.send({ message: "Registration Failed" });
  }
});

app.post("/AddProduct", (req, res) => {
  const {
    ProductName,
    ProductMRP,
    ProductPrice,
    ProductMainImgUrl,
    ProductShortDesc,
    ProductLongDesc,
    ProductImgs: [{ Img1, Img2, Img3 }],
    ProductCategory,
    ProductSubCategory,
    ProductBrand,
    ProductSize,
    ProductQuantity,
    ProductReviewerUserId: [{ RevieweruserID }],
    VendorId,
  } = req.body;

  const UploadProduct = new Products({
    ProductName,
    ProductMRP,
    ProductPrice,
    ProductMainImgUrl,
    ProductShortDesc,
    ProductLongDesc,
    ProductImgs: [{ Img1, Img2, Img3 }],
    ProductCategory,
    ProductSubCategory,
    ProductBrand,
    ProductSize,
    ProductQuantity,
    ProductReviewerUserId: [{ RevieweruserID }],
    VendorId,
  });
  UploadProduct.save()
    .then((item) => {
      res.send({ message: "Product Added", Data: item });
    })
    .catch((err) => {
      console.log("unable to save to db", err);
      res.send("unable to save to database");
    });
});

app.get("/getallproduct", (req, res) => {
  try {
    Products.find({ Status: { $eq: "Accepted" } }).sort({created_at:-1})
      .then((item) => {
        res.send({ data: item });
      })
      .catch((err) => {
        res.send("Can't Find Product");
      });
  } catch {
    res.send("db error");
  }
});

app.get("/getproduct/:id", (req, res) => {
  try {
    const { id } = req.params;
    Products.findOne({ _id: id })
      .then((item) => {
        res.send({ data: item });
      })
      .catch((err) => {
        res.send("Can't Find Product");
      });
  } catch {
    res.send("db error");
  }
});

app.get("/getallproduct/Vendor/:id", (req, res) => {
  try {
    const { id } = req.params;
    Products.find({ VendorId: { $eq: id } }).sort({created_at:-1})
      .then((item) => {
        res.send({ data: item });
      })
      .catch((err) => {
        res.send("Can't Find Product");
      });
  } catch {
    res.send("db error");
  }
});

app.get("/getallproduct/Admin", (req, res) => {
  try {
    Products.find({})
      .then((item) => {
        res.send({ data: item });
      })
      .catch((err) => {
        res.send("Can't Find Product");
      });
  } catch {
    res.send("db error");
  }
});

app.get("/", (req, res) => {
  res.send("GET Request Called");
});

app.listen(PORT, () => console.log("server is running on " + PORT));

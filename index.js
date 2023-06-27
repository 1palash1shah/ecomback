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

const CustomerSchema = Schema(
  {
    FirstName: {
      type: String,
      required: true,
    },
    LastName: {
      type: String,
      required: true,
    },
    Email: {
      type: String,
      reqired: true,
    },
    Mobile: {
      type: Number,
      reqired: true,
    },
    Gender: {
      type: String,
      reqired: true,
    },
    Password: {
      type: String,
      required: true,
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
const Customer = new model("Customer", CustomerSchema);

app.post("/Login", (req, res) => {
  try {
    const { Email, Password } = req.body;
    Customer.findOne({ $and: [{ Email }, { Password }] })
      .then((item) => {
        if(item !== null){

          res.send({ message: "Login Successfully", data: item,success:true });
        }else{
          res.send({ message: "Username or Password Incorrect", data: item ,success:false});
        }
      }
      )
      .catch((err) => {
        res.send({ message: "Username or Password Incorrect" });
      });
  } catch {
    res.send({ message: "Customer Login Failed" });
  }
});

app.post("/Register", (req, res) => {
  try {
    const { FirstName, LastName, Email, Mobile, Gender, Password } = req.body;
    const customers = new Customer({
      FirstName,
      LastName,
      Email, 
      Mobile,
      Gender,
      Password,
    });
    customers
      .save()
      .then((item) => {
        res.send({ message: "User Registered", data: item });
      })
      .catch((err) => {
        res.send({ message: "Try Again" });
      });
  } catch {
    res.send({ message: "Register Failed" });
  }
});

app.post("/AdminLogin", (req, res) => {
  try {
    const { AdminUsername, AdminPassword } = req.body;
    Admin.findOne({ $and: [{ AdminUsername }, { AdminPassword }] })
      .then((item) => {
        res.send({ message: "Admin Login Successfully", data: item });
      })
      .catch((err) => {
        res.send({ message: "Admin Incorrect" });
      });
  } catch {
    res.send({ message: "Admin Login Failed" });
  }
});

app.post("/VendorLogin", (req, res) => {
  try {
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

app.delete("/deleteProduct/:id", (req, res) => {
  const { id } = req.params;
  try {
    Products.deleteOne({ _id: id })
      .then((item) => {
        res.send({ message: "Item Deleted" });
      })
      .catch((err) => {
        res.send({ message: "Error in Deleting" });
      });
  } catch {
    res.send({ message: "Error in Product Delete" });
  }
});

app.get("/getallproduct", (req, res) => {
  try {
    Products.find({ Status: { $eq: "Accepted" } })
      .sort({ created_at: -1 })
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
    Products.find({ VendorId: { $eq: id } })
      .sort({ created_at: -1 })
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
    Products.find()
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

app.post("/ProductUpdateStatus", (req, res) => {
  const { id, Statusmsg } = req.body;
  try {
    Products.updateOne({ _id: id }, { Status: Statusmsg })
      .then((item) => {
        res.send({ message: "Update Successfully" });
      })
      .catch((err) => {
        res.send({ message: "Can't Update Product" });
      });
  } catch {
    res.send("db error");
  }
});

app.get("/", (req, res) => {
  res.send("GET Request Called");
});

app.get("/VendorList", (req, res) => {
  try{
    Vendor.find()
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
app.listen(PORT, () => console.log("server is running on " + PORT));

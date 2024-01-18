import express from "express";
import mongoose, { model, Schema } from "mongoose";
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

const connectionString = 'mongodb+srv://palashshah:palashshah@cluster0.mongodb.net/Ecommerce?retryWrites=true&w=majority';

mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error.message);
  });

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
    },
    ProductMRP: {
      type: Number,
    },
    ProductPrice: {
      type: Number,
    },
    ProductMainImgUrl: {
      type: String,
    },
    ProductShortDesc: {
      type: String,
    },
    ProductLongDesc: {
      type: String,
    },
    ProductCategory: {
      type: String,
    },
    ProductSubCategory: {
      type: String,
    },
    ProductBrand: {
      type: String,
    },
    ProductColor: {
      type: String,
    },
    ProductSize: {
      type: String,
    },
    ProductQuantity: {
      type: Number,
    },
    Status: {
      type: String,
      default: "Accepted",
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  { versionKey: false },
  { strict: false }
);

const OrderSchema = Schema(
  {
    UserId: {
      type: String,
    },
    ProductId: {
      type: String,
    },
    ProductName: {
      type: String,
    },
    ProductPrice: {
      type: Number,
    },
    ProductColor: {
      type: String,
    },
    ProductSize: {
      type: String,
    },
    ProductQuantity: {
      type: Number,
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
const Admin = new model("Admin", AdminSchema);
const Customer = new model("Customer", CustomerSchema);
const Orders = new model("Orders", OrderSchema);

app.post("/Login", (req, res) => {
  try {
    const { Email, Password } = req.body;
    Customer.findOne({ $and: [{ Email }, { Password }] })
      .then((item) => {
        if (item !== null) {
          res.send({
            message: "Login Successfully",
            data: item,
            success: true,
          });
        } else {
          res.send({
            message: "Username or Password Incorrect",
            data: item,
            success: false,
          });
        }
      })
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
  console.log(req.body);
  try {
    const { AdminUsername, AdminPassword } = req.body;
    Admin.findOne({ $and: [{ AdminUsername }, { AdminPassword }] })
      .then((item) => {
        if (item !== null) {
          res.send({ message: "Admin Login Successfully", data: item });
        } else {
          res.send({ message: "Username or Password Incorrect", data: item });
        }
      })
      .catch((err) => {
        res.send({ message: "Admin Incorrect" });
      });
  } catch {
    res.send({ message: "Admin Login Failed" });
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
    ProductCategory,
    ProductSubCategory,
    ProductBrand,
    ProductSize,
    ProductColor,
    ProductQuantity,
  } = req.body;

  console.log(req.body);
  const UploadProduct = new Products({
    ProductName,
    ProductMRP,
    ProductPrice,
    ProductMainImgUrl,
    ProductShortDesc,
    ProductLongDesc,
    ProductCategory,
    ProductSubCategory,
    ProductBrand,
    ProductSize,
    ProductColor,
    ProductQuantity,
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

app.delete("/Orders/delete/:id", (req, res) => {
  const { id } = req.params;
  try {
    Orders.deleteOne({ _id: id })
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
app.post("/OrderUpdateStatus", (req, res) => {
  const { id, Statusmsg } = req.body;
  try {
    Orders.updateOne({ _id: id }, { Status: Statusmsg })
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
app.post("/UpdateProduct", (req, res) => {
  const { _id } = req.body;
  try {
    Products.updateOne({ _id: _id }, req.body)
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

app.post("/Order/Placed", async (req, res) => {
  try {
    await Promise.all(
      req.body.map(async (item) => {
        const {
          UserId,
          ProductName,
          ProductPrice,
          ProductColor,
          ProductSize,
          ProductQuantity,
          _id,
        } = item;

        const Order = new Orders({
          UserId,
          ProductName,
          ProductPrice,
          ProductColor,
          ProductSize,
          ProductQuantity,
          ProductId: _id,
        });

        await Order.save();
      })
    );

    // Send a success response
    res.send({ message: "Order Placed" });
  } catch (error) {
    // Handle errors and send a failure response
    console.error(error);
    res.status(500).send({ message: "Order Fail" });
  }
});

app.get("/Orders/List", async (req, res) => {
  try {
    // Execute the query and await the result
    const resp = await Orders.find();

    // Check if there is any data
    if (resp && resp.length > 0) {
      res.send({ data: resp });
    } else {
      // If no data is found
      res.send({ message: "No orders found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "DB error" });
  }
});

app.listen(PORT, () => console.log("server is running on " + PORT));

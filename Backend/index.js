 const dotenv = require("dotenv");
dotenv.config();
const http =require("http");
const helmet = require("helmet");
const compression =require("compression");
const config= require("config");
//const RegulationFrom = require('./db/RegulationFrom');  //const Server = require('/Server');
const stringify = require('safe-stable-stringify');
//const insertRegulation = require("./db/insertRegulation")
const Regulation = require('./db/Regulation');  // go one level up from 'db' to 'models'
const Gazette = require('./db/Govgazette2');  
 // Assuming gazetteRoutes.js is inside /routes
const regulationRoutes = require('./db/regulationRoutes'); // Import the routes
const PORT =  5001;
const express = require("express");
const  cors = require("cors");
require("./db/config"); // Import the database connection
const User = require("./db/user"); // Import the user model
const Product = require("./db/Product"); // Import product model
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const app = express();
const jwtKey = "e-com"; // Use a single secret key for JWT
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
const Direction = require("./db/Direction");
const directionRoutes = require("./db/directionRoutes"); // Import routes
app.use("/api", directionRoutes); 
app.use(cors({ origin: "*" }));

const multer = require("multer");
const Register = require('./db/register');

const gazetteRoutes = require('./db/gazetteRoutes');
app.use('/api', gazetteRoutes);

const gazetteRoutes2 = require('./db/gazetteRoutes2');
app.use('/gazette2', gazetteRoutes2);



const loginRoutes = require("./db/loginRoutes"); 
app.use("/", loginRoutes); 


app.use(gazetteRoutes2);
const deleteDirectionRoutes = require("./db/deleteDirection"); // Path to the file
app.use(deleteDirectionRoutes);
// const updateDirection = require("./db/updateDirection");
// app.use(updateDirection)
const circularRoutes = require('./db/circularRoutes');
app.use('/api', circularRoutes);
const notificationRoutes = require('./db/notificationRoutes');
app.use("/Notification", notificationRoutes); 
const statuteRoutes = require("./db/statuteRoutes");
app.use("/api", statuteRoutes);
const ordinanceRoutes = require('./db/ordinanceRoutes');
app.use("/Ordinances", ordinanceRoutes);
const userRoutes = require("./db/userRoutes");
app.use("/api/user",userRoutes);
app.use('/regulations', regulationRoutes);
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"))
// Default route for undefined paths
app.use((req, res) => {
  res.status(404).send(`Cannot ${req.method} ${req.url}`);
});
app.use('/api', directionRoutes);
const path = require("path"); 
const { configDotenv } = require("dotenv");
// Static file serving for uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use('/api', regulationRoutes);

app.post("/register", async(req, res) => {
  const { name, email, password } = req.body;
  console.log(req.body);

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Mock user data (replace with DB logic in production)
  const newUser =  await Register.create({name, email, password });

  // Return a success response
  return res.status(200).json({
    result: newUser
    
  });
});


// Middleware to verify token
function verifyToken(req, res, next) {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(403).send({ message: "Token is missing" });
    }
    try {
        const verified = jwt.verify(token, jwtKey);
        req.user = verified; // Attach verified user data to the request object if needed
        next();
    } catch (error) {
        console.error("Invalid token:", error);
        res.status(401).send({ message: "Invalid token" });
    }
}



//Get all products
app.get("/products", async (req, res) => {
    try {
        const products = await Product.find();
        if (products.length > 0) {
            res.send(products);
        } else {
            res.send({ result: "No product found" });
        }
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send({ message: "Error fetching products" });
    }
});


// // Get a product by ID
app.get("/product/:id", async (req, res) => {
    try {
        const result = await Product.findOne({ _id: req.params.id });
        if (result) {
            res.send(result);
        } else {
            res.send({ result: "No Record Found" });
        }
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).send({ message: "Error fetching product" });
    }
});




//-----------------------------------------------add-product--------------------------------------------------
app.post("/add-product", async (req, res) => {
    try {
      const { name, price, category, company,  } = req.body;
      
      // Validate required fields
      if (!name || !price || !category || !company ) {
        return res.status(400).json({ success: false, message: "All fields are required." });
      }
  
      console.log(req.body)
      // Save product
      const newProduct = new Product(req.body);
      const result = await newProduct.save();
      res.status(200).json({message:"product added succesfully", success: true, product: result });
    } catch (error) {
      console.error("Error adding product:", error.message);
      res.status(500).json({ success: false, message: "Server error.", error: error.message });
    }
  });


//-------------------------------------------------correct code-----------------------------------



//PUT: Update a regulation by ID
app.put('/updateRegulation/:id', async (req, res) => {
  const { id } = req.params; // Get the regulation ID from the URL parameter
  const updatedData = req.body; // Get the data from the request body

  try {
    // Find and update the regulation with the provided ID
    const updatedRegulation = await Regulation.findByIdAndUpdate(id, updatedData, { new: true });

    // If regulation not found
    if (!updatedRegulation) {
      return res.status(404).json({ message: 'Regulation not found' });
    }

    // Successfully updated
    res.status(200).json({ message: 'Regulation updated successfully', data: updatedRegulation });
  } catch (error) {
    console.error('Error updating regulation:', error);
    res.status(500).json({ message: 'Error updating regulation. Please try again.', error });
  }
});


app.post('/add-product', async (req, res) => {
  try {
    const { name, price, category, company, userId } = req.body;

    // Validate request data
    if (!name || !price || !category || !company || !userId) {
      return res.status(400).json({ success: false, message: 'Invalid input' });
    }

    // Add product logic here
    console.log('Product data received:', req.body);
    res.json({ success: true, message: 'Product added successfully!' });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});



//----------------------------this is backend code -----------------------------------------------




const authenticateToken = (req, res, next) => {
const token = req.header("Authorization")?.split(" ")[1];

if (!token) {
  return res.status(401).json({ error: "Access denied. No token provided." });
}

try {
  const verified = jwt.verify(token, JWT_SECRET);
  req.user = verified; // Attach user data to request object
  next();
} catch (err) {
  res.status(403).json({ error: "Invalid token" });
}
}

app.get('/search/:query', async (req, res) => {
const { query } = req.params;
try {
  const results = await Circular.find({
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { draftRegulation: { $regex: query, $options: 'i' } },
      { finalRegulation: { $regex: query, $options: 'i' } },
      { section: { $regex: query, $options: 'i' } },
    ],
  });
  res.json(results);
} catch (error) {
  res.status(500).send(error.message);
}
});

  //app.use("/api", productRoutes);

app.post("/add-product", async (req, res) => {
  try {
    const result = await fetch("http://localhost:5001/add-product", {
        method: "POST",
        body: JSON.stringify({ name, price, category, company}),
        headers: {
            "Content-Type": "application/json",
        },
    });
  
    if (!result.ok) {
        throw new Error(`HTTP error! Status: ${result.status}`);
    }
  
    const response = await result.json();
    console.log("Response from server:", response);
  
    if (response.success) {
        alert("Product added successfully!");
        setName("");
        setPrice("");
        setCategory("");
        setCompany("");
    } else {
        alert(response.message || "Failed to add product. Please try again.");
    }
  } catch (error) {
    console.error("Error while adding product:", error.message);
    alert("An error occurred. Please try again.");
  }
  
  
  app.post("/add-product", async (req, res) => {
    console.log("Request body:", req.body);
    // Rest of the code...
  });
});


app.get("/products", async (req, res) => {
  try {
      const products = await Product.find();
      if (products.length > 0) {
          res.send(products);
      } else {
          res.send({ result: "No product found" });
      }
  } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).send({ message: "Error fetching products" });
  }
});



// Update product by ID
app.put("/product/:id", async (req, res) => {
    try {
        const result = await Product.updateOne({ _id: req.params.id }, { $set: req.body });
        res.send(result);
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).send({ message: "Error updating product" });
    }
});

// Delete product by ID
app.delete("/product/:id", async (req, res) => {
    try {
        const result = await Product.deleteOne({ _id: req.params.id });
        if (result.deletedCount === 0) {
            return res.status(404).send({ message: "Product not found" });
        }
        res.status(200).send({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).send({ message: "Error deleting product" });
    }
});

const user = [];

// Example protected route
app.get("/DisplayData", authenticateToken, (req, res) => {
  res.json({ message: "Protected route accessed!", user: req.user });
});


app.use(bodyParser.json());

app.post('/insertRegulation', (req, res) => {
  const { date, direction, rule, ordinance, statute, notification, circular, govtGazette } = req.body;

  if (!date || !direction || !rule) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Simulate database insertion (replace with actual DB logic)
  console.log('Received data:', req.body);

  res.status(200).json({ message: 'Data inserted successfully' });
});

app.post('/api/submit', (req, res) => {
  const { name } = req.body;
  console.log(`Received submission: ${name}`);
  // You can handle the submission (e.g., save to a database) here

  // Send a response back to the client
  res.json({ message: 'Submission received', name });
});

app.use('/gazette', gazetteRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});











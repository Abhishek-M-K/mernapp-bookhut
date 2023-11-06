const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const jwt = require("jsonwebtoken");
const imageDownloader = require("image-downloader");
const User = require("./models/User");
const Place = require("./models/Place.js");
const Booking = require("./models/Booking.js");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const fs = require("fs");
require("dotenv").config();
const app = express();

//create bcrypt salt for hashing the password, generating a secret string
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "hsgjdhfkahjkkfhdsfdsfkjd"; //random string
// app.use("/uploads", express.static(path.join(__dirname, "/../uploads")));

// app.use("/uploads", express.static('/uploads'));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));
// app.use(express.static(path.join(__dirname, "../client/dist")));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../client/dist/index.html"));
// });

//frontend and api server endpoint
//using cors for endpoint establishment
app.use(
  cors({
    credentials: true,
    origin: "https://mernapp-bookhut-5jqm.vercel.app/",
  })
);

//middle --> mongoose database connection
//using .env file for cluster connection
//using dotenv package
// console.log(process.env.MONGO_URL); connection established
mongoose.connect(process.env.MONGO_URL);

app.get("/test", (req, res) => {
  res.json("test ok");
});

//async await function
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userData = await User.create({
      name,
      email,
      //rn password is clear text, to encrypt/hashing we'll use bcryptjs
      password: bcrypt.hashSync(password, bcryptSalt), //params should be strings, but since here bcrytSalt is an object , we declare it with Sync
    });
    res.json(userData);
  } catch (e) {
    res.status(422).json(e);
    //422 status code for unprocesible entity
    //this is when an user already exists with same email id
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  //find user with the email
  const userData = await User.findOne({ email });
  if (userData) {
    // res.json("found");
    const passCorrect = bcrypt.compareSync(password, userData.password);
    if (passCorrect) {
      //creating token that needs to be passed as cookie along with the response json using JWT :)
      jwt.sign(
        {
          email: userData.email,
          id: userData._id,
          name: userData.name,
        },
        jwtSecret,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json(userData);
        }
      );
      //res.json("password is ok");
    } else {
      res.status(422).json("password is wrong");
    }
  } else {
    res.json("not found");
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    // params 4
    // 1. token 2. secret salt key used for hashing 3. options {object} 4. call back func
    // we have a call back funcn for err and data of the user
    jwt.verify(token, jwtSecret, {}, (err, data) => {
      if (err) throw err;
      res.json(data);
    });
  } else {
    res.json(null);
  }
  res.json({ token });
});

//logout
app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

// console.log({ __dirname });
//adding photos by link
app.post("/upload-by-link", async (req, res) => {
  const { link } = req.body;
  const newName = "photo" + Date.now() + ".jpg";
  await imageDownloader.image({
    url: link,
    dest: __dirname + "/uploads/" + newName,
  });
  res.json(newName);
});

//uploading photos
const photosMiddleware = multer({ dest: "uploads/" });
app.post("/upload", photosMiddleware.array("photos", 100), (req, res) => {
  const uploadedFiles = [];
  // to keep the track of photos uploaded for a dest
  //to make webp extension to jpg / jpeg
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const parts = originalname.split("."); // the orginal name will be separated by . and thus we can change extension
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace("uploads/", ""));
  }

  //res.json(req.files); //this before changing the ext
  res.json(uploadedFiles);
});

app.post("/places", (req, res) => {
  const { token } = req.cookies;
  const {
    title,
    address,
    addedPhotos,
    description,
    price,
    perks,
    checkIn,
    checkOut,
    maxGuests,
  } = req.body;
  console.log(req.body);
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.create({
      owner: userData.id,
      price,
      title,
      address,
      photos: addedPhotos,
      description,
      perks,
      checkIn,
      checkOut,
      maxGuests,
    });
    res.json(placeDoc);
  });
});

app.get("/user-places", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    const { id } = userData;
    res.json(await Place.find({ owner: id }));
  });
});

app.get("/places/:id", async (req, res) => {
  const { id } = req.params;
  res.json(await Place.findById(id));
});

app.put("/places", async (req, res) => {
  //const { id } = req.params;
  const { token } = req.cookies;
  const {
    id,
    title,
    address,
    addedPhotos,
    description,
    perks,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    const placeDoc = await Place.findById(id);
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title,
        address,
        photos: addedPhotos,
        description,
        perks,
        checkIn,
        checkOut,
        maxGuests,
        price,
      });
      await placeDoc.save();
      res.json("ok");
    }
  });
});

app.get("/places", async (req, res) => {
  res.json(await Place.find());
});

app.post("/bookings", async (req, res) => {
  const userData = await getDataFromToken(req);
  const { place, checkIn, checkOut, guests, name, phone, price } = req.body;
  Booking.create({
    place,
    checkIn,
    checkOut,
    guests,
    name,
    phone,
    price,
    user: userData.id,
  })
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      throw err;
    });
});

function getDataFromToken(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      resolve(userData);
    });
  });
}

app.get("/bookings", async (req, res) => {
  const userData = await getDataFromToken(req);
  res.json(await Booking.find({ user: userData.id }).populate("place"));
});

app.listen(4000);

//dummy
//dummy2003

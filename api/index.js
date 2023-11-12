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
const mime = require("mime-types");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const fs = require("fs");
require("dotenv").config();
const app = express();
// app.use(
//   cors({
//     credentials: true,
//     origin: "https://mernapp-bookhut-5jqm.vercel.app/",
//   })
// );
//create bcrypt salt for hashing the password, generating a secret string
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "hsgjdhfkahjkkfhdsfdsfkjd"; //random string
const bucket = "bookhut-abhishek";

const corsConfig = {
  origin: "https://mernapp-bookhut-5jqm.vercel.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};
app.use(cors(corsConfig));
app.options("", cors(corsConfig));

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

async function uploadToS3(path, originalFilename, mimetype) {
  const client = new S3Client({
    region: "ap-south-1", //mumbai
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });

  const parts = originalFilename.split(".");
  const ext = parts[parts.length - 1];
  const newName = Date.now() + "." + ext;
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Body: fs.readFileSync(path),
      Key: newName,
      ContentType: mimetype,
      ACL: "public-read",
    })
  );
  return `https://${bucket}.s3.amazonaws.com/${newName}`;
  //console.log({ data });
}

function getDataFromToken(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      resolve(userData);
    });
  });
}

app.get("/test", (req, res) => {
  mongoose.connect(process.env.MONGO_URL);

  res.json("test ok");
});

//async await function
app.post("/register", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);

  const { name, email, password } = req.body;
  try {
    const userData = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt), //params should be strings, but since here bcrytSalt is an object , we declare it with Sync
    });
    res.json(userData);
  } catch (e) {
    res.status(422).json(e);
  }
});

app.post("/login", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);

  const { email, password } = req.body;
  //find user with the email
  const userData = await User.findOne({ email });

  if (!userData) {
    return res.status(404).json("User not found, Please register first");
  }

  const match = bcrypt.compare(password, userData.password);

  if (!match) {
    return res.status(401).json("Wrong Password");
  }

  const token = jwt.sign(
    { email: userData.email, id: userData._id },
    jwtSecret,
    { expiresIn: "1h" }
  );

  res.cookie("token", token, { httpOnly: true }).json(userData);
});

app.get("/profile", (req, res) => {
  mongoose.connect(process.env.MONGO_URL);

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
});

//logout
app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

//adding photos by link
app.post("/upload-by-link", async (req, res) => {
  const { link } = req.body;
  const newName = "photo" + Date.now() + ".jpg";
  await imageDownloader.image({
    url: link,
    dest: "/tmp/" + newName,
  });
  const url = await uploadToS3(
    "/tmp/" + newName,
    newName,
    mime.lookup("/tmp/" + newName)
  );
  res.json(url);
});

//uploading photos
const photosMiddleware = multer({ dest: "/tmp" });
app.post("/upload", photosMiddleware.array("photos", 100), async (req, res) => {
  const uploadedFiles = [];
  // to keep the track of photos uploaded for a dest
  //to make webp extension to jpg / jpeg
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname, mimetype } = req.files[i];
    const url = await uploadToS3(path, originalname, mimetype);
    uploadedFiles.push(url);
  }
  res.json(uploadedFiles);
});

app.post("/places", (req, res) => {
  mongoose.connect(process.env.MONGO_URL);

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
  mongoose.connect(process.env.MONGO_URL);

  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    const { id } = userData;
    res.json(await Place.find({ owner: id }));
  });
});

app.get("/places/:id", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);

  const { id } = req.params;
  res.json(await Place.findById(id));
});

app.put("/places", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);

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
    }
  });
});

app.get("/places", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);

  res.json(await Place.find());
});

app.post("/bookings", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);

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

app.get("/bookings", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);

  const userData = await getDataFromToken(req);
  res.json(await Booking.find({ user: userData.id }).populate("place"));
});

app.listen(4000);

import Data from "../model/sensorModel.js";
import User from "../model/userModel.js";
import Image from "../model/imageModel.js"
import image2 from "../model/imageModel2.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";
import multer from "multer";

//Register
export const userRegister = async (req, res) => {
  console.log(req.body);
  try {
    const newPassword = await bcrypt.hash(req.body.password, 10);
    await User.create({
      email: req.body.email,
      password: newPassword,
    });
    res.json({ status: "ok" });
  } catch (error) {
    res.json({ status: "error", error: "Duplicate email" });
  }
};

//login
export const userData = async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
  });
  if (!user) {
    return { status: "error", error: "Invalid User" };
  }
  const isPasswordVaild = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (isPasswordVaild) {
    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
      },
      "secret123"
    );
    return res.json({ status: "ok", user: token });
  } else {
    return res.json({ status: "error", user: false });
  }
};

//Insert
export const InsertData = async (req, res) => {
  const { density, viscosity, temperature, dtn } = req.query;

  if (!density || !viscosity || !temperature || !dtn) {
    return res.status(400).json({ error: "Missing required parameters" });
  }
  try {
    const newData = {
      density: density,
      viscosity: viscosity,
      temperature: temperature,
      dtn: dtn,
    };
    await Data.create(newData);
    res.status(200).json({ message: "Data inserted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//get
export const getSensor = async (req, res) => {
  try {
    const getsensor = await Data.find().sort({ updatedAt: -1 }).limit(1);
    res.status(200).json(getsensor);
  } catch (error) {
    res.status(500).json(error);
  }
};

//get
export const getallSensor = async (req, res) => {
  try {
    const getsensor = await Data.find().sort({ updatedAt: -1 }).limit(50);
    res.status(200).json(getsensor);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getLast = async (req, res) => {
  let { select } = req.query;
  try {
    const getLast5SensorData = await Data.find(
      {},
      { vibration: 1, updatedAt: 1, _id: 0 }
    )
      .sort({ updatedAt: -1 })
      .limit(15);

    const sensorDataWithTimestamp = getLast5SensorData.map((doc) => ({
      vibration: doc.vibration,
      updatedAt: doc.updatedAt,
    }));

    res.status(200).json(sensorDataWithTimestamp);
  } catch (error) {
    res.status(500).json(error);
  }
};

const credentials = {
  username: "aswin",
  password: "xtw83te>fabtnec",
  org_name: "XYMA",
};

const getAuthToken = async (credentials) => {
  try {
    const response = await axios.post(
      "https://nanoprecisedataservices.com/data-sharing/api/v2/auth",
      credentials
    );
    return response.data.token;
  } catch (error) {
    // throw new Error("Error fetching authentication token");
    console.log("Error fetching authentication token");
  }
};

export const getNano = async (req, res) => {
  try {
    const token = await getAuthToken(credentials);
    console.log(token);
    const response = await axios.get(
      "https://nanoprecisedataservices.com/data-sharing/api/v2/graphId",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getNanoGraph = async (req, res) => {
  let token = await getAuthToken(credentials);
  let { graphName, startDate, endDate } = req.query;
  const currentDate = Math.floor(Date.now() / 1000);
const thirtyDaysInSeconds = 30 * 86400;
const thirtyDaysAgo = currentDate - thirtyDaysInSeconds;

console.log("Current Date (Epoch):", currentDate);
console.log("30 Days Ago (Epoch):", thirtyDaysAgo);

  if (graphName === undefined) {
    graphName = "temperature";
  }
  if (startDate === undefined) {
    startDate = thirtyDaysAgo;
  }
  if (endDate === undefined) {
    endDate = currentDate;
    console.log("current", currentDate);
  }
  console.log(graphName);
  try {
    const response = await axios.get(
      "https://nanoprecisedataservices.com/data-sharing/api/v2/analytics/graph",
      {
        params: {
          graphId: `${graphName}`,
          tagIdList: "XYMA7fc929ceb79c4a36ab7ef3939c8595f1",
          timestampFrom: startDate,
          timestampTo: endDate,
          companyCode: "XYMA",
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json(error);
  }
};

// //Image
// const Storage = multer.diskStorage({
//   destination: "/Users/naveenkumar/Desktop/test/nano-image/src/upload",
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });
// const upload = multer({
//   storage: Storage,
// }).single("image");

// export const uploadImage = async (req, res) => {
//   upload(req, res, (err) => {
//     if (err) {
//       console.log(err);
//     } else {
//       const newImage = imageModel({
//         name: req.body.name,
//         temperature: req.body.temperature,
//         image: {
//           data: req.file.originalname,
//           contentType: "image/png",
//         },
//       });
//       newImage
//         .save()
//         .then(() => res.send("successfully uploaded.."))
//         .catch((err) => console.log(err));
//     }
//   });
// };

// //Image2
// const Storage2 = multer.diskStorage({
//   destination: "/Users/naveenkumar/Desktop/test/nano-image/src/upload2",
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });
// const upload2 = multer({
//   storage: Storage2,
// }).single("image");

// export const uploadImage2 = async (req, res) => {
//   upload2(req, res, (err) => {
//     if (err) {
//       console.log(err);
//     } else {
//       const newImage2 = imageModel2({
//         name: req.body.name,
//         alert: req.body.alert,
//         image: {
//           data: req.file.originalname,
//           contentType: "image/png",
//         },
//       });
//       newImage2
//         .save()
//         .then(() => res.send("successfully uploaded.."))
//         .catch((err) => console.log(err));
//     }
//   });
// };

//getImage
export const getImage = async (req, res) => {
  try {
    const getimage = await Image.find().sort({ updatedAt: -1 }).limit(1);
    res.status(200).json(getimage);
  } catch (error) {
    res.status(500).json(error);
  }
};

//getImage2
export const getImage2 = async (req, res) => {
  try {
    const getimage = await image2.find().sort({ updatedAt: -1 }).limit(1);
    res.status(200).json(getimage);
  } catch (error) {
    res.status(500).json(error);
  }
};

//image
export const upload = async (req, res) => {
  console.log(req.body.image);
  try {
    const newImageData = {
      name: req.body.name,
      temperature: req.body.temperature,
      image: req.body.image,
    };
    await Image.create(newImageData);
    res.status(200).json({ message: "Data inserted successfully" });
  } catch (err) {
    console.error('Error uploading image:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

//image2
export const upload2 = async (req, res) => {
  console.log(req.body.image);
  try {
    const newImageData2 = {
      name: req.body.name,
      alert: req.body.alert,
      image: req.body.image,
    };
    await image2.create(newImageData2);
    res.status(200).json({ message: "Data inserted successfully" });
  } catch (err) {
    console.error('Error uploading image:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

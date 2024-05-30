require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookueParser = require("cookie-parser");
const mongoose = require("mongoose");
const router = require("./router/index");
const errorMiddleware = require("./middlewares/error-middleware");
const path = require('path');

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cookueParser());
app.use(express.json());
app.use(
  cors({
    // origin: ['http://localhost:5173',"http://26.73.174.17:5173",'http://192.168.0.177:5173','http://26.162.108.48:5000'],
    origin: ['http://admin.fratelli.kz','http://localhost:5173', 'https://fratelli.kz','https://www.fratelli.kz'],
    credentials: true,
  })
);  
// Настроим путь к папке с загрузками
const uploadsDir = path.join(__dirname, 'uploads');

// Обслуживание статических файлов из папки uploads
app.use('/uploads', express.static(uploadsDir));
app.use("/api", router);
app.use(errorMiddleware);

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    app.listen(PORT, () =>
      console.log(`Server starter on PORT ${PORT}`)
    );
  } catch (e) {
    console.log(e);
  }
};

start();

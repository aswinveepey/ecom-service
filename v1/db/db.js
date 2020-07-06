const mongoose = require('mongoose')

if (process.env.NODE_ENV==="production"){
  mongoose
    .connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      socketTimeoutMS: 1000,
    })
    .then(() => console.log("MONGODB CONNECTION SUCCESFUL"))
    .catch((err) => console.log(err));
} else {
  mongoose
    .connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      autoIndex: false,
      useUnifiedTopology: true,
      socketTimeoutMS: 300000,
    })
    .then(() => console.log("MONGODB CONNECTION SUCCESFUL"))
    .catch((err) => console.log(err));
}
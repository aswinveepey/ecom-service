const mongoose = require('mongoose')

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => console.log("MONGODB CONNECTION SUCCESFUL"));
const mongoose = require('mongoose')

function connectToDatabase () {
  console.log(`desde connectToDatabase: ${process.env.MONGO_URL}`);
  return new Promise((resolve, reject) => {
    mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
      if(err) {
        reject(err)
      }
      
      console.log('Base de datos ONLINE');
      resolve(true)
    });
  })
}

module.exports = connectToDatabase
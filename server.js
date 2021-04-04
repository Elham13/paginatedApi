const express = require('express');
const mongoose = require('mongoose');
const User = require('./users');
const app = express();

mongoose.connect(url, { useNewUrlParser: true , useUnifiedTopology: true }).then(() => console.log("Mongodb connected"));
const conn = mongoose.connection;
conn.once('open', async () => {
   if(await User.countDocuments().exec() > 0) return;

   Promise.all([
      User.create({name: "User 1"}),
      User.create({name: "User 2"}),
      User.create({name: "User 3"}),
      User.create({name: "User 4"}),
      User.create({name: "User 5"}),
      User.create({name: "User 6"}),
      User.create({name: "User 7"}),
      User.create({name: "User 8"}),
      User.create({name: "User 9"}),
      User.create({name: "User 10"}),
      User.create({name: "User 11"}),
      User.create({name: "User 12"}),
      User.create({name: "User 13"}),
      User.create({name: "User 14"}),
      User.create({name: "User 15"}),
      User.create({name: "User 16"}),
      User.create({name: "User 17"}),
      User.create({name: "User 18"}),
      User.create({name: "User 19"}),
      User.create({name: "User 20"}),
   ]).then(() => console.log("Added users"));
})

const users = [
   {id: 1, name: 'user 1'},
   {id: 2, name: 'user 2'},
   {id: 3, name: 'user 3'},
   {id: 4, name: 'user 4'},
   {id: 5, name: 'user 5'},
   {id: 6, name: 'user 6'},
   {id: 7, name: 'user 7'},
   {id: 8, name: 'user 8'},
   {id: 9, name: 'user 9'},
   {id: 10, name: 'user 10'},
   {id: 11, name: 'user 11'},
   {id: 12, name: 'user 12'},
   {id: 13, name: 'user 13'},
   {id: 14, name: 'user 14'},
]

const posts = [
   {id: 1, name: 'post 1'},
   {id: 2, name: 'post 2'},
   {id: 3, name: 'post 3'},
   {id: 4, name: 'post 4'},
   {id: 5, name: 'post 5'},
   {id: 6, name: 'post 6'},
   {id: 7, name: 'post 7'},
   {id: 8, name: 'post 8'},
   {id: 9, name: 'post 9'},
   {id: 10, name: 'post 10'},
   {id: 11, name: 'post 11'},
   {id: 12, name: 'post 12'},
   {id: 13, name: 'post 13'},
   {id: 14, name: 'post 14'},
]


const paginatedResult = (model) => {
   return async (req, res, next) => {
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const results = {};

      if(endIndex < await model.countDocuments().exec()){
         results.next = {
            page: page + 1,
            limit: limit,
         }
      }

      if(startIndex > 0){
         results.previous = {
            page: page - 1,
            limit: limit,
         }
      }

      try {
         results.results = await model.find().limit(limit).skip(startIndex).exec();
         res.paginatedResults = results;
         next();
      }catch(err) {
         res.status(500).json({message: err.message});
      }
   }
}

app.get('/users', paginatedResult(User), (req, res) => {
   res.json(res.paginatedResults);
});

app.get('/posts', paginatedResult(posts), (req, res) => {
   res.json(res.paginatedResults);
});


app.listen(3000, () => console.log('Server started at port 3000'));
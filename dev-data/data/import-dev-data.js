// console.log(process.env);
const fs=require('fs');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');
const Tour=require('./../../models/tourModel');
const User=require('./../../models/userModel');
const Review=require('./../../models/reviewModel');


const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    // console.log(con.connections);
    console.log('DB connection established');
  });


//Read json file
const tours=JSON.parse(fs.readFileSync(`${__dirname}/tours.json`,'utf-8'));
const users=JSON.parse(fs.readFileSync(`${__dirname}/users.json`,'utf-8'));
const reviews=JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`,'utf-8'));

//Import data into database
const importData=async ()=>{
    try{
        await Tour.create(tours); 
        await User.create(users,{validateBeforeSave:false}); 
        await Review.create(reviews); 
        console.log("Data successfully loaded!");
        process.exit(); 
    }

    catch(err){
        console.log(err);
    }
};
// console.log(tours);

//Delete all data from the database
const deleteData=async ()=>{
    try{
        await Tour.deleteMany(); 
        await User.deleteMany(); 
        await Review.deleteMany(); 
        console.log("Data successfully deleted!");
        process.exit(); 
    }

    catch(err){
        console.log(err);
    }
}

if(process.argv[2]==='--import'){
    importData();
}

else if(process.argv[2]==='--delete'){
    deleteData();
}

// console.log(process.argv);
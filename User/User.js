import mongoose from'mongoose';

import passportLocalMongoose from 'passport-local-mongoose';


mongoose.connect('mongodb://127.0.0.1:27017/MajorProject')
  .then(() => console.log('Connected!'));
  


  const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
        
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
    

  });

  UserSchema.plugin(passportLocalMongoose);

  const User = mongoose.model("User" ,UserSchema);

  export default User;



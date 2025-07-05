import mongoose from'mongoose';


mongoose.connect('mongodb://127.0.0.1:27017/loginLogic')
  .then(() => console.log('Connected!'));

  
    const FakeSchema = new mongoose.Schema({
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
  

      const fake = mongoose.model("fake" ,FakeSchema);
    
      export default fake;
  

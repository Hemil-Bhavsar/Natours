const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please tell us your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo:{
    type:String,
    default:'default.jpg'
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please tell us your password'],
    minlength: 8,
    select: false,
  },
  passwordChangedAt: {
    type: Date,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (el) {
        return el == this.password;
      },
      message: 'Passwords are not the same!',
    },
    select: false,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  active:{
    type:Boolean,
    default:true,
    select:false
  }
});

userSchema.pre('save', async function (next) {
  //only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  //Hah the password with cost 12
  this.password = await bcrypt.hash(this.password, 12);

  //Delete password confirmation
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre(/^find/,function(next){
  //This points to the current query
  this.find({active:{$ne:false}});
  next();
})

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  // console.log('in userSchema.methods.correctPassword');
  const result=await bcrypt.compare(candidatePassword, userPassword)
  // console.log(candidatePassword,userPassword);
  
  return result;
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    // console.log(changedTimeStamp, JWTTimestamp);
    return JWTTimestamp < changedTimeStamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// userSchema.pre('save',function(next){
//   if(!this.isModified('password')||this.isNew) return next();

//   this.passordChangedAt=Date.now()-1000;
//   next();
// })

const User = mongoose.model('User', userSchema);
module.exports = User;

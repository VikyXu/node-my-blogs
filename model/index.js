var mongoose =require('mongoose')
var bcrypt = require('bcrypt')  //密码加密
var SALT_WORK_FACTOR = 10;

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    pwd: String,
    FirstTitle:[{
        name: String
    }]
});
const SecondTitleSchema = new Schema({
    class_id: {
        type: Schema.Types.ObjectId
    },
    title: {
        type: String,
        default: Date.now
    },
    postTime: {
        type: Date,
        default: Date.now
    },
    updateTime: {
        type: Date,
        default: Date.now
    },
    FirstTitle: String,
    readNumber: {
        type: Number,
        default: 0
    },
    content: {
        type: String,
        default: ''
    },
});

userSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('pwd')) return next();
    console.log(1)
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        console.log(salt)
        if (err) return next(err);
        bcrypt.hash(user.pwd, salt, function(err, hash) {
            console.log(user.pwd)
            console.log(3)
            if (err) return next(err);
            user.pwd = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.pwd, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

const Models = {
    User: mongoose.model('User', userSchema),
    SecondTitle: mongoose.model('SecondTitle', SecondTitleSchema)
}

module.exports=Models
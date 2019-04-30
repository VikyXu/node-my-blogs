var mongoose =require('mongoose')

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

const Models = {
    User: mongoose.model('User', userSchema),
    SecondTitle: mongoose.model('SecondTitle', SecondTitleSchema)
}

module.exports=Models
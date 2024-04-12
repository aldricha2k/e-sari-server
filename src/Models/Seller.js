const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SellerSchema = new mongoose.Schema({
    name: {
        type: String
    },
    description: {
        type: String,
        default:''
    },
    email: {
        type: String
    },
    phone_number: {
        type: Number
    },
    password: {
        type: String
    },
    address: {
        region: String,
        province: String,
        city: String,
        barangay: String,
        street: String
    }
});

SellerSchema.pre('save', function(next){
    const seller = this;

    if(!seller.isModified('password')){
        return next;
    }

    bcrypt.genSalt(10, (err, salt) => {
        if (err){
            return next(err);
        }
        
        bcrypt.hash(seller.password, salt, (err, hash) => {
            if(err){
                return next(err);
            }
            seller.password = hash;
            next();
        });
    });
});

SellerSchema.methods.comparePassword = function(candidatePassword){
    const seller = this;
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, seller.password, (err, isMatch) => {
            if(err){
                return reject(err);
            }

            if(!isMatch){
                return reject(false);
            }

            resolve(true);
        });
    });
};

mongoose.model('Seller', SellerSchema);
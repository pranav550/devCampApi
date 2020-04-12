const mongoose = require("mongoose");
const slugify = require("slugify");
const geocoder = require('../utils/geocoder');

const BootcampSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please add a name'],
        maxlength:[50, 'Name can not be more than 50 character'],
        unique:true,
        trim:true   
    },
    slug:String,
    description:{
        type:String,
        required:[true,'Please add a description'],
        maxlength:[500, 'Name can not be more than 500 character'],
    },
    website: {
        type: String,
        match:[
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            'Please use a valid url with HTTP or HTTPS'
        ]
    },
    phone:{
        type:String,
        maxlength:[20, 'Phone no ca not be more than 20 charcter']
    },
    email:{
        type:String,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
          ]
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
      },
      location: {
        // GeoJSON Point
        type: {
          type: String,
          enum: ['Point']
        },
        coordinates: {
          type: [Number],
          index: '2dsphere'
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String
      },
      careers: {
        // Array of strings
        type: [String],
        required: true,
        enum: [
          'Web Development',
          'Mobile Development',
          'UI/UX',
          'Data Science',
          'Business',
          'Other'
        ]
      },
      averageRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [10, 'Rating must can not be more than 10']
      },
      averageCost: Number,
      photo: {
        type: String,
        default: 'no-photo.jpg'
      },
      housing: {
        type: Boolean,
        default: false
      },
      jobAssistance: {
        type: Boolean,
        default: false
      },
      jobGuarantee: {
        type: Boolean,
        default: false
      },
      acceptGi: {
        type: Boolean,
        default: false
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
      
},{
  toJSON:{virtuals:true},
  toObject:{virtuals:true}
})

//create bootcamp slug from name
BootcampSchema.pre('save', function(next){
  this.slug = slugify(this.name, {lower:true})
  next()
})

// Geocode & create location field
BootcampSchema.pre('save', async function(next){
  const loc = await geocoder.geocode(this.address)
  this.location = {
    type:'Point',
    cordinates:[loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipCode,
    country: loc[0].countryCode 
  }

  //Do not save address
  this.address = undefined;
  next()
})

// cascade delete courseswhen a bootcamp is deleted
BootcampSchema.pre('remove', async function(next){
  console.log(`courses being removed fro bootcamp ${this._id}`);
  await this.model('Course').deleteMany({ bootcamp: this._id})
  next();
})


// Reverse Populate with virtuals
BootcampSchema.virtual('courses',{
  ref:'Course',
  localField: '_id',
  foreignField:'bootcamp',
  justOne: false
})

module.exports = mongoose.model('Bootcamp', BootcampSchema);
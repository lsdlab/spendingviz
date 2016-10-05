const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')
const crypto = require('crypto')

var userSchema = new mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    unique: true
  },
  password: String,
  quickLoginToken: String,
  passwordResetToken: String,
  accountStatus: {
    type: String,
    default: ''
  },

  profile: {
    name: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      default: ''
    },
    avatar: {
      type: String,
      default: ''
    }
  },

  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  },

  provider: {
    type: String,
    default: 'local'
  }
})

/**
 * Password hash middleware.
 */
userSchema.pre('save', function(next) {
  var user = this
  if (!user.isModified('password')) {
    return next()
  }
  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      return next(err)
    }
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) {
        return next(err)
      }
      user.password = hash
      next()
    })
  })
})

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) {
      return cb(err)
    }
    cb(null, isMatch)
  })
}

/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function(size) {
  if (!size) {
    size = 200
  }
  if (!this.email) {
    return 'https://gravatar.com/avatar/?s=' + size + '&d=retro'
  }
  var md5 = crypto.createHash('md5').update(this.email).digest('hex')
  return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro'
}

var User = mongoose.model('User', userSchema)
module.exports = User

const ErrorHandler = require("../utils/errorhandler");
const catchasyncerrors = require("../middleware/catchasyncerrors");
const User = require("../models/usermodel");
const sendtoken = require("../utils/jwttoke");
const sendemail = require("../utils/sendemail.js");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

//register a user
exports.registeruser = catchasyncerrors(async (req, res, next) => {
  const mycloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 150,
    height: 150,
    crop: "scale",
  });
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: mycloud.public_id,
      url: mycloud.secure_url,
    },
  });

  sendtoken(user, 201, res);
});

//login user
exports.loginuser = catchasyncerrors(async (req, res, next) => {
  const { email, password } = req.body;

  // checking if user has given password and email both

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendtoken(user, 200, res);
});

//logout user
exports.logout = catchasyncerrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "logged out",
  });
});

//forgot password
exports.forgotpassword = catchasyncerrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("user not found", 404));
  }
  //get resetpassword token
  const resettoken = user.getresetpasswordtoken();
  await user.save({ validateBeforeSave: false });
  const resetpasswordurl = `${req.protocol}://${req.get(
    "host"
  )}/password/reset/${resettoken}`;

  const message = `your password reset token is :-\n\n${resetpasswordurl}  \n\n if you have not requested this url then,please ignore it.`;
  try {
    await sendemail({
      email: user.email,
      subject: `shopay password recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetpasswordtoken = undefined;
    user.resetpasswordexpire = undefined;
    await user.save({ validateBeforeSave: false });

    return MessageContextMenuCommandInteraction(
      new ErrorHandler(error.message, 500)
    );
  }
});

//get user details
exports.getuserdetail = catchasyncerrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});

// Reset Password
exports.resetpassword = catchasyncerrors(async (req, res, next) => {
  // creating token hash
  const resetpasswordtoken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetpasswordtoken,
    resetpasswordexpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not password", 400));
  }

  user.password = req.body.password;
  user.resetpasswordtoken = undefined;
  user.resetpasswordexpire = undefined;

  await user.save();

  sendtoken(user, 200, res);
});

// update User password
exports.updatepassword = catchasyncerrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("password does not match", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendtoken(user, 200, res);
});

// update User Profile
exports.updateprofile = catchasyncerrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  if (req.body.avatar !== "") {
    const user = await User.findById(req.user.id);

    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});


//get all users(admin)
exports.getallusers = catchasyncerrors(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});

//get single users(admin)
exports.getsingleuser = catchasyncerrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`user does not exist with id:${req.params.id}`)
    );
  }
  res.status(200).json({
    success: true,
    user,
  });
});

//update user role(admin)
exports.updateuserrole = catchasyncerrors(async (req, res, next) => {
  const newuserdata = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  await User.findByIdAndUpdate(req.params.id, newuserdata, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

//delete user(admin)
exports.deleteuser = catchasyncerrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`user does not exist with id${req.params.id}`)
    );
  }
  const imageId = user.avatar.public_id;

  await cloudinary.v2.uploader.destroy(imageId);



  await user.remove();
  res.status(200).json({
    success: true,
    message: "user deleted successsfully",
  });
});

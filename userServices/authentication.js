const Router = require("express");
const nodemailer = require("nodemailer");
const router = new Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({ log: ["query"] });
const crypto = require("crypto");
const Test = (req, res) => {
  res.send({ message: "Now every Thing working 👍" });
};

// displaying information from database

const fetchData = async (req, res) => {
  try {
    const user = await prisma.userLogin.findMany({});
    res.status(200).json({ user: user });
  } catch (error) {
    console.log(error);
  }
};

// Creation of login page
const userLogin = async (req, res) => {
  const user = req.body;
  const login = await prisma.userLogin.findFirst({
    where: {
      email: user.email,
      password: user.password,
    },
  });
  if (login) {
    return res.status(200).json({
      status: true,
      messagge: "Login success 👍",
      user: login,
    });
  } else {
    return res.status(500).json({
      status: false,
      message: "User not found Check email or password 👎",
    });
  }
};

// verify Email

const emailVerify = async (req, res, next) => {
  const userEmail = req.body;
  const verifyEmail = await prisma.userLogin.findFirst({
    where: {
      email: userEmail.email,
    },
  });
  if (verifyEmail) {
    res.status(400).json({
      status: false,
      massage: `user with thi ${userEmail.email} email already exist`,
    });
  } else {
    next();
  }
};

// register user or create account

const registerUser = async (req, res) => {
  const userInfo = req.body;
  try {
    const register = await prisma.userLogin.create({
      data: {
        name: userInfo.name,
        email: userInfo.email,
        password: userInfo.password,
      },
    });
    res.status(201).json({
      status: 201,
      msg: "registering new user",
      ok: true,
      user: register,
    });
  } catch (err) {
    next(err);
  }
};

// reseting password by sending email

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "codingdev.webs@gmail.com",
    pass: process.env.MAILER_PASSWORD,
  },
});

const sendResetPassword = async (req, res) => {
  const emailed = req.body.email;
  const newPassword = crypto
    .randomBytes(Math.ceil((8 * 3) / 4))
    .toString("base64");
  const info = await transporter.sendMail({
    from: '"noreply@gmail.com',
    to: `${emailed}`,
    subject: "Resenting Password",
    text: `hello your new password is ${newPassword}`,
    html: `<b>Thank you your service👏👏 <br>hello your new password is ${newPassword}</br></b>`,
  });

  res.status(200).json({ message: `Message sent: %s, ${info.messageId}` });
  await prisma.userLogin.update({
    where: {
      email: emailed,
    },
    data: {
      password: newPassword,
    },
  });
};

//  Delete account

const deleteAccount = async (req, res) => {
  const id = parseInt(req.params.id);
  const clearAccount = await prisma.userLogin.delete({
    where: {
      id: id,
    },
  });
  res.status(200).json({
    status: true,
    message: "Account deleted ✔",
    user: clearAccount,
  });
};

module.exports = {
  Test,
  fetchData,
  registerUser,
  emailVerify,
  sendResetPassword,
  deleteAccount,
  userLogin,
};

const nodeMailer = require("nodemailer");

module.exports.validate = (fields) => {
  const emailEx =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  let error = {};
  if (!fields.email || fields.email === "") {
    error["email"] = "E-mail is required";
  }

  if (fields.email) {
    if (!emailEx.test(String(fields.email).toLowerCase())) {
      error["email"] = "Enter a valid email";
    }
  }

  if (!fields.fullname || fields.fullname === "") {
    error["fullname"] = "E-mail is required";
  }

  if (!fields.message || fields.message === "") {
    error["message"] = "E-mail is required";
  }

  return { errors: error, success: false };
};

module.exports.sendEmail = async (email, body, subject, SUCCESS_MGS) => {
  const transporter = nodeMailer.createTransport({
    host: "smtpout.secureserver.net",
    secure: true,
    secureConnection: false, // TLS requires secureConnection to be false
    tls: {
      ciphers: "SSLv3",
    },
    requireTLS: true,
    port: 465,
    debug: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: "njfdigital.com <info@njfdigital.com>",
    to: "info@njfdigital.com",
    subject,
    text: body,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return {
      message: `You Have Successfully ${SUCCESS_MGS}`,
      info,
    };
  } catch (error) {
    throw Error(error.message);
  }
};

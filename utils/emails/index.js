const nodemailer = require("nodemailer");
const ejs = require("ejs");
const rootPath = require("../rootPath");
const path = require("path");

const {
  SENDER_EMAIL = "afshanarsha2783@gmail.com",
  SENDER_PASSWORD = 20192129,
} = process.env;
var transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: SENDER_EMAIL,
    pass: SENDER_PASSWORD,
  },
});

const createEmailOption = ({ receipentEmail, subject, body, html }) => ({
  from: SENDER_EMAIL,
  to: receipentEmail,
  ...(subject && { subject }),
  ...(body && { body }),
  html,
});

transporter.verify((error, success) => {
  if (error) {
    console.error("error in verifying transporter");
    // next(error.message);
    return;
  }
  console.log("email server is ready", process.env.SENDER_EMAIL);
});

const parseEmailTemplate = async (templateType, reqBody, next) => {
  try {
    let template = null;
    let subject = null;
    switch (templateType) {
      case "signup":
        template = "signUpTemplate.ejs";
        subject = "User Registeration";
        break;
      default:
        template;
    }

    if (!template) return next("target template not exist");

    template = path.join(rootPath, "utils", "Emails", "templates", template);

    const html = await ejs.renderFile(template, reqBody);

    if (html) {
      return { html, subject };
    }
    return { html: null, subject };
  } catch (exceptionError) {
    next(exceptionError.message);
    return;
  }
};

const sendEmail = async (templateType, reqData, res, next) => {
  try {
    const template = await parseEmailTemplate(templateType, reqData, next);

    const mailOption = createEmailOption({
      receipentEmail: reqData.email,
      html: template.html,
      subject: template.subject,
    });
    const sendInfo = await transporter.sendMail(mailOption);
    if (sendInfo) {
      res.send({
        email_success: `${templateType} email send successfully to ${reqData.email}`,
      });
    }
  } catch (error) {
    next(error.message);
    return;
  }
};

module.exports = sendEmail;

const nodemailer = require("nodemailer");
const ejs = require("ejs");
const rootPath = require("../rootPath");
const path = require("path");

const { SENDER_EMAIL, SENDER_PASSWORD } = process.env;
var transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: SENDER_EMAIL,
    pass: SENDER_PASSWORD,
  },
});

console.log({ SENDER_EMAIL });
const createEmailOption = ({ receipentEmail, subject, body, html }) => ({
  from: SENDER_EMAIL,
  to: receipentEmail,
  ...(subject && { subject }),
  ...(body && { body }),
  html,
});

transporter.verify((error, success) => {
  if (error) {
    console.error("error in verifying transporter", error.message);
    // next(error.message);
    return; //next(error.message);
  }
  console.log("email server is ready");
});

const parseEmailTemplate = async (templateType, reqBody, next) => {
  // try {
  let template = null;
  let subject = null;
  switch (templateType) {
    case "signup":
      template = "signUpTemplate.ejs";
      subject = "User Registeration";
      break;
    case "accountVerification":
      template = "activateAccount.ejs";
      subject = "Account Activation";
    default:
      template;
  }

  if (!template) return next("target template not exist");

  template = path.join(rootPath, "utils", "emails", "templates", template);

  const html = await ejs.renderFile(template, reqBody);

  if (html) {
    return { html, subject };
  }
  return { html: null, subject };
  // } catch (exceptionError) {
  //  console.log("parsing error");
  //  next(exceptionError.message);
  //  return;
  // }
};

const sendEmail = async (templateType, reqData, next) => {
  //try {
  const template = await parseEmailTemplate(templateType, reqData, next);

  const mailOption = createEmailOption({
    receipentEmail: reqData.email,
    html: template.html,
    subject: template.subject,
  });
  return await transporter.sendMail(mailOption);
  // const sendInfo = await transporter.sendMail(mailOption);
  // if (sendInfo) {
  //   res.send({
  //     email_success: `${templateType} email send successfully to ${reqData.email}`,
  //   });
  // }
  //} catch (error) {
  //   console.log("sending error");

  //   next(error.message);
  //   return;
  // }
};

module.exports = sendEmail;

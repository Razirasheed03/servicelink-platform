import transporter from "./mail";

export const sendOtpEmail = async (to: string, otp: string) => {
  const mailOptions = {
    from: `"ServiceLink" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your ServiceLink OTP Code",
    text: `Your OTP for verification is: ${otp}. It is valid for 2 minutes.`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (err) {
    console.error('Failed to send OTP mail:', err);
    throw err;
  }
};
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.generateToken();

  const cookieOptions = {
    expires: new Date(
      Date.now() + (Number(process.env.JWT_COOKIE_EXPIRES_DAYS) || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  };

  res.cookie("ht_token", token, cookieOptions);

  res.status(statusCode).json({
    success: true,
    token,
    user: user.toPublicJSON ? user.toPublicJSON() : user,
  });
};

module.exports = sendTokenResponse;

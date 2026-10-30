const Notification = require("../models/Notification");

/**
 * Creates a notification. Skips silently if recipient === sender (no self-notify).
 */
const createNotification = async ({ recipient, sender, type, message, link, experience }) => {
  if (sender && String(recipient) === String(sender)) return null;
  try {
    return await Notification.create({ recipient, sender, type, message, link, experience });
  } catch (err) {
    console.error("Notification creation failed:", err.message);
    return null;
  }
};

module.exports = { createNotification };

const mongoose = require("mongoose");
const slugify = require("slugify");

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, unique: true, index: true },
    industry: { type: String, default: "" },
    website: { type: String, default: "" },
    description: { type: String, default: "", maxlength: 800 },
    experienceCount: { type: Number, default: 0 }, // denormalized counter
  },
  { timestamps: true }
);

companySchema.pre("validate", function (next) {
  if (this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("Company", companySchema);

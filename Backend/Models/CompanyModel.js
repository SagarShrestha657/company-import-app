import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    industry: { type: String },
    location: { type: String },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
  }
);

const Company = mongoose.model("Company", companySchema);
export default Company;

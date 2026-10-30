// Run with: npm run seed
// Creates one sample student account and a sample company/experience for local testing.
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");
const Company = require("../models/Company");
const Experience = require("../models/Experience");

const run = async () => {
  await connectDB();

  let student = await User.findOne({ email: "student@hiretrail.com" });
  if (!student) {
    student = await User.create({
      name: "Aditi Sharma",
      email: "student@hiretrail.com",
      password: "Student@123",
      college: "NIT Trichy",
      branch: "Computer Science",
      graduationYear: 2025,
      headline: "SDE Intern @ Flipkart | DSA enthusiast",
      isProfileComplete: true,
    });
    console.log("Created student:", student.email, "password: Student@123");
  }

  let company = await Company.findOne({ name: "Flipkart" });
  if (!company) {
    company = await Company.create({ name: "Flipkart", industry: "E-commerce" });
  }

  const existingExp = await Experience.findOne({ company: company._id, author: student._id });
  if (!existingExp) {
    await Experience.create({
      author: student._id,
      company: company._id,
      companyNameSnapshot: company.name,
      jobRole: "SDE Intern",
      jobType: "Internship",
      packageOffered: "80,000/month",
      interviewDate: new Date("2025-08-14"),
      eligibilityCriteria: "CGPA 7.5+, no active backlogs",
      interviewMode: "Online",
      numberOfRounds: 3,
      rounds: [
        {
          roundNumber: 1,
          roundName: "Online Assessment",
          roundType: "Online Assessment",
          duration: "90 mins",
          questionsAsked: "2 DSA problems (arrays, DP) + 20 MCQs on OOPS and DBMS",
          experience: "Moderate difficulty, time pressure was real.",
          difficulty: "Medium",
          result: "Cleared",
        },
        {
          roundNumber: 2,
          roundName: "Technical Interview 1",
          roundType: "Technical",
          duration: "45 mins",
          questionsAsked: "Reverse a linked list, discussed time complexity, SQL joins",
          experience: "Interviewer was friendly, focused on my thought process.",
          difficulty: "Medium",
          result: "Cleared",
        },
        {
          roundNumber: 3,
          roundName: "HR + Managerial",
          roundType: "HR",
          duration: "30 mins",
          questionsAsked: "Tell me about yourself, why Flipkart, a conflict situation at work",
          experience: "Relaxed conversation, mostly about fit and motivation.",
          difficulty: "Easy",
          result: "Cleared",
        },
      ],
      resourcesUsed: "Striver's SDE sheet, LeetCode top 150, GfG DBMS notes",
      preparationStrategy: "2 hours DSA daily for 6 weeks, mock interviews with seniors twice a week.",
      mistakesMade: "Didn't revise OS/DBMS deeply enough for the OA round.",
      tipsForJuniors: "Practice explaining your approach out loud before you touch the keyboard.",
      finalResult: "Selected",
      technologies: ["DSA", "SQL", "Java"],
      tags: ["internship", "product-based", "tier-1"],
    });
    company.experienceCount += 1;
    await company.save();
    console.log("Created sample experience");
  }

  console.log("Seed complete.");
  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

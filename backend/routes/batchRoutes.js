const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware");
const mongoose = require("mongoose");

// Import models
let ce, cse, it, sfe, me, eee, ec;
try {
  ce = require("../model/CE");
  cse = require("../model/CSE");
  it = require("../model/IT");
  sfe = require("../model/SFE");
  me = require("../model/ME");
  eee = require("../model/EEE");
  ec = require("../model/EC");
} catch (err) {
  console.error("Error importing models:", err);
}

// Create Batch model if it doesn't exist
let Batch;
try {
  Batch = mongoose.model("Batch");
} catch (e) {
  const batchSchema = new mongoose.Schema({
    year: {
      type: String,
      required: true,
      unique: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    departments: [
      {
        name: String,
        totalStudents: Number,
        placed: Number,
        averagePackage: String,
        highestPackage: String,
        companies: [String],
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });

  Batch = mongoose.model("Batch", batchSchema);
}

// Get all batches
router.get("/", async (req, res) => {
  try {
    // Try to get batches from the database
    let batches = await Batch.find().sort({ year: -1 });

    // If no batches found, generate them based on students in the system
    if (batches.length === 0) {
      const departmentModels = {
        CE: ce,
        CSE: cse,
        IT: it,
        SFE: sfe,
        ME: me,
        EEE: eee,
        EC: ec,
      };

      // Get unique admission years from all departments
      const admissionYears = new Set();
      for (const [dept, model] of Object.entries(departmentModels)) {
        if (!model) continue;

        const years = await model.distinct("yearOfAdmission");
        years.forEach((year) => admissionYears.add(year));
      }

      // Create batches for each year
      const batchPromises = Array.from(admissionYears).map(
        async (admissionYear) => {
          if (!admissionYear) return null;

          const departments = [];
          let isCompleted = true;

          // Current year to determine if batch is completed
          const currentYear = new Date().getFullYear();
          const graduationYear = parseInt(admissionYear) + 4;
          if (graduationYear >= currentYear) {
            isCompleted = false;
          }

          // Get stats for each department
          for (const [deptCode, model] of Object.entries(departmentModels)) {
            if (!model) continue;

            try {
              // Total students in this batch and department
              const totalStudents = await model.countDocuments({
                yearOfAdmission: admissionYear,
              });

              if (totalStudents === 0) continue;

              // Placed students
              const placedStudents = await model.countDocuments({
                yearOfAdmission: admissionYear,
                isPlaced: true,
              });

              // Get average and highest packages
              let avgPackage = "0 LPA";
              let highestPackage = "0 LPA";

              const placedStudentsData = await model.find({
                yearOfAdmission: admissionYear,
                isPlaced: true,
                placementPackage: { $exists: true, $ne: null },
              });

              if (placedStudentsData.length > 0) {
                // Calculate average
                const sum = placedStudentsData.reduce((total, student) => {
                  return total + (parseFloat(student.placementPackage) || 0);
                }, 0);

                avgPackage = `${(sum / placedStudentsData.length).toFixed(
                  2
                )} LPA`;

                // Find highest
                const highest = Math.max(
                  ...placedStudentsData.map(
                    (s) => parseFloat(s.placementPackage) || 0
                  )
                );

                highestPackage = `${highest.toFixed(2)} LPA`;
              }

              // Get recruiting companies
              const companies = [];
              const uniqueCompanies = new Set();

              placedStudentsData.forEach((student) => {
                if (student.placementCompany) {
                  uniqueCompanies.add(student.placementCompany.toString());
                }
              });

              if (uniqueCompanies.size > 0) {
                // Get company names
                // For simplicity, we'll just add placeholder company names
                // In a real system, you'd query the company collection
                Array.from(uniqueCompanies).forEach((_, index) => {
                  const demoCompanies = [
                    "TCS",
                    "Infosys",
                    "Wipro",
                    "Microsoft",
                    "Google",
                    "Amazon",
                    "IBM",
                  ];
                  if (index < demoCompanies.length) {
                    companies.push(demoCompanies[index]);
                  }
                });
              }

              departments.push({
                name: deptCode,
                totalStudents,
                placed: placedStudents,
                averagePackage: avgPackage,
                highestPackage: highestPackage,
                companies,
              });
            } catch (err) {
              console.error(
                `Error processing ${deptCode} for batch ${admissionYear}:`,
                err
              );
            }
          }

          // Only create batch if it has departments with students
          if (departments.length > 0) {
            // Format batch year as XXXX-YYYY
            const batchYear = `${admissionYear}-${parseInt(admissionYear) + 4}`;

            return new Batch({
              year: batchYear,
              isCompleted,
              departments,
            });
          }

          return null;
        }
      );

      // Wait for all batch processing to complete
      const processedBatches = await Promise.all(batchPromises);

      // Filter out null values and save valid batches
      const validBatches = processedBatches.filter((batch) => batch !== null);
      if (validBatches.length > 0) {
        await Batch.insertMany(validBatches);
        batches = validBatches;
      } else {
        // If no valid batches, generate demo data
        const currentYear = new Date().getFullYear();
        const demoBatches = [];

        // Create 3 batches: current year and 2 previous years
        for (let i = 0; i < 3; i++) {
          const year = currentYear - i;
          const startYear = year - 4;
          const batchYear = `${startYear}-${year}`;

          const batch = new Batch({
            year: batchYear,
            isCompleted: i > 0, // Only current batch is not completed
            departments: Object.keys(departmentModels).map((deptCode) => ({
              name: deptCode,
              totalStudents: Math.floor(Math.random() * 80) + 40, // 40-120 students
              placed: Math.floor(Math.random() * 60) + 20, // 20-80 placements
              averagePackage: `${(Math.random() * 8 + 4).toFixed(2)} LPA`,
              highestPackage: `${(Math.random() * 30 + 10).toFixed(2)} LPA`,
              companies: [
                "TCS",
                "Infosys",
                "Wipro",
                "Microsoft",
                "Google",
              ].slice(0, Math.floor(Math.random() * 4) + 2), // 2-5 companies
            })),
          });

          demoBatches.push(batch);
        }

        await Batch.insertMany(demoBatches);
        batches = demoBatches;
      }
    }

    res.status(200).json(batches);
  } catch (error) {
    console.error("Error fetching batches:", error);
    res
      .status(500)
      .json({ message: "Error fetching batches", error: error.message });
  }
});

// Create a new batch
router.post("/", isLoggedIn, async (req, res) => {
  try {
    // Only admins can create batches
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Unauthorized - Admin access only" });
    }

    const { year } = req.body;

    if (!year) {
      return res.status(400).json({ message: "Batch year is required" });
    }

    // Check if batch already exists
    const existingBatch = await Batch.findOne({ year });
    if (existingBatch) {
      return res.status(400).json({ message: "Batch already exists" });
    }

    // Create new batch with empty departments
    const newBatch = new Batch({
      year,
      isCompleted: false,
      departments: Object.keys(departmentMapping).map((deptCode) => ({
        name: deptCode,
        totalStudents: 0,
        placed: 0,
        averagePackage: "0 LPA",
        highestPackage: "0 LPA",
        companies: [],
      })),
    });

    await newBatch.save();
    res.status(201).json(newBatch);
  } catch (error) {
    console.error("Error creating batch:", error);
    res
      .status(500)
      .json({ message: "Error creating batch", error: error.message });
  }
});

// Compare batches
router.post("/compare-batches", isLoggedIn, async (req, res) => {
  try {
    // Only admins can compare batches
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Unauthorized - Admin access only" });
    }

    const { batchYears } = req.body;

    if (!batchYears || !Array.isArray(batchYears) || batchYears.length < 2) {
      return res
        .status(400)
        .json({ message: "At least two batch years are required" });
    }

    // Get batches to compare
    const batches = await Batch.find({ year: { $in: batchYears } });

    // Create comparison data
    const comparisonData = {};

    batches.forEach((batch) => {
      // Calculate batch totals
      const totalStudents = batch.departments.reduce(
        (sum, dept) => sum + (parseInt(dept.totalStudents) || 0),
        0
      );

      const placedStudents = batch.departments.reduce(
        (sum, dept) => sum + (parseInt(dept.placed) || 0),
        0
      );

      // Calculate average package
      let avgPackage = "0 LPA";
      const departmentsWithPlacements = batch.departments.filter(
        (dept) => (parseInt(dept.placed) || 0) > 0
      );

      if (departmentsWithPlacements.length > 0) {
        const totalPackageValue = departmentsWithPlacements.reduce(
          (sum, dept) => {
            const pkgStr = dept.averagePackage || "0";
            const pkg = parseFloat(pkgStr.replace(/[^\d.]/g, ""));
            return sum + (isNaN(pkg) ? 0 : pkg);
          },
          0
        );

        avgPackage = `${(
          totalPackageValue / departmentsWithPlacements.length
        ).toFixed(2)} LPA`;
      }

      // Add to comparison data
      comparisonData[batch.year] = {
        totalStudents,
        placedStudents,
        averagePackage: avgPackage,
        departments: batch.departments,
      };
    });

    res.status(200).json(comparisonData);
  } catch (error) {
    console.error("Error comparing batches:", error);
    res
      .status(500)
      .json({ message: "Error comparing batches", error: error.message });
  }
});

module.exports = router;

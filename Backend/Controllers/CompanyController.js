import xlsx from "xlsx";
import fs from "fs";
import Company from "../Models/CompanyModel.js";

function parseFile(path) {
  const wb = xlsx.readFile(path);
  const ws = wb.Sheets[wb.SheetNames[0]];
  return xlsx.utils.sheet_to_json(ws);
}

async function importCompanies(data, mode) {
  let inserted = 0,
      updated = 0,
      skipped = 0;

  for (const row of data) {
    if (!row.email) {
      skipped++;
      continue;
    }

    const existing = await Company.findOne({ email: row.email });

    switch (mode) {
      case "1": // Create New Only
        if (!existing) {
          await Company.create(row);
          inserted++;
        } else skipped++;
        break;

      case "2": // Create + Update Empty Fields
        if (!existing) {
          await Company.create(row);
          inserted++;
        } else {
          const updates = {};
          for (let key in row) {
            if (!existing[key] && row[key]) updates[key] = row[key];
          }
          if (Object.keys(updates).length) {
            await Company.updateOne({ email: row.email }, { $set: updates });
            updated++;
          } else skipped++;
        }
        break;

      case "3": // Create + Overwrite All Fields
        if (!existing) {
          await Company.create(row);
          inserted++;
        } else {
          await Company.updateOne({ email: row.email }, { $set: row });
          updated++;
        }
        break;

      case "4": // Update Existing Only (No Overwrite)
        if (existing) {
          const updates = {};
          for (let key in row) {
            if (!existing[key] && row[key]) updates[key] = row[key];
          }
          if (Object.keys(updates).length) {
            await Company.updateOne({ email: row.email }, { $set: updates });
            updated++;
          } else skipped++;
        } else skipped++;
        break;

      case "5": // Update Existing Only (Overwrite All)
        if (existing) {
          await Company.updateOne({ email: row.email }, { $set: row });
          updated++;
        } else skipped++;
        break;
    }
  }

  return { inserted, updated, skipped };
}

export const importHandler = async (req, res) => {
  try {
    const mode = req.body.mode;
    const companies = parseFile(req.file.path);

    const result = await importCompanies(companies, mode);

    fs.unlinkSync(req.file.path); 

    res.json({ status: "success", ...result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 5000;
const nodemailer = require('nodemailer');


const DATA_FILE = 'registrations.json';

app.use(cors());
app.use(express.json());

function readData() {
  if (!fs.existsSync(DATA_FILE)) return [];

  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);

    // ✅ Ensure it's always an array
    if (Array.isArray(parsed)) {
      return parsed;
    } else {
      console.warn('⚠️ JSON file exists but is not an array, resetting it.');
      return [];
    }
  } catch (error) {
    console.error('❌ JSON parse error:', error);
    return [];
  }
}


function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.post('/register', (req, res) => {
  const { name, email } = req.body;

  // 🛡️ 1. Basic validations
  if (!name || !email) {
    return res.status(400).json({ error: 'Missing name or email' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // 📖 2. Read existing data
  let existing = [];
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    existing = JSON.parse(raw);
    if (!Array.isArray(existing)) {
      console.warn('⚠️ registrations.json is invalid. Resetting.');
      existing = [];
    }
  } catch (e) {
    console.warn('⚠️ File read error. Starting fresh.');
    existing = [];
  }

  // 🔁 3. Duplicate check
  const alreadyRegistered = existing.some(
    (entry) => entry.email.toLowerCase() === email.toLowerCase()
  );
  if (alreadyRegistered) {
    return res.status(409).json({ error: 'This email is already registered!' });
  }

  // ✍️ 4. Save new data
  const newEntry = { name, email };
  existing.push(newEntry);
  fs.writeFileSync(DATA_FILE, JSON.stringify(existing, null, 2));

  // 📧 5. Send confirmation email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'suwethamarimuthu@gmail.com',
      pass: 'nryc rltm fbfz oacb',
    },
  });

  const mailOptions = {
    from: 'suwethamarimuthu@gmail.com',
    to: email,
    subject: '🎉 You’re Registered!',
    text: `Hi ${name},\n\nYou have successfully registered for our event! 🎉`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.error('❌ Email error:', err);
    else console.log('✅ Email sent:', info.response);
  });

  return res.status(201).json({ message: 'Registered successfully!' });
});


// ✅ Route to fetch registered users
app.get('/registrations', (req, res) => {
  try {
    const registrations = readData(); // 🗂️ Reads from JSON file
    res.status(200).json({ registrations });
  } catch (error) {
    console.error('❌ Error reading registrations:', error);
    res.status(500).json({ error: 'Failed to load registrations' });
  }
});

app.delete('/registrations/:email', (req, res) => {
  const emailToDelete = req.params.email.toLowerCase();

  let registrations = readData();

  const updated = registrations.filter(entry => entry.email.toLowerCase() !== emailToDelete);

  if (registrations.length === updated.length) {
    return res.status(404).json({ error: 'No such email found to delete.' });
  }

  writeData(updated);
  res.json({ message: 'Deleted successfully!' });
});



// 👇 Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});


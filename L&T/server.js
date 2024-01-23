const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection (replace with your MongoDB connection string)
mongoose.connect('mongodb://localhost/registrationdb', { useNewUrlParser: true, useUnifiedTopology: true });

// Create a User model (MongoDB schema)
const User = mongoose.model('User', {
    name: String,
    email: String,
    phone: String,
    verified: { type: Boolean, default: false }
});

app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route to handle registration
app.post('/register', async (req, res) => {
    const { name, email, phone } = req.body;

    try {
        // Create a new user
        const user = new User({ name, email, phone });
        await user.save();

        // Send verification email (replace with your email sending logic)
        const transporter = nodemailer.createTransport({
            // Set up your email configuration
            service: 'gmail',
            auth: {
                user: 'your-email@gmail.com',
                pass: 'your-email-password'
            }
        });

        const mailOptions = {
            from: 'your-email@gmail.com',
            to: email,
            subject: 'Account Verification',
            text: 'Click the link to verify your account: http://localhost:3000/verify/' + user._id
        };

        await transporter.sendMail(mailOptions);

        res.status(200).send('Registration successful. Check your email for verification.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to handle email verification
app.get('/verify/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send('User not found.');
        }

        // Mark the user as verified
        user.verified = true;
        await user.save();

        res.send('Account verified successfully.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: ["http://localhost:3000", "https://pixel-ui-beta.vercel.app"],
  })
);
const supabase = createClient(process.env.SUPABASE_URL, process.env.KEY);

const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;

app.use(express.json());


app.post("/login-otp", async (req, res) => {
  const {email}=req.body
  console.log(email);
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        // set this to false if you do not want the user to be automatically signed up
        shouldCreateUser: true,
      },
    });
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

app.post("/verify-login-otp", async (req, res) => {
  try {
    const {email,token}=req.body
    console.log(email,token);
    const data = await supabase.auth.verifyOtp({
      email,
      token: token,
      type: "email",
    });
    res.status(200).json(data)
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

app.get("/logout", async (req, res) => {
  const { error } = await supabase.auth.signOut();
});

// API endpoint to fetch images based on a predefined query
app.get("/api/images", async (req, res) => {
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=yellow+flowers&image_type=photo`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching images:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/images/:item", async (req, res) => {
  const { item } = req.params;

  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${item}&image_type=photo`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching images:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

import React, { useState,useEffect } from "react";
import { NavLink } from "react-router";


export default function Home() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    regnum: "",
    name: "",
    email: "",
    yourname: "",
    yourmail: "",
    yourNumber: "",
    jobTitle: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const generatePDF = async () => {
    try {
        const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certificate</title>
    <style>
         body {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 1123px;
            height: 794px;
            padding: 0;
            margin: 0;
         }
        .container {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background-image: url(https://fintech.traiconevents.com/bh/certifiacate/certificate.png);
            background-size: 100% 100%;
            position: relative;
        }
        .certificate-top {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: absolute;
            top: 165px;
        }
        .certificate-top h1 {
            padding: 0;
            margin: 0;
            font-size: 70px;
        }
        .certificate-top p {
            font-family: "Arial";
            text-transform: uppercase;
            margin: 0;
            font-size: 20px;
        }
        .top-p {
            position: absolute;
            top: 300px;
            font-family: "Arial";
            font-size: 20px;
        }
        .name {
            font-size: 30px;
            font-family: "Arial";
            text-transform: uppercase;
            font-weight: 900;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="certificate-top">
            <h1>CERTIFICATE</h1>
            <p>of participation</p>
        </div>
        <p class="top-p">This certificate is proudly presented to</p>
        <h1 class="name">${formData.name}</h1>
    </div>
</body>
</html>`;

        setLoading(true);

        const response = await fetch("https://traiconevents.com/backend/pupeteer.php?action=generate_pdf_html", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
              html: htmlContent, 
              regnum: formData.regnum, 
              name: formData.name, 
              email: formData.email, 
              yourmail: formData.yourmail,
              yourname:formData.yourname,
              yourNumber:formData.yourNumber,
              jobTitle:formData.jobTitle
          }), 
      });

      const responseText = await response.text();
console.log("Raw response:", responseText); // Debug response
      

        // Handle duplicate regnum case
        if (response.status === 409) {
            alert("⚠️ Registration number already exists! Please use a different one.");
            return; // Stop execution
        }

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        alert(result.message); 

    } catch (error) {
        console.error("❌ Error generating PDF:", error);
        alert("Failed to generate PDF. Check console for details.");
    } finally {
        setLoading(false);
        setFormData(
          {
            regnum: "",
            name: "",
            email: "",
            yourname: "",
            yourmail: "",
            yourNumber: "",
            jobTitle: "",
          }
        )
    }
};



useEffect(()=>{
  console.log(formData.name)
})


return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Certificate generator for FRS bahrain</h1>
      <form>
        <input
          type="text"
          name="regnum"
          placeholder="Enter the registration Number"
          value={formData.regnum}
          onChange={handleChange}
        />
        <input
          type="text"
          name="name"
          placeholder="Enter client's Name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Enter the client's email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="text"
          name="yourname"
          placeholder="Enter Your Name"
          value={formData.yourname}
          onChange={handleChange}
        />
        <input
          type="email"
          name="yourmail"
          placeholder="Enter Your Email"
          value={formData.yourmail}
          onChange={handleChange}
        />
        <input
          type="text"
          name="yourNumber"
          placeholder="Enter Your Number"
          value={formData.yourNumber}
          onChange={handleChange}
        />
        <input
          type="text"
          name="jobTitle"
          placeholder="Enter Your Job Title"
          value={formData.jobTitle}
          onChange={handleChange}
        />
      </form>
      <div className="buttons">
           <button
        onClick={generatePDF}
        style={{
          padding: "10px 20px",
          fontSize: "18px",
          backgroundColor: "#ed145a",
          color: "white",
          border: "none",
          cursor: "pointer",
          borderRadius: "5px",
          marginTop: "20px",
        }}
        disabled={loading}
      >
        {loading ? "SUBMITTING..." : "SUBMIT"}
      </button>
      <NavLink style={{
          padding: "10px 20px",
          fontSize: "18px",
          backgroundColor: "#ed145a",
          color: "white",
          border: "none",
          cursor: "pointer",
          borderRadius: "5px",
          marginTop: "20px",
          textDecoration:"none"

        }} to="/download"> DOWNOAD CERTIFICATE </NavLink>
      </div>
   
    </div>
  );
}

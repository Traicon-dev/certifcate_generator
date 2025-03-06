import React, { useState } from "react";
import { NavLink } from "react-router";

export default function Download() {
  const [regnum, setRegnum] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!regnum) {
      alert("⚠️ Please enter your registration number!");
      return;
    }
  
    try {
      setLoading(true);
  
      // Corrected fetch URL to match the PHP route format
      const response = await fetch(`http://localhost/pdf/pupeteer.php/download/${regnum}`);
  
      if (!response.ok) {
        throw new Error("❌ Certificate not found");
      }
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `certificate_${regnum}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div style={{ textAlign: "center", padding: "20px", height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", gap: "20px", alignItems: "center" }}>
      <h2>Download Your Certificate</h2>
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <input
          type="text"
          placeholder="Enter Registration Number"
          value={regnum}
          onChange={(e) => setRegnum(e.target.value)}
          style={{ padding: "10px", marginRight: "10px", width: "40%" }}
        />
        <button onClick={handleDownload} style={{ padding: "10px 15px", cursor: "pointer", width: "20%" }} disabled={loading}>
          {loading ? "Downloading..." : "Download"}
        </button>
      </div>
      <NavLink style={{
        padding: "10px 20px",
        fontSize: "18px",
        backgroundColor: "#ed145a",
        color: "white",
        border: "none",
        cursor: "pointer",
        borderRadius: "5px",
        marginTop: "20px",
        textDecoration: "none",
        width: "10%",
        textAlign: "center"
      }} to="/">HOME</NavLink>
    </div>
  );
}

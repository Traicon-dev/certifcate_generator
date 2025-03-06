import React, { useRef, useState, useEffect } from "react";
import html2pdf from "html2pdf.js";

const Certificate = ({ name }) => {
  const pdfRef = useRef();
  const [imageLoaded, setImageLoaded] = useState(false);
  const localImagePath = "/certificate.png"; // Use local image from public folder

  useEffect(() => {
    const img = new Image();
    img.src = localImagePath;
    img.onload = () => setImageLoaded(true);
  }, []);

  const generatePDF = () => {
    if (!imageLoaded) {
      alert("Please wait, the background image is still loading...");
      return;
    }

    const element = pdfRef.current;
    html2pdf()
      .set({
        margin: 0,
        filename: "certificate.pdf",
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
      })
      .from(element)
      .save();
  };

  return (
    <div>
      <div
        ref={pdfRef}
        style={{
          width: "1123px",
          height: "794px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: imageLoaded ? `url(${localImagePath})` : "none",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        <img src={localImagePath} alt="certificate background" style={{ display: "none" }} />

        <div style={{ position: "absolute", top: "165px", textAlign: "center" }}>
          <h1 style={{ fontSize: "70px", margin: 0 }}>CERTIFICATE</h1>
          <p style={{ fontSize: "20px", textTransform: "uppercase", fontFamily: "Arial", margin: 0 }}>
            of participation
          </p>
        </div>

        <p style={{ position: "absolute", top: "300px", fontSize: "20px", fontFamily: "Arial" }}>
          This certificate is proudly presented to
        </p>

        <h1 style={{ fontSize: "30px", fontFamily: "Arial", textTransform: "uppercase", fontWeight: "900" }}>
          {name}
        </h1>
      </div>

      <button onClick={generatePDF} disabled={!imageLoaded}>
        {imageLoaded ? "Download PDF" : "Loading Image..."}
      </button>
    </div>
  );
};

export default Certificate;

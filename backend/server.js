const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");
const db = require("./db");
const nodemailer = require("nodemailer");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const saveCertificate = async (regnum, name, email, yourmail, pdfBuffer) => {
    const query = "INSERT INTO certificates (regnum, name, email, yourmail, pdf_blob) VALUES (?, ?, ?, ?, ?)";

    try {
        await db.execute(query, [regnum, name, email, yourmail, pdfBuffer]);
        console.log("✅ Certificate saved to database!");
    } catch (err) {
        console.error("❌ Failed to save certificate:", err);
    }
};







app.post("/generate-pdf-html", async (req, res) => {
    const { html, regnum, name, email, yourmail, yourNumber, yourname, jobTitle } = req.body;

   

    if (!html || !email) {
        return res.status(400).json({ error: "HTML content and email are required" });
    }

    try {

        const checkQuery = "SELECT regnum FROM certificates WHERE regnum = ?";
        const [existing] = await db.execute(checkQuery, [regnum]);

        if (existing.length > 0) {
            return res.status(409).json({ error: "Registration number already exists" });
        }


        const browser = await puppeteer.launch({
            headless: "new",
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        });

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "networkidle0" });

        const pdfBuffer = await page.pdf({ format: "A4", printBackground: true, landscape: true });

        await browser.close();

        saveCertificate(regnum, name, email, yourmail, pdfBuffer);

        if (!pdfBuffer || pdfBuffer.length === 0) {
            throw new Error("Generated PDF is empty!");
        }

   
        const transporter = nodemailer.createTransport({
            host: "mail.traiconevents.com",
            port: 465, 
            secure: true, 
            auth: {
                user: "jatin@traiconevents.com",
                pass: "jatin@298*"
            }
        });

        const mailOptions = {
            from: `"Traicon Events Pvt Ltd" < ${yourmail} >`,
            to: [email, yourmail],
            subject: "Fintech Revolution Summit 2025, Bahrain",
            html: `
                          <p> Hi ${name}, </p>
                          <p>  Thank you for joining us at the <b>Fintech Revolution Summit 2025, Bahrain</b>. Your presence and participation contributed significantly to the event's success. </p>
                           <p> As a token of our appreciation, please find attached your certificate of participation.</p>
                           <p>  We hope you found the sessions insightful and the discussions enriching. If you have any feedback or suggestions, feel free to share them with us-we're always eager to improve and make our future events even better.</p>
                           <p>  Looking forward to seeing you at our upcoming events!</p>
                           <p>  Regards,</p>
                           <p>  ${yourname}</p>
                           <p>  ${jobTitle}</p>
                           <p>  M: ${yourNumber}</p>
                           <p>  E: ${yourmail}</p>
    `,
            attachments: [
                {
                    filename: "certificate.pdf",
                    content: pdfBuffer,
                }
            ]
        };

        await transporter.sendMail(mailOptions);

        res.json({ message: "PDF generated and emailed successfully!" });

    } catch (error) {
        console.error("❌ ERROR: Failed to generate PDF and send email!", error);
        res.status(500).json({ error: "Failed to generate PDF and send email" });
    }
});

app.get("/download/:regnum", async (req, res) => {
    const { regnum } = req.params;

    try {
        const query = "SELECT pdf_blob FROM certificates WHERE regnum = ?";
        const [rows] = await db.execute(query, [regnum]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Certificate not found" });
        }

        const pdfBuffer = rows[0].pdf_blob;

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=certificate_${regnum}.pdf`);

        res.send(pdfBuffer);
    } catch (err) {
        console.error("❌ ERROR: Failed to retrieve certificate", err);
        res.status(500).json({ error: "Failed to download certificate" });
    }
});


app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

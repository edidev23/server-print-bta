const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;
var wkhtmltopdf = require("wkhtmltopdf");
const fs = require("fs");

app.use(cors());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));

app.get("/", (req, res) => {
  res.send("BTA Academyd");
});

app.get("/print-test", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "application/pdf",
    "Content-disposition": "attachment;filename=bta.pdf",
  });

  wkhtmltopdf("document OK", {
    pageSize: "A4",
    //  orientation: 'Landscape',
    marginLeft: "10mm",
    marginTop: "10mm",
  }).pipe(response);
  console.log("All done");
});

// Access the parse results as request.body
app.post("/print-document", function (request, response) {
  // console.log(request.body);
  let dataPreview = request.body;

  let html = "";

  html += `
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@300;700&display=swap');

    .heading {
        font-family: "Roboto Slab", serif !important; color: #00395d;
    }
    </style>

    <div class="heading" style="font-size: 20px; font-weight: bold">INDUSTRY : ${
      dataPreview.industry
    }</div>
    <div class="heading" style="font-size: 20px;">SIZE : ${dataPreview.Size.name}</div>
    <div class="heading" style="font-size: 20px;">
        DIVISION : ${dataPreview.division ? dataPreview.division : "-"}
    </div>
    <div class="heading" style="font-size: 20px;">
        DEPARTMENT :
        ${dataPreview.department ? dataPreview.department : "-"}
    </div>
    <hr style="border: 1px solid black; margin: 10px 0 20px 0" />`;

  html += `<div class="heading" style="font-size: 20px; margin-bottom:20px; font-weight: bold;">${dataPreview.templatE_TITLE}</div>`;

  html += `
    <div style="padding-top: 10px;
    padding-bottom: 10px;
    border-top: 1px solid black;
    border-bottom: 1px solid black;
    margin-bottom: 35px;">`;

  dataPreview.sections.forEach((section) => {
    html += `
    <div style="font-size: 18px;
    cursor: pointer;
    margin:3px 0;
    font-weight: bold;">
      <a class="heading" href="#${section.title}">${section.title}</a>
    </div>
    `;
  });

  html += `</div>`;

  dataPreview.sections.forEach((section) => {
    html += `
    <div id="${section.title}" style="margin-bottom:40px">
        <div class="heading" style="font-size: 20px; margin-bottom:20px; font-weight: bold;">
          ${section.title}
        </div>`;

    section.text.forEach((text) => {
      html += `<div class="section-text" style="font-size: 20px; margin-bottom: 20px;">${text}</div>`;
    });

    html += `
    </div>`;
  });

  // wkhtmltopdf(html, { pageSize: "a4" }).pipe(fs.createWriteStream("bta.pdf"));
  // response.send(html)

  response.writeHead(200, {
    "Content-Type": "application/pdf",
    "Content-disposition": "attachment;filename=bta.pdf",
  });

  wkhtmltopdf(html, {
    pageSize: "A4",
    //  orientation: 'Landscape',
    marginLeft: "10mm",
    marginTop: "28mm",
    marginBottom: "15mm",
    headerSpacing: "3",
    footerSpacing: "5",
    headerHtml: "./assets/header.html",
    footerHtml: "./assets/footer.html"
  }).pipe(response);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;
var wkhtmltopdf = require("wkhtmltopdf");

app.use(cors());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));

app.get("/", (req, res) => {
  res.send("BTA Academy");
});

// Access the parse results as request.body
app.post("/print-document", function (request, response) {
  console.log(request.body);
  let dataPreview = request.body;

  response.writeHead(200, {
    "Content-Type": "application/pdf",
    "Content-disposition": "attachment;filename=bta.pdf",
  });

  let html = "";

  html += `
    <div style="font-size: 20px; font-weight: bold">INDUSTRY : ${
      dataPreview.industry
    }</div>
    <div style="font-size: 20px;">SIZE : ${dataPreview.Size.name}</div>
    <div style="font-size: 20px;">
        DIVISION : ${dataPreview.division ? dataPreview.division : "-"}
    </div>
    <div style="font-size: 20px;">
        DEPARTMENT :
        ${dataPreview.department ? dataPreview.department : "-"}
    </div>
    <hr style="border: 1px solid black; margin: 10px 0 20px 0" />`;

  dataPreview.sections.forEach((section) => {
    html += `
    <div style="margin-bottom:40px">
        <div style="font-size: 20px; margin-bottom:20px; font-weight: bold;">
          ${section.title}
        </div>`;

    section.text.forEach((text) => {
      html += `<div class="section-text" style="font-size: 20px; margin-bottom: 20px;">${text}</div>`;
    });

    html += `
    </div>`;
  });

  wkhtmltopdf(html, {
    pageSize: "A4",
    //  orientation: 'Landscape',
    marginLeft: "10mm",
    marginTop: "10mm",
  }).pipe(response);
  console.log("All done");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

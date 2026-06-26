let dfCSV = "";

/* ================= TOAST (UPDATED - NO DOM CREATION) ================= */
let dfToastTimer = null;

function dfToast(msg){
  const toast = document.getElementById("df-sqlcsv-toast");
  if(!toast) return;

  toast.innerText = msg;
  toast.classList.add("show");

  if(dfToastTimer){
    clearTimeout(dfToastTimer);
  }

  dfToastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 10000);
}

/* ================= ELEMENTS ================= */
const dfInput = document.getElementById("df-input");
const dfOutput = document.getElementById("df-output");
const dfOutputPanel = document.getElementById("df-output-panel");
const dfFileInput = document.getElementById("df-file-input");

const dfConvertBtn = document.getElementById("df-convert-btn");
const dfCopyBtn = document.getElementById("df-copy-btn");
const dfDownloadBtn = document.getElementById("df-download-btn");

/* ================= EVENTS ================= */
dfConvertBtn.addEventListener("click", dfConvert);
dfFileInput.addEventListener("change", handleFileUpload);
dfCopyBtn.addEventListener("click", dfCopy);
dfDownloadBtn.addEventListener("click", dfDownload);

/* ================= FILE UPLOAD ================= */
function handleFileUpload(e){
  const file = e.target.files[0];
  if(!file) return;

  const reader = new FileReader();

  reader.onload = function(evt){
    dfInput.value = evt.target.result;
    dfToast("SQL file loaded");
  };

  reader.readAsText(file);
}

/* ================= MAIN CONVERTER ================= */
async function dfConvert(){
  const sql = dfInput.value.trim();

  if(!sql){
    dfToast("Empty SQL input");
    return;
  }

  try{
    dfCSV = "";
    dfOutput.value = "Processing...";

    const inserts = [...sql.matchAll(
      /insert\s+into\s+\w+\s*\((.*?)\)\s*values\s*([\s\S]*?);/gi
    )];

    if(!inserts.length){
      dfToast("No INSERT statements found");
      return;
    }

    let resultChunks = [];
    let processedRows = 0;

    for(const ins of inserts){

      const cols = ins[1].split(",").map(c => c.trim());
      const rows = [...ins[2].matchAll(/\(([^)]+)\)/g)];

      resultChunks.push(cols.join(","));

      let buffer = [];

      for(const r of rows){

        const values = splitValues(r[1]);

        buffer.push(
          values.map(v => `"${v.replace(/"/g,'""')}"`).join(",")
        );

        processedRows++;

        if(processedRows % 1000 === 0){
          await new Promise(res => setTimeout(res, 0));
        }
      }

      if(buffer.length){
        resultChunks.push(buffer.join("\n"));
      }

      resultChunks.push("");
    }

    dfCSV = resultChunks.join("\n").trim();

    dfOutput.value = dfCSV;

    dfOutputPanel.style.display = "block";

    dfToast(`Converted successfully (${processedRows} rows)`);

    dfOutputPanel.scrollIntoView({ behavior: "smooth" });

  }catch(err){
    dfToast(err.message);
  }
}

/* ================= VALUE PARSER ================= */
function splitValues(str){
  let result = [];
  let cur = "";
  let inQuote = false;

  for(let c of str){

    if(c === "'" || c === '"'){
      inQuote = !inQuote;
    }
    else if(c === "," && !inQuote){
      result.push(cur);
      cur = "";
    }
    else{
      cur += c;
    }
  }

  result.push(cur);
  return result;
}

/* ================= COPY ================= */
function dfCopy(){
  navigator.clipboard.writeText(dfCSV);
  dfToast("Copied to clipboard");
}

/* ================= DOWNLOAD ================= */
function dfDownload(){
  const blob = new Blob([dfCSV], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "data.csv";
  a.click();

  URL.revokeObjectURL(url);

  dfToast("Download started");
}
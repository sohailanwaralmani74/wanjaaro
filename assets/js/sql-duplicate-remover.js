let sqlfx_lines = [];
let sqlfx_duplicates = new Set();
let sqlfx_showDup = false;

/* ELEMENTS */
const sqlfx_file =
  document.getElementById("sqlfx-file");

const sqlfx_editor =
  document.getElementById("sqlfx-editor");

const sqlfx_check =
  document.getElementById("sqlfx-check");

const sqlfx_remove =
  document.getElementById("sqlfx-remove");

const sqlfx_download =
  document.getElementById("sqlfx-download");

/* ENABLE */
function enable(el){
  el.classList.remove("sqlfx-btn--disabled");
}

/* FILE UPLOAD */
sqlfx_file.onchange = e => {

  const file = e.target.files[0];

  if(!file) return;

  const reader = new FileReader();

  reader.onload = ev => {

    sqlfx_editor.value =
      ev.target.result;

    enable(sqlfx_check);

  };

  reader.readAsText(file);

};

/* NORMALIZE SQL */
function normalizeSQL(line){

  return line.replace(

    /VALUES\s*\(\s*(?:'[^']*'|"[^"]*"|`[^`]*`|[^,]+)\s*,/i,

    "VALUES ("

  )
  .replace(/\s+/g," ")
  .trim()
  .toLowerCase();

}

/* CHECK DUPLICATES */
sqlfx_check.onclick = () => {

  sqlfx_lines =
    sqlfx_editor.value
    .split("\n")
    .map(line => line.trim())
    .filter(line => line);

  sqlfx_duplicates.clear();

  const seen = new Set();

  sqlfx_lines.forEach((line,index)=>{

    const normalized =
      normalizeSQL(line);

    if(seen.has(normalized)){

      sqlfx_duplicates.add(index);

    }else{

      seen.add(normalized);

    }

  });

  sqlfx_showDup = true;

  const duplicateLines = [];

  sqlfx_lines.forEach((line,index)=>{

    if(sqlfx_duplicates.has(index)){

      duplicateLines.push(line);

    }

  });

  sqlfx_editor.value =
    duplicateLines.join("\n");

  enable(sqlfx_remove);
  enable(sqlfx_download);

};

/* REMOVE DUPLICATES */
sqlfx_remove.onclick = () => {

  const cleaned = [];

  sqlfx_lines.forEach((line,index)=>{

    if(!sqlfx_duplicates.has(index)){

      cleaned.push(line);

    }

  });

  sqlfx_editor.value =
    cleaned.join("\n");

  sqlfx_duplicates.clear();

  sqlfx_showDup = false;

};

/* DOWNLOAD SQL */
sqlfx_download.onclick = () => {

  const blob = new Blob(
    [sqlfx_editor.value],
    { type:"text/sql" }
  );

  const a = document.createElement("a");

  a.href =
    URL.createObjectURL(blob);

  a.download = "cleaned.sql";

  a.click();

};

let dfx_data = [];
let dfx_dupes = new Set();
let dfx_showDup = false;

/* ELEMENTS */
const dfx_file = document.getElementById("dfx-file");
const dfx_table = document.getElementById("dfx-table");
const dfx_placeholder = document.getElementById("dfx-placeholder");

const dfx_check = document.getElementById("dfx-check");
const dfx_remove = document.getElementById("dfx-remove");

const dfx_xlsx = document.getElementById("dfx-xlsx");
const dfx_xls = document.getElementById("dfx-xls");
const dfx_csv = document.getElementById("dfx-csv");

/* UPLOAD */
dfx_file.onchange = e => {

  const file = e.target.files[0];
  if(!file) return;

  const reader = new FileReader();

  reader.onload = ev => {

    const wb = XLSX.read(
      new Uint8Array(ev.target.result),
      { type:"array" }
    );

    const ws = wb.Sheets[wb.SheetNames[0]];

    dfx_data = XLSX.utils.sheet_to_json(ws, { header:1 });

    dfx_dupes.clear();
    dfx_showDup = false;

    render();

    dfx_placeholder.style.display = "none";

    enable(dfx_check);

  };

  reader.readAsArrayBuffer(file);

};

/* RENDER */
function render(){

  dfx_table.innerHTML = "";

  let view = dfx_data;

  if(dfx_showDup){
    view = dfx_data.filter((_,i)=>
      i===0 || dfx_dupes.has(i)
    );
  }

  view.forEach((row,i)=>{

    const tr = document.createElement("tr");

    if(dfx_dupes.has(i)){
      tr.classList.add("dfx-row--duplicate");
    }

    row.forEach(cell=>{

      const el = document.createElement(
        i===0 ? "th" : "td"
      );

      el.className = i===0
        ? "dfx-th"
        : "dfx-td";

      el.textContent = cell ?? "";

      const resizer = document.createElement("div");
      resizer.className = "dfx-resizer";

      attachResize(el,resizer);

      el.appendChild(resizer);

      tr.appendChild(el);

    });

    dfx_table.appendChild(tr);

  });

}

/* RESIZE */
function attachResize(cell,resizer){

  let x,w;

  resizer.onmousedown = e => {

    x = e.pageX;
    w = cell.offsetWidth;

    document.onmousemove = e => {
      cell.style.width =
        w + (e.pageX - x) + "px";
    };

    document.onmouseup = () => {
      document.onmousemove = null;
    };

  };

}

/* CHECK DUPLICATES */
dfx_check.onclick = () => {

  dfx_dupes.clear();

  const map = new Map();

  for(let i=1;i<dfx_data.length;i++){

    const key = JSON.stringify(
      dfx_data[i]
      .slice(1)
      .map(v =>
        String(v).trim().toLowerCase()
      )
    );

    if(map.has(key)){
      dfx_dupes.add(i);
    }else{
      map.set(key,true);
    }

  }

  dfx_showDup = true;

  render();

  enable(dfx_remove);
  enable(dfx_xlsx);
  enable(dfx_xls);
  enable(dfx_csv);

};

/* REMOVE */
dfx_remove.onclick = () => {

  dfx_data = dfx_data.filter((_,i)=>
    i===0 || !dfx_dupes.has(i)
  );

  dfx_dupes.clear();
  dfx_showDup = false;

  render();

};

/* XLSX */
dfx_xlsx.onclick = () => {

  const ws = XLSX.utils.aoa_to_sheet(dfx_data);
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  XLSX.writeFile(wb,"data.xlsx");

};

/* XLS */
dfx_xls.onclick = () => {

  const ws = XLSX.utils.aoa_to_sheet(dfx_data);
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  XLSX.writeFile(wb,"data.xls",{bookType:"xls"});

};

/* CSV */
dfx_csv.onclick = () => {

  const ws = XLSX.utils.aoa_to_sheet(dfx_data);

  const csv = XLSX.utils.sheet_to_csv(ws);

  const blob = new Blob([csv],{
    type:"text/csv"
  });

  const a = document.createElement("a");

  a.href = URL.createObjectURL(blob);
  a.download = "data.csv";
  a.click();

};

/* ENABLE */
function enable(el){
  el.classList.remove("dfx-btn--disabled");
}

/* 
===========================================
 Developer: Sohail Anwar  
 Business Flow Analyst: Gourav Mishra  
 Project: YAML ➜ JSON Converter
===========================================
*/

/* --------------------------------------------------
   Utility: Show Toast Notification
-------------------------------------------------- */
function showToast(message) {
    const toast = document.getElementById("toastYaml");
    toast.innerText = message;
    toast.style.opacity = "1";

    setTimeout(() => {
        toast.style.opacity = "0";
    }, 1800);
}

/* --------------------------------------------------
   Enable/Disable Convert Button on Input Change
-------------------------------------------------- */
document.getElementById("yamlInputEditor").addEventListener("input", function () {
    const convertBtn = document.getElementById("convertBtnYaml");
    convertBtn.disabled = this.value.trim().length === 0;
});

/* --------------------------------------------------
   YAML File Upload Handler
-------------------------------------------------- */
document.getElementById("fileInputYaml").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
        document.getElementById("yamlInputEditor").value = e.target.result;
        document.getElementById("convertBtnYaml").disabled = false;
    };

    reader.readAsText(file);
});

/* --------------------------------------------------
   Convert YAML → JSON Function
-------------------------------------------------- */
function convertYamlToJson() {
    const yamlText = document.getElementById("yamlInputEditor").value.trim();
    const outputArea = document.getElementById("outputAreaJson");

    if (!yamlText) {
        showToast("❌ Please enter valid YAML!");
        return;
    }

    try {
        // Use js-yaml for conversion (automatic YAML parsing)
        const jsonObject = jsyaml.load(yamlText);

        // Format JSON output with indentation
        const formattedJson = JSON.stringify(jsonObject, null, 2);

        outputArea.value = formattedJson;

        showToast("✅ Successfully Converted!");

        // Auto-scroll to output section
        document.getElementById("convertedFile").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    } catch (error) {
        showToast("❌ Invalid YAML Format!");
        console.error("Conversion Error:", error);
    }
}

/* --------------------------------------------------
   Convert Button Click Event
-------------------------------------------------- */
document.getElementById("convertBtnYaml").addEventListener("click", convertYamlToJson);

/* --------------------------------------------------
   Copy JSON Output to Clipboard
-------------------------------------------------- */
document.getElementById("copyOutputBtnJson").addEventListener("click", function () {
    const output = document.getElementById("outputAreaJson").value;

    if (!output.trim()) {
        showToast("❌ Nothing to copy!");
        return;
    }

    navigator.clipboard.writeText(output).then(() => {
        showToast("📋 JSON Copied!");
    });
});

/* --------------------------------------------------
   Export JSON Output as .json File
-------------------------------------------------- */
document.getElementById("exportOutputBtnJson").addEventListener("click", function () {
    const jsonOutput = document.getElementById("outputAreaJson").value;

    if (!jsonOutput.trim()) {
        showToast("❌ Nothing to export!");
        return;
    }

    const blob = new Blob([jsonOutput], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "converted.json";
    a.click();

    URL.revokeObjectURL(url);

    showToast("💾 File Exported!");
});

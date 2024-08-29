let mainarr = [];
const checkboxStates = {};
var getJsonData;



document.getElementById('input-file').addEventListener('change', handleFile, false);
let filterproduct = [];
let highratingproduct = [];
function handleFile(event) {
    console.log('hyy');
    const file = event.target.files[0];
    if (!file) {
        alert("Please select a file.");
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
        try {

            console.log('hyy');
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            // Assuming the first sheet is the one you want to read
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            // Convert the worksheet to JSON
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            console.log(jsonData);

            getJsonData = jsonData;
            console.log(getJsonData, ": For GetJsonData")


            chrome.runtime.sendMessage({
                message: "UrlData",
                exel: jsonData
            });

        } catch (error) {
            console.error("Error reading file:", error);
        }
    };
    reader.onerror = function (ex) {
        console.error("File could not be read! Code " + ex.target.error.code);
    };
    reader.readAsArrayBuffer(file);
}

document.getElementById("sendMessage").addEventListener("click", function () {
    console.log('hyyy');
    let textArea = `${document.querySelector("#textArea")?.value}`;
    console.log(textArea, ":textArea");
    const asinArray = textArea.trim().split("\n").map(asin => asin.trim());
    console.log(asinArray, "asinArray");
    const selectedValue = document.getElementById('selectInput').value;
    console.log('Button 1 clicked, text:', 'selected value:', selectedValue);
    chrome.runtime.sendMessage({
        message: "gettime",
        time: selectedValue
    });

    chrome.runtime.sendMessage({
        message: "UrlData",
        exel: asinArray
    });
    chrome.runtime.sendMessage({ greeting: "hello" }, function (response) {
        console.log("Response from background:", response);
    });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message === "extactfile") {

        console.log('Received data: ', request.Data);
        let exel_sheet = request.Data;

        const resultArray = [];

        // Convert objects to arrays
        for (let i = 0; i < exel_sheet.length; i++) {
            let row = [
                exel_sheet[i]?.asin,
                exel_sheet[i]?.nSupressed,
                exel_sheet[i]?.browseNode,
                exel_sheet[i]?.title,
                exel_sheet[i]?.imageUrls,
                exel_sheet[i]?.image,
                exel_sheet[i]?.rating,
                exel_sheet[i]?.reviews,
                // exel_sheet?[i].storefrontLink,
                // exel_sheet?[i].genericName,
                exel_sheet[i]?.variations,
                exel_sheet[i]?.deal,
                exel_sheet[i]?.soldBy,
                exel_sheet[i]?.bulletPointCount,
                exel_sheet[i]?.Description,
                exel_sheet[i]?.price,
                exel_sheet[i]?.mrp,
                // exel_sheet?[i].brand,
                // exel_sheet?[i].availability,
                exel_sheet[i]?.videoAvailability,
                exel_sheet[i]?.genericName,
                exel_sheet[i]?.imagecount,
            ];
            resultArray.push(row);
        }

        // Insert header row
        const header = ["Asin", "nSupressed", "browseNode", "title", "imageUrls", "image", "rating", "reviews", "variations", "deal", "soldBy", "bulletPointCount", "Description", "price", "mrp", "videoAvailability","genericName", "imagecount"];
        resultArray.unshift(header);

        const ws = XLSX.utils.aoa_to_sheet(resultArray);

        // Create a new workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

        // Write the workbook
        const nowUTC = new Date().toISOString();
        console.log(nowUTC);
        XLSX.writeFile(wb, `Audit ${nowUTC}.xlsx`);
    }
});

document.getElementById("downloadExcel").addEventListener("click", () => {

    chrome.runtime.sendMessage({ greeting: "downloadexelsheet" }, function (response) {
        console.log("Response from background:", response);
    });
});
window.onload = function () {
    console.log('hyy');
    chrome.runtime.sendMessage({
        message: "openpopup"
    });
}
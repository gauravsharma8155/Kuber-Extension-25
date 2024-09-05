let mainarr = [];
const checkboxStates = {};
var getJsonData;

document.getElementById("sendMessage").addEventListener("click", function () {
    console.log('hyyy');
    chrome.runtime.sendMessage({ greeting: "hello" }, function (response) {
        console.log("Response from background:", response);
    });
});
let images = false;
// let btnextractdata = document.getElementById("btnextractdata").addEventListener("click", () => {
//     let extractuserdata = document.getElementById("extractuserdata").value
//     console.log(extractuserdata, "extractuserdata");
//     let getarr = extractuserdata.split(',');
//     console.log(getarr, ":For Getarr");
//     getarr.map((item) => {
//         if (item.includes('img')) {
//             localStorage.setItem('images', Boolean(true))
//         }
//         else if (item.includes('tit')) {
//             localStorage.setItem('title', Boolean(true));
//         }
//         else if (item.includes('b')) {
//             localStorage.setItem('title', Boolean(true));
//         }
//     })

// })




// document.getElementById("GetData").addEventListener("click", function () {
//     console.log('hyyy');
//     chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//         if (request.action === "sendData") {
//             console.log('Received data: ', request.data);
//             mainarr.push(request.data);
//             console.log(mainarr);
//         }
//     });
// });

// document.getElementById('getarray').addEventListener('click', () => {
//     chrome.runtime.sendMessage({ greeting: "getarray" }, function (response) {
//         console.log("Response from background:", response);
//     });
// })

document.getElementById("downloadExcel").addEventListener("click", () => {
    chrome.runtime.sendMessage({ greeting: "downloadexelsheet" }, function (response) {
        console.log("Response from background:", response);
    });
})



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
            ];
            resultArray.push(row);
        }

        // Insert header row
        const header = ["Asin", "nSupressed", "browseNode", "title", "imageUrls", "image", "rating", "reviews", "variations", "deal", "soldBy", "bulletPointCount", "Description", "price", "mrp", "videoAvailability"];
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

document.getElementById("checkdata").addEventListener("click", () => {
    const img = localStorage.getItem("images");
    console.log(typeof img, "img>>>>>>>>>>");
}
)

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

const checkboxes = document.querySelectorAll('input[type="checkbox"]');

// Add onclick event listener to each checkbox
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('click', function () {
        console.log(`${this.id} is ${this.checked ? 'checked' : 'unchecked'}`);
    });
});

document.getElementById("collect_btn").addEventListener("click", () => {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    // Initialize an object to store the checkbox states

    // Loop through each checkbox to get its checked state
    checkboxes.forEach(checkbox => {
        checkboxStates[checkbox.id] = checkbox.checked;
    });


    // Log the states to the console
    console.log(checkboxStates);
    chrome.runtime.sendMessage({ greeting: "hello", data: checkboxStates }, function (response) {
        console.log("Response from background:", response);
    });
});


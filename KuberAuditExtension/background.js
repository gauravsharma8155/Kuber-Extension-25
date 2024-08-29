
// setTimeout(() => {
//     chrome.tabs.remove(sender.tab.id, function () {
//         // console.log("Tab with ID " + sender.tab.id + " has been closed.");
//     });
// }, 10000);
let linkArray = [];
var newasinarr;
var timestart;
chrome.runtime.onMessage.addListener(function (request) {
    if (request.message == "UrlData") {
        let asin = request.exel
        console.log(asin, "For asin");
        // newasinarr = asin.slice(-1)[0][0]
        // console.log(newasinarr, ":For newasinarr");
        asin.map((item) => {
            linkArray.push(`https://amazon.in/dp/${item}`);
        });
    }
    else if (request.message == "gettime") {
        console.log(request.time);
        timestart = request.time
    }
})

let listarra = [];
let headerArray = []

// console.log('This is console for background.js');
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // console.log("Message received in background:", request);

    // listarra.push(request.data);
    if (request.data) {
        listarra.push(request.data);
        console.log(listarra);
    }

    if (request.greeting === "hello") {
        console.log(linkArray, "For LinkArray");
        console.log('message accpect', request.data);
        const receive_object = request.data


        for (var i = 0; i < linkArray.length; i++) {
            // console.log(newasinarr, ": For NewAsinArr");

           
            (function (i) {
                setTimeout(() => {
                    // if (`https://amazon.in/dp/${newasinarr}` == linkArray[i]) {
                    //     console.log('sendingmessAGE sucessfully');  
                    //     download = true;
                    // }
                    chrome.tabs.create({
                        url: linkArray[i]
                    }, function (tab) {
                        // console.log("Created tab: " + tab.id + " with URL: " + linkArray[i]);
                    });
                    console.log(timestart, ":For timeStart");
                }, timestart * i);
            })(i);
        }
    }
});


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // console.log("Message received in background:", request);
    if (request.greeting === "getarray") {
        // console.log(listarra, "FOr loggggggg>>>>>>>>>>>.");
    }

});



chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "closeTab") {
        console.log("Close the tab that sent the message")
        // console.log(sender.tab.id, "sender.tab.id");

        chrome.tabs.remove(sender.tab.id, function () {
            // console.log("Tab with ID " + sender.tab.id + " has been closed.");
        });
    }
});

let send_main_obj = []



chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.greeting === "") {
        console.log('message recived', listarra);
        chrome.runtime.sendMessage({
            message: "extactfile",
            Data: listarra,
        })
    }
});




// This script is injected and executed by the background script
setTimeout(() => {
    let cuurent_url = location.href;
    if (cuurent_url.includes('dp')) {
        window.close();
        chrome.runtime.sendMessage({ action: "closeTab" });  
    }
    
}, 10000);
const check_url = location.href;
function getASIN(url) {
    // Create a URL object to parse the URL
    const urlObj = new URL(url);

    // Extract the ASIN from the pathname
    const pathname = urlObj.pathname;

    // The ASIN is typically the last segment of the pathname
    const asinMatch = pathname.match(/\/dp\/([^\/]+)/);

    // Return the ASIN if found, otherwise return null
    return asinMatch ? asinMatch[1] : null;
}

// Example usage

chrome.runtime.onMessage.addListener(function (request) {
    if (request.message === "getobject") {
        console.log(request.receive_object, "receive_objectreceive_object>>>>>>>>>>>>")
    } else {

    }
})

if (check_url.includes('dp')) {
    let Status = ''
    let Supressed = document.querySelector(".h1")
    if (Supressed) {
        console.log('inside this status??????????????????????>>>>>>>>>>>>>>>');

        Status = 'Supressed'
        let main_asin_val = getASIN(check_url)
        let send_obj = { main_asin_val, Status }
        // chrome.runtime.sendMessage({ action: "sendData", data: send_obj }, function (response) {
        //     console.log('Data sent to popup.js');
        // });
        // Send a message to the background script to close the current tab
        chrome.runtime.sendMessage({ action: "closeTab" });
    } else {
        Status = 'Live'
    }
    console.log("suppressed>>>>>>>>>>>>>>>>>>>>>>>", Status);
    let asin = getASIN(check_url);
    console.log(asin, "form object");

    let suppressed_data = document.getElementById("all-offers-display-params");
    console.log(suppressed_data, ":For supp")

    var elements = suppressed_data.getAttribute('data-asin');
    // var dataAsinValues = Array.from(elements).map(element => element.getAttribute('data-asin'));
    // console.log(dataAsinValues[3]);
    console.log(elements)
    let maindatasin_val = elements
    console.log(maindatasin_val, "maindatasin_val");

    if (maindatasin_val == asin) {
        Status = 'live'
    } else {
        Status = 'Supressed'
        // asin = dataAsinValues[3]
    }
    console.log(Status, "nSupressednSupressed")
    console.log(asin, "for ASIN", maindatasin_val);

    // BrowseNode
    let browseNode = document.querySelector('div#wayfinding-breadcrumbs_feature_div ul.a-unordered-list.a-horizontal.a-size-small') ? Array.from(document.querySelectorAll('div#wayfinding-breadcrumbs_feature_div ul.a-unordered-list.a-horizontal.a-size-small li')).map(li => li.textContent.trim()).join('') : null;
    //title
    let title = document.getElementById("productTitle").textContent;
    //AllImages
    const images = document.querySelectorAll('#altImages img');
    const imageUrls = [];
    images.forEach(img => {
        imageUrls.push(img.src);
    });
    let imagecount = images?.length
    // MainImage
    let image = (() => { try { let ulElement = document.querySelector("ul.a-unordered-list.a-nostyle.a-button-list.a-vertical.a-spacing-top-micro.gridAltImageViewLayoutIn1x7") || document.querySelector("ul.a-unordered-list.a-nostyle.a-button-list.a-vertical.a-spacing-top-extra-large.regularAltImageViewLayout"); return ulElement ? Array.from(ulElement.querySelectorAll('img')).map(img => img.src).find(src => src.endsWith('.jpg'))?.replace("SS100", "SS1000") : null; } catch (e) { console.error("An error occurred:", e); return null; } })();
    // Rating
    let rating = document.querySelector('span#acrCustomerReviewText') ? document.querySelector('span#acrCustomerReviewText').textContent : "Not Available";
    // Review
    let reviews = document.querySelector('span#acrPopover') ? document.querySelector('span#acrPopover').getAttribute('title')?.split()[0] || "Not Available" : "Not Available";
    // storefrontLink
    let storefrontLink = document.querySelector('a#bylineInfo') ? `http://amazon.in${document.querySelector('a#bylineInfo').getAttribute('href')} ` : '';
    //Generic Name
    let genericName = Array.from(document.querySelectorAll('table#productDetails_detailBullets_sections1 tr')).find(row => row.querySelector('th.a-color-secondary.a-size-base.prodDetSectionEntry')?.textContent.trim() === 'Generic Name')?.querySelector('td.a-size-base.prodDetAttrValue')?.textContent.trim() || null;
    //Variation
    let variations = document.querySelector('#variation_color_name, #variation_size_name, #variation_pattern_name, #variation_style_name') ? 'Available' : 'NA';
    // Deal
    let deal = document.querySelector('span.dealBadgeTextColor') && document.querySelector('span.dealBadgeTextColor').textContent.includes('Limited time deal') ? 'Available' : 'NA';
    //Sold By
    let soldBy = document.querySelector('div.tabular-buybox-text[tabular-attribute-name="Sold by"] span.a-size-small.tabular-buybox-text-message a') ? document.querySelector('div.tabular-buybox-text[tabular-attribute-name="Sold by"] span.a-size-small.tabular-buybox-text-message a').textContent.trim() : null;
    console.log(soldBy);
    // Bullet Points
    let bulletPointCount = (() => { let element = document.querySelector("div#feature-bullets ul.a-unordered-list.a-vertical.a-spacing-mini"); return element ? element.querySelectorAll('li').length : 0; })();
    console.log(bulletPointCount, "bulletPointCount");
    //Best Seller Rank
    let [bsr1, bsr2] = (() => { let table = document.querySelector('table#productDetails_detailBullets_sections1'), bestSellersTd = table ? Array.from(table.querySelectorAll('th')).find(th => th.textContent.trim() === 'Best Sellers Rank')?.nextElementSibling : null; if (bestSellersTd) { let ranks = Array.from(bestSellersTd.querySelectorAll('span')).map(span => span.textContent.trim()).join(' ').split('#').slice(1, 3); return ranks.length < 2 ? ranks.concat("Not Available".repeat(2 - ranks.length).split(" ")) : ranks; } else { return ["Not Available", "Not Available"]; } })();
    console.log([bsr1, bsr2], "[bsr1, bsr2]");
    //productDescription
    let productDescription = document.querySelector('#productDescription') ? document.querySelector('#productDescription') : null
    let Description = ''
    if (productDescription) {
        Description = productDescription.querySelector('span').textContent ? productDescription.querySelector('span').textContent : null
    }
    else {
        Description = 'Not Available'
    }
    // Price
    let price = document.querySelector("span.a-price-whole") ? document.querySelector("span.a-price-whole").textContent.trim() : null;
    //MRP
    let mrp = document.querySelector('span.a-price.a-text-price span.a-offscreen') ? document.querySelector('span.a-price.a-text-price span.a-offscreen').textContent : '';
    //Brand Name
    let brand = document.querySelector('div#brandSnapshot_feature_div span.a-size-medium.a-text-bold') ? document.querySelector('div#brandSnapshot_feature_div span.a-size-medium.a-text-bold').textContent.trim() : null;
    // Availability
    let availability = document.querySelector("div#availability") ? document.querySelector("div#availability").innerText.split("\n").map(line => line.trim()).filter(line => line).join(" ") : null;
    // VideoAvailability
    let videoAvailability = document.querySelector('li.videoThumbnail img') ? 'Available' : 'Not Available';
    setTimeout(() => {
        console.log(check_url,asin);    
        let main_url  = location.href;
        const collect_Asin = getASIN(main_url);
        console.log(collect_Asin, "collect_asin");

    }, 500);
    let send_obj
    if (maindatasin_val == asin) {
        send_obj = {
            asin, Status, browseNode, title, imageUrls, image, rating, reviews, variations, deal, soldBy, bulletPointCount, Description, price, mrp, videoAvailability,genericName,imagecount
        }
    } else {
        send_obj = { asin, Status }
    }
    // const send_obj = {
    //     asin, rating, reviews
    // }
    console.log(send_obj);


    chrome.runtime.sendMessage({ action: "sendData", data: send_obj }, function (response) {
        console.log('Data sent to popup.js');
    });
    // Send a message to the background script to close the current tab
    chrome.runtime.sendMessage({ action: "closeTab" });
}
else {
    console.log(`url does not ${check_url}`);
}


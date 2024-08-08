let div = document.querySelector(".info-main");

let table = div.querySelector("table");

function getNestedLIValue(doc) {
    let infoExtraDiv = doc.querySelector(".info-extra");
    if (!infoExtraDiv) {
        console.error("No div with class 'info-extra' found");
        return null;
    }

    let table = infoExtraDiv.querySelector("table");
    if (!table) {
        console.error("No table found inside the div with class 'info-extra'");
        return null;
    }

    let tbody = table.querySelector("tbody");
    if (!tbody) {
        console.error("No tbody found in the table");
        return null;
    }

    let rows = tbody.querySelectorAll("tr");
    if (rows.length < 2) {
        console.error("Less than 2 rows found in the tbody");
        return null;
    }

    let secondRow = rows[1];
    let td = secondRow.querySelector("td");
    if (!td) {
        console.error("No td found in the second row");
        return null;
    }

    let ul = td.querySelector("ul");
    if (!ul) {
        console.error("No ul found in the td of the second row");
        return null;
    }

    let li = ul.querySelector("li");
    if (!li) {
        console.error("No li found in the ul");
        return null;
    }

    return li.textContent.trim();
}

function getSetNumbers(text) {
    // Regular expression to match the desired pattern
    let regex = /([A-Z0-9-]+)\/([0-9]+)/;

    // Executing the regex on the input text
    let match = text.match(regex);
    //console.log("Match ", match);

    if (match) {
        // Extracting the parts before and after the slash
        let boxNumber = match[1];
        let cardNumber = match[2];

        boxNumber = boxNumber.replace(/-/g, "").toLowerCase();

        return { boxNumber, cardNumber };
    } else {
        // Return null if the pattern does not match
        return null;
    }
}

const getWebsite = async (url) => {
    //console.log(url);
    return fetch(url)
        .then((response) => {
            //console.log("response ", response);
            if (!response.ok) throw console.error(response.body);
            return response.text();
        })
        .catch((e) => console.error(e));
};

function extractValueFromHTML(html) {
    let parser = new DOMParser();
    let doc = parser.parseFromString(html, "text/html");

    // Example: Find and return a specific value from the HTML content
    let value = doc.querySelector(".lhs h4")?.textContent || "No value found";

    return value;
}

let newRow = table.insertRow();
let cell = newRow.insertCell(0);
cell.textContent = "YYT Price";
let cell2 = newRow.insertCell(1);
const setNumbers = getSetNumbers(getNestedLIValue(document));
const link = `https://yuyu-tei.jp/sell/vg/card/${setNumbers.boxNumber}/10${setNumbers.cardNumber}`;

getWebsite(link).then((data) => {
    //console.log("data", data);
    const extractedValue = extractValueFromHTML(data);
    //console.log(extractedValue);
    const div = document.createElement("div");

    const valueSpan = document.createElement("span");
    valueSpan.textContent = extractedValue + "\t";

    const anchor = document.createElement("a");
    anchor.href = link;
    anchor.textContent = "View on YYT";
    anchor.target = "_blank";

    div.appendChild(valueSpan);
    div.appendChild(anchor);
    cell2.appendChild(div);
});

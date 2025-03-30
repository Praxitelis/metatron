document.addEventListener("DOMContentLoaded", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript(
            {
                target: { tabId: tabs[0].id },
                function: getSEODataFromPage
            },
            (results) => {
                if (results && results[0] && results[0].result) {
                    displaySEOData(results[0].result);
                }
            }
        );
    });
});

function getSEODataFromPage() {
    const seoData = {
        title: document.title,
        metaDescription: document.querySelector("meta[name='description']")?.content || "Not found",
        canonical: document.querySelector("link[rel='canonical']")?.href || "Not found",
        robots: document.querySelector("meta[name='robots']")?.content || "Not found",
        headers: [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map(h => ({
            tag: h.tagName,
            text: h.innerText.trim()
        })),
        openGraph: [...document.querySelectorAll("meta[property^='og:'], meta[name^='og:']")].map(meta => meta.getAttribute('property') + ": " + meta.content),
        twitterTags: [...document.querySelectorAll("meta[name^='twitter:']")].map(meta => meta.getAttribute('name') + ": " + meta.content)
    };

    return seoData;
}

function displaySEOData(seoData) {
    const seoContainer = document.getElementById("seo-data");
    seoContainer.innerHTML = `
        <p><strong>Title:</strong> ${seoData.title}</p>
        <p><strong>Meta Description:</strong> ${seoData.metaDescription}</p>
        <p><strong>Canonical:</strong> ${seoData.canonical}</p>
        <p><strong>Robots:</strong> ${seoData.robots}</p>
        <div class="headers-section">
            <strong>Headings:</strong>
            ${formatHeaders(seoData.headers)}
        </div>
        <div class="og-section">
            <strong>Open Graph:</strong><br> ${seoData.openGraph.join("<br>")}
        </div>
        <div class="twitter-section">
            <strong>Twitter Tags:</strong><br> ${seoData.twitterTags.join("<br>")}
        </div>
    `;
}

function formatHeaders(headers) {
    const grouped = { H1: [], H2: [], H3: [], H4: [], H5: [], H6: [] };

    // Group headers by level
    headers.forEach(header => {
        grouped[header.tag].push(header.text);
    });

    // Format headers with section dividers
    return Object.keys(grouped)
        .filter(tag => grouped[tag].length > 0)
        .map(tag => `
            <div class="heading-group ${tag.toLowerCase()}">
                <strong>${tag}</strong>
                <ul>
                    ${grouped[tag].map(text => `<li>${text}</li>`).join("")}
                </ul>
            </div>
        `)
        .join("");
}
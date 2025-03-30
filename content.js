(() => {
    const seoData = {
        title: document.title,
        metaDescription: document.querySelector("meta[name='description']")?.content || "Not found",
        canonical: document.querySelector("link[rel='canonical']")?.href || "Not found",
        robots: document.querySelector("meta[name='robots']")?.content || "Not found",
        headers: [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map(h => h.tagName + ": " + h.innerText),
        openGraph: [...document.querySelectorAll("meta[property^='og:'], meta[name^='og:']")].map(meta => meta.getAttribute('property') + ": " + meta.content),
        twitterTags: [...document.querySelectorAll("meta[name^='twitter:']")].map(meta => meta.getAttribute('name') + ": " + meta.content)
    };

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === "getSEOData") {
            sendResponse(seoData);
        }
    });
})();

async function loadXMLDoc(filename) {
    const response = await fetch(filename);
    const text = await response.text();
    return new DOMParser().parseFromString(text, "application/xml");
}

async function createPdf() {
    console.log("PDF wird generiert...");
    try {
        // Load data and stylesheet
        const dbXml = await loadXMLDoc('../data/database.xml');
        const xslFo = await loadXMLDoc('xsl/fo.xsl');

        // Initialize XSLT Processor
        const xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(xslFo);

        // Transform database XML to FO (which is also XML)
        const resultDoc = xsltProcessor.transformToDocument(dbXml);
        const serializer = new XMLSerializer();
        const foString = serializer.serializeToString(resultDoc);

        // Send FO string to server
        const response = await fetch('/convertToPdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/xml'
            },
            body: foString
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
            link.href = url;
            link.download = 'EnerCheck_Report.pdf';
            document.body.appendChild(link);
            link.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(link);
        } else {
            console.error('PDF konnte nicht generiert werden: ', await response.text());
            alert('Das PDF konnte nicht generiert werden, siehe Konsole für Details. Sind sie mit dem HSLU-Netz verbunden?');
        }
    } catch (error) {
        console.error('Fehler während der PDF-Generation: ', error);
        alert('Ein Fehler entstand während der Generation des PDFs.');
    }
}

async function submitSupplierXml(xmlString) {
    const response = await fetch('/lieferanten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/xml' },
        body: xmlString
    });

    const text = await response.text();
    return { ok: response.ok, status: response.status, text };
}

function escapeXmlText(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&apos;');
}

function initLieferantenForm() {
    const form = document.getElementById('lieferanten-form');
    
    if (form) {
        const statusEl = document.getElementById('lieferanten-status');

        const validateAndGenerate = async () => {
            const region = form.querySelector('[name="region"]').value.trim();
            const password = form.querySelector('[name="password"]').value.trim();
            const type = form.querySelector('[name="type"]').value.trim();
            const date = form.querySelector('[name="date"]').value.trim();
            const price = form.querySelector('[name="price"]').value.trim();

            const parts = [];
            parts.push(`<lieferant>`);
            if (region) parts.push(`<region>${escapeXmlText(region)}</region>`);
            if (password) parts.push(`<password>${escapeXmlText(password)}</password>`);
            if (type) parts.push(`<type>${escapeXmlText(type)}</type>`);
            if (date) parts.push(`<date>${escapeXmlText(date)}</date>`);
            if (price) parts.push(`<price>${escapeXmlText(price)}</price>`);
            parts.push(`</lieferant>`);

            const xml = parts.join('');

            try {
                const response = await fetch('/validateSuppliers', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/xml' },
                    body: xml
                });
                
                const resultText = await response.text();
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(resultText, "application/xml");
                const message = xmlDoc.getElementsByTagName("message")[0]?.textContent || "Unknown response";
                
                if (response.ok) {
                    if (statusEl) {
                        statusEl.textContent = 'XML generated and valid: ' + message;
                        statusEl.style.color = 'green';
                    }
                } else {
                    const details = xmlDoc.getElementsByTagName("data")[0]?.textContent || "";
                    if (statusEl) {
                        statusEl.textContent = 'Validation error: ' + message + (details ? " - " + details : "");
                        statusEl.style.color = 'red';
                    }
                }
            } catch (err) {
                console.error('Real-time validation failed:', err);
            }
        };

        // Add event listeners for each field to trigger validation
        form.querySelectorAll('input, select').forEach(element => {
            element.addEventListener('change', validateAndGenerate);
            element.addEventListener('input', validateAndGenerate);
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const region = form.querySelector('[name="region"]').value.trim();
            const password = form.querySelector('[name="password"]').value.trim();
            const type = form.querySelector('[name="type"]').value.trim();
            const date = form.querySelector('[name="date"]').value.trim();
            const price = form.querySelector('[name="price"]').value.trim();

            if (!region || !password || !type || !date || !price) {
                if (statusEl) {
                    let missing = [];
                    if (!region) missing.push("Region");
                    if (!password) missing.push("Password");
                    if (!type) missing.push("Type");
                    if (!date) missing.push("Date");
                    if (!price) missing.push("Price");
                    statusEl.textContent = 'Error: Missing fields: ' + missing.join(", ");
                    statusEl.style.color = 'red';
                }
                return;
            }

            const parts = [];
            parts.push(`<lieferant>`);
            parts.push(`<region>${escapeXmlText(region)}</region>`);
            parts.push(`<password>${escapeXmlText(password)}</password>`);
            parts.push(`<type>${escapeXmlText(type)}</type>`);
            parts.push(`<date>${escapeXmlText(date)}</date>`);
            parts.push(`<price>${escapeXmlText(price)}</price>`);
            parts.push(`</lieferant>`);

            const xml = parts.join('');

            if (statusEl) {
                statusEl.textContent = 'Saving...';
                statusEl.style.color = 'black';
            }

            try {
                const result = await submitSupplierXml(xml);
                if (result.ok) {
                    if (statusEl) {
                        statusEl.textContent = 'Saved successfully.';
                        statusEl.style.color = 'green';
                    }
                    form.reset();
                } else {
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(result.text, "application/xml");
                    const message = xmlDoc.getElementsByTagName("message")[0]?.textContent || "Save failed";
                    const details = xmlDoc.getElementsByTagName("data")[0]?.textContent || "";
                    
                    if (statusEl) {
                        statusEl.textContent = `Save failed: ${message} ${details}`;
                        statusEl.style.color = 'red';
                    }
                    console.error('Supplier save failed:', result.text);
                }
            } catch (err) {
                if (statusEl) {
                    statusEl.textContent = 'Save failed. See console.';
                    statusEl.style.color = 'red';
                }
                console.error(err);
            }
        });
    }
}

// Load the dashboard as soon as the page is ready
window.addEventListener('DOMContentLoaded', () => {
    initLieferantenForm();
});

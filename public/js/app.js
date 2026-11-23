// Fallback list in case index.html is opened directly via file://
const FALLBACK_BREEDS = [
    "abyssinian",
    "americanbobtail",
    "americanshorthair",
    "bengal",
    "birman",
    "bombay",
    "burmese",
    "chartreux",
    "cornishrex"
];

const BREED_DETAILS = {
    abyssinian: {
        title: "Abyssinian",
        price: "$1,000 – $2,000",
        origin: "Southeast Asia / Indian Ocean coast",
        temperament: "Active, curious, playful, social",
        lifespan: "12 – 15 years",
        description: "Known for its ticked tabby coat and athletic build, the Abyssinian is an energetic and inquisitive companion that loves high perches."
    },
    americanbobtail: {
        title: "American Bobtail",
        price: "$800 – $1,800",
        origin: "United States",
        temperament: "Affectionate, intelligent, adaptable",
        lifespan: "13 – 15 years",
        description: "Recognizable by its naturally short bobbed tail, this sturdy breed is known for a dog-like devotion and calm, family-friendly personality."
    },
    americanshorthair: {
        title: "American Shorthair",
        price: "$600 – $1,500",
        origin: "United States",
        temperament: "Easygoing, gentle, independent",
        lifespan: "15 – 20 years",
        description: "A classic working breed descended from early European settlers' cats, prized for its longevity, balanced temperament, and dense coat."
    },
    bengal: {
        title: "Bengal",
        price: "$1,500 – $3,500",
        origin: "United States",
        temperament: "Energetic, vocal, highly intelligent",
        lifespan: "12 – 16 years",
        description: "Bred with a distinctive leopard-like spotted or marbled coat, the Bengal is athletic, curious, and thrives on interactive play."
    },
    birman: {
        title: "Birman",
        price: "$1,000 – $2,500",
        origin: "Myanmar (Burma) / France",
        temperament: "Gentle, affectionate, quiet",
        lifespan: "12 – 16 years",
        description: "A colorpoint cat with deep blue eyes, a silky coat, and signature white 'gloves' on each paw, known for its calm and loving nature."
    },
    bombay: {
        title: "Bombay",
        price: "$800 – $2,000",
        origin: "United States",
        temperament: "Affectionate, outgoing, people-oriented",
        lifespan: "12 – 16 years",
        description: "Developed to resemble a miniature black panther, the Bombay features a glossy jet-black coat, copper-gold eyes, and a warm, velcro-cat personality."
    },
    burmese: {
        title: "Burmese",
        price: "$900 – $2,000",
        origin: "Myanmar (Burma) / Thailand",
        temperament: "Playful, social, affectionate",
        lifespan: "14 – 18 years",
        description: "Compact and muscular with a satin-like coat, the Burmese stays kittenish well into adulthood and forms strong bonds with people."
    },
    chartreux: {
        title: "Chartreux",
        price: "$1,200 – $2,500",
        origin: "France",
        temperament: "Quiet, loyal, observant",
        lifespan: "12 – 15 years",
        description: "A historic French breed with a plush blue-grey water-repellent coat and expressive copper eyes, often called the 'smiling cat' for its sweet expression."
    },
    cornishrex: {
        title: "Cornish Rex",
        price: "$1,000 – $2,200",
        origin: "Cornwall, England",
        temperament: "Lively, acrobatic, affectionate",
        lifespan: "12 – 16 years",
        description: "Distinctive for its soft, wavy Marcel-curl coat, large ears, and slender build, the Cornish Rex loves warmth and energetic play."
    }
};

let breeds = [];

async function loadBreeds() {
    try {
        const response = await fetch("./imagelist.txt");
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const text = await response.text();
        const parsed = text
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter(Boolean);

        return parsed.length > 0 ? parsed : FALLBACK_BREEDS;
    } catch (err) {
        console.warn("Could not fetch imagelist.txt, using fallback list:", err);
        return FALLBACK_BREEDS;
    }
}

function getValidBreed(selectedBreed) {
    if (selectedBreed && breeds.includes(selectedBreed)) {
        return selectedBreed;
    }
    if (selectedBreed) {
        console.warn(`[SECURITY] Invalid or missing selection: ${selectedBreed}`);
    }
    return breeds[0];
}

function updateUrl(breed, view) {
    try {
        const url = new URL(window.location.href);
        url.searchParams.set("selection", breed);
        if (view === "details") {
            url.searchParams.set("view", "details");
        } else {
            url.searchParams.delete("view");
        }
        window.history.replaceState({}, "", url);
    } catch {
        // Ignore SecurityError when opened directly via file://
    }
}

function renderOptions(selectedBreed) {
    const container = document.getElementById("breedOptions");
    container.textContent = "";

    breeds.forEach((breed) => {
        const input = document.createElement("input");
        input.type = "radio";
        input.id = breed;
        input.name = "selection";
        input.value = breed;
        if (breed === selectedBreed) {
            input.checked = true;
        }

        const label = document.createElement("label");
        label.htmlFor = breed;
        label.textContent = breed;

        container.appendChild(input);
        container.appendChild(document.createTextNode(" "));
        container.appendChild(label);
        container.appendChild(document.createElement("br"));
    });
}

function renderCat(selectedBreed) {
    const breed = getValidBreed(selectedBreed);
    const catName = document.getElementById("catName");
    const catImg = document.getElementById("catImg");
    const catDetails = document.getElementById("catDetails");

    catName.textContent = breed;
    catImg.src = `./public/images/${breed}.jpg`;
    catImg.alt = breed;
    catImg.hidden = false;
    catDetails.hidden = true;

    const radio = document.getElementById(breed);
    if (radio) {
        radio.checked = true;
    }
}

function renderDetails(selectedBreed) {
    const breed = getValidBreed(selectedBreed);
    const info = BREED_DETAILS[breed] || {
        title: breed,
        price: "N/A",
        origin: "Unknown",
        temperament: "Unknown",
        lifespan: "Unknown",
        description: "No additional details available for this breed."
    };

    const catName = document.getElementById("catName");
    const catImg = document.getElementById("catImg");
    const catDetails = document.getElementById("catDetails");

    catName.textContent = info.title;
    catImg.hidden = true;
    catDetails.hidden = false;

    document.getElementById("detailTitle").textContent = info.title;
    document.getElementById("detailPrice").textContent = info.price;
    document.getElementById("detailOrigin").textContent = info.origin;
    document.getElementById("detailTemperament").textContent = info.temperament;
    document.getElementById("detailLifespan").textContent = info.lifespan;
    document.getElementById("detailDescription").textContent = info.description;

    const radio = document.getElementById(breed);
    if (radio) {
        radio.checked = true;
    }
}

async function init() {
    breeds = await loadBreeds();

    const params = new URLSearchParams(window.location.search);
    const initialBreed = getValidBreed(params.get("selection"));
    const initialView = params.get("view");

    renderOptions(initialBreed);

    if (initialView === "details") {
        renderDetails(initialBreed);
    } else {
        renderCat(initialBreed);
    }

    const form = document.getElementById("breedForm");

    // Change cat picture immediately when toggling a radio button
    form.addEventListener("change", (event) => {
        if (event.target.name === "selection") {
            const validBreed = getValidBreed(event.target.value);
            renderCat(validBreed);
            updateUrl(validBreed, "photo");
        }
    });

    // Replace the cat image with breed details on submit
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const validBreed = getValidBreed(formData.get("selection"));
        renderDetails(validBreed);
        updateUrl(validBreed, "details");
    });

    // Allow switching back to the photo from the details panel
    document.getElementById("backToPhoto").addEventListener("click", () => {
        const formData = new FormData(form);
        const validBreed = getValidBreed(formData.get("selection"));
        renderCat(validBreed);
        updateUrl(validBreed, "photo");
    });
}

document.addEventListener("DOMContentLoaded", init);

let isEnabled = false;
let lastHighlighted = null;
let isDragging = false;
let offsetX, offsetY;


let floatBtn = document.createElement("button");
floatBtn.innerText = "🖱️";
floatBtn.id = "elementCopierToggleBtn";
Object.assign(floatBtn.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    background: "#ff5733",
    color: "white",
    padding: "5px",
    width: "45px",
    height: "45px",
    border: "none",
    borderRadius: "50%",
    cursor: "grab",
    zIndex: "99999",
    fontSize: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease-in-out",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)"
});
document.body.appendChild(floatBtn);

let tooltip = document.createElement("div");
tooltip.id = "elementCopierTooltip";
Object.assign(tooltip.style, {
    position: "absolute",
    background: "rgba(0, 0, 0, 0.8)",
    color: "white",
    padding: "5px 8px",
    borderRadius: "4px",
    fontSize: "12px",
    display: "none",
    zIndex: "99999",
    pointerEvents: "none"
});
document.body.appendChild(tooltip);


floatBtn.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - floatBtn.getBoundingClientRect().left;
    offsetY = e.clientY - floatBtn.getBoundingClientRect().top;
    floatBtn.style.cursor = "grabbing";
    e.preventDefault();
});

document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    floatBtn.style.left = `${e.clientX - offsetX}px`;
    floatBtn.style.top = `${e.clientY - offsetY}px`;
    floatBtn.style.bottom = "auto";
    floatBtn.style.right = "auto";
});

document.addEventListener("mouseup", () => {
    if (!isDragging) return;
    isDragging = false;
    floatBtn.style.cursor = "grab";

    
    let winWidth = window.innerWidth;
    let winHeight = window.innerHeight;
    let btnRect = floatBtn.getBoundingClientRect();
    
    let snapLeft = btnRect.left < winWidth / 2;
    let snapTop = btnRect.top < winHeight / 2;
    
    floatBtn.style.left = snapLeft ? "20px" : "auto";
    floatBtn.style.right = snapLeft ? "auto" : "20px";
    floatBtn.style.top = snapTop ? "20px" : "auto";
    floatBtn.style.bottom = snapTop ? "auto" : "20px";
});


floatBtn.addEventListener("click", (e) => {
    if (isDragging) return;
    toggleExtension();
});

function toggleExtension() {
    isEnabled = !isEnabled;

    if (!isEnabled) {
        if (lastHighlighted) lastHighlighted.style.outline = "";
        document.removeEventListener("mouseover", highlightElement, true);
        document.removeEventListener("click", copyElement, true);
        floatBtn.style.background = "#ff5733";
        floatBtn.innerText = "🖱️";
    } else {
        document.addEventListener("mouseover", highlightElement, true);
        document.addEventListener("click", copyElement, true);
        floatBtn.style.background = "#28a745";
        floatBtn.innerText = "✅";
    }
}

function highlightElement(event) {
    if (!isEnabled) return;

    let target = event.target;
    
    
    if (target.id === "elementCopierToggleBtn" || target.id === "elementCopierTooltip") return;

    if (lastHighlighted) lastHighlighted.style.outline = "";
    
    target.style.outline = "2px solid red";
    lastHighlighted = target;

    
    let tagName = target.tagName.toLowerCase();
    let className = target.className ? `.${target.className.replace(/\s+/g, '.')}` : "";
    let idName = target.id ? `#${target.id}` : "";

    tooltip.innerText = `${tagName}${idName}${className}`;
    tooltip.style.left = event.pageX + 10 + "px";
    tooltip.style.top = event.pageY + 10 + "px";
    tooltip.style.display = "block";
}

document.addEventListener("mouseout", () => {
    tooltip.style.display = "none";
}, true);

function copyElement(event) {
    if (!isEnabled) return;
    event.preventDefault();

    let target = event.target;

    if (target.id === "elementCopierToggleBtn" || target.id === "elementCopierTooltip") return;

    if (!target) return;
    
    target.style.outline = "";

    let html = target.outerHTML;
    let computedStyles = window.getComputedStyle(target);
    let css = "";
    for (let prop of computedStyles) {
        css += `${prop}: ${computedStyles.getPropertyValue(prop)};\n`;
    }

    let data = `HTML:\n${html}\n\nCSS:\n${css}`;
    navigator.clipboard.writeText(data)
        .then(() => alert("Element copied!"))
        .catch(err => console.error("Copy failed:", err));
}

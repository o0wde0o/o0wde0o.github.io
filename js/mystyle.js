
/*自制时间线*/
document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".timeline-root");

    if (!container) return;
  
    const h3List = container.querySelectorAll("h3");
    if (h3List.length === 0) return;
  
    const timeline = document.createElement("div");
    timeline.className = "auto-timeline";
  
    let colorIndex = 0;
    const colors = ["#42b983", "#ff6b6b", "#ffa502", "#1e90ff", "#e91e63"];
  
    h3List.forEach(h3 => {
      const item = document.createElement("div");
      item.className = "timeline-item";
      item.style.setProperty("--dot-color", colors[colorIndex % colors.length]);
      colorIndex++;
  
      const title = document.createElement("div");
      title.className = "timeline-title";
      title.textContent = h3.textContent;
      item.appendChild(title);
  
      const next = h3.nextElementSibling;
      if (next && (next.tagName === "UL" || next.tagName === "OL")) {
        const content = document.createElement("div");
        content.className = "timeline-content";
        content.innerHTML = next.outerHTML;
        item.appendChild(content);
        next.remove();
      }
  
      h3.remove();
      timeline.appendChild(item);
    });
  
    container.insertBefore(timeline, container.firstChild);
  });
  

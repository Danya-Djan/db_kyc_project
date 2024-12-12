export const updateStyles = () => {
  let selected = Number(localStorage.getItem("selectedStyle"));
  if (!selected) {
    localStorage.setItem("selectedStyle", "0");
    selected = 0;
  }
  const colors = ["#7EB4DB", "#F88B59", "#F2D06B", "#EA9C55"];
  const gradients = [
    "linear-gradient(90deg, #90D7ED 13.05%, #6887C4 91.06%, #8085C0 172.24%)",
    "linear-gradient(302deg, #FF805A -1.15%, #DEAE53 83.89%)",
    "linear-gradient(302deg, #6ACB54 -59.57%, #DCBB5A 43.7%, #E2883D 163.26%)",
    "linear-gradient(302deg, #FF805A -1.15%, #DEAE53 83.89%)",
  ];

  document.documentElement.style.setProperty("--primary", colors[selected]);
  document.documentElement.style.setProperty(
    "--gradientPrimary",
    gradients[selected]
  );
};
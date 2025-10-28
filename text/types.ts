type UIMarkdownText = {
  format: "markdown";
  text: string;
};

type UIPlainText = {
  format: "plain";
  text: string;
};

type UILinkText = {
  format: "link";
  text: string;
  url: string;
  target?: "_blank" | "_self";
};

type UIBadgeText = {
  format: "badge";
  text: string;
  color?: "info" | "success" | "warning" | "error"; // Hex color code or color name
};

type UIText = UIMarkdownText | UIPlainText | UILinkText | UIBadgeText;

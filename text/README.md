```ts
type UIMarkdownText = {
    type: "text";
    format: "markdown";
    text: string;
}

type UIPlainText = {
    type: "text";
    format: "plain";
    text: string;
}

type UILinkText = {
    type: "text";
    format: "link";
    text: string;
    url: string;
    target?: "_blank" | "_self";
}

type UIBadgeText = {
    type: "text";
    format: "badge";
    text: string;
    color?: "info" | "success" | "warning" | "error"; // Hex color code or color name
}



type UIHtmlText = {
    type: "text";
    format: "html";
    text: string;
}

type UIText = UIMarkdownText | UIPlainText | UILinkText | UIBadgeText | UIHtmlText;
```
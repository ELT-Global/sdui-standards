```ts
class UICopyToClipboard {
    type = "clipboard";
    label: string;
    content: string;
}

class UIDownloadable {
    type = "download";
    label: string;
    fileName: string;
    url: string;
}

class UIPhoneCall {
    type = "phone";
    label: string;
    phoneNumber: string;
}

class UIEmail {
    type = "email";
    label: string;
    emailAddress: string;
    subject: string;
    body: string;
} 

class UINavigate {
    type = "navigate";
    label: string;
    path: string; // e.g /batches/{batchId}
    tokens?: Record<string, string>; // e.g { batchId: "12345" }
    forcePlatform?: "mobile" | "web"; // force platform switch
}

class UIExternalLink {
    type = "external_link";
    label: string;
    url: string;
    target?: "_blank" | "_self";
}

/** Maps to `navigator.share` on mobile/web where supported **/
class UIShare {
    type = "share";
    label: string;
    url: string;
    title?: string;
    text?: string;
}

class UIRequest {
    type = "request";
    label: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
    endpoint: string;
    bodyJSON?: string;
    queryParams?: Record<string, string>;
    headers?: Record<string, string>;
}

class UIToast {
    type = "toast";
    message: string;
    variant: "success" | "error" | "info";
}

type UIAction = UIDownloadable | UICopyToClipboard | UIPhoneCall | UIEmail | UINavigate | UIExternalLink | UIShare | UIRequest | UIToast;
```

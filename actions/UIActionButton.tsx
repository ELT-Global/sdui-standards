"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
// import { UIAction } from "./api/sdui.ts"

export function ActionButton({ action }: { action: UIAction }) {

  const router = useRouter();

  const handleClick = async () => {
    switch (action.type) {
      case "clipboard": {
        await navigator.clipboard.writeText(action.content);
        toast({ title: "Copied!", description: action.content });
        break;
      }

      case "download": {
        const link = document.createElement("a");
        link.href = action.url;
        link.download = action.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        break;
      }

      case "phone": {
        window.location.href = `tel:${action.phoneNumber}`;
        break;
      }

      case "email": {
        const subject = encodeURIComponent(action.subject || "");
        const body = encodeURIComponent(action.body || "");
        window.location.href = `mailto:${action.emailAddress}?subject=${subject}&body=${body}`;
        break;
      }

      case "navigate": {
        let path = action.path;
        if (action.tokens) {
          for (const [key, value] of Object.entries(action.tokens)) {
            path = path.replace(`{${key}}`, value);
          }
        }
        if (action.forcePlatform === "mobile") {
          window.location.href = `myapp://navigate${path}`;
        } else {
          router.push(path);
        }
        break;
      }

      case "external_link": {
        window.open(action.url, action.target ?? "_blank");
        break;
      }

      case "share": {
        if (navigator.share) {
          try {
            await navigator.share({
              url: action.url,
              title: action.title,
              text: action.text,
            });
          } catch (err) {
            toast({ title: "Share cancelled", variant: "info" });
          }
        } else {
          await navigator.clipboard.writeText(action.url);
          toast({
            title: "Copied link to clipboard",
            description: action.url,
            variant: "info",
          });
        }
        break;
      }

      case "request": {
        try {
          let url = action.endpoint;
          if (action.queryParams) {
            const q = new URLSearchParams(action.queryParams).toString();
            url += `?${q}`;
          }
          const res = await fetch(url, {
            method: action.method,
            headers: {
              "Content-Type": "application/json",
              ...(action.headers || {}),
            },
            body: action.bodyJSON,
          });
          const data = await res.json().catch(() => null);
          toast({
            title: res.ok ? "Request success" : "Request failed",
            description: JSON.stringify(data ?? {}, null, 2),
            variant: res.ok ? "success" : "error",
          });
        } catch (err: any) {
          toast({
            title: "Request error",
            description: err.message,
            variant: "error",
          });
        }
        break;
      }

      case "toast": {
        toast({
          title: action.variant.toUpperCase(),
          description: action.message,
          variant: action.variant,
        });
        break;
      }

      default:
        console.warn("Unknown action type", action);
    }
  };

  return (
    <Button onClick={handleClick}>
      {action.label}
    </Button>
  );
}

import { UIText } from './api/sdui';

interface UITextProps extends HTMLAttributes<HTMLSpanElement>, UIText {}

export function UIText(props: UITextProps) {
    if (props.format === "markdown") {
        return <span dangerouslySetInnerHTML={{ __html: marked(props.text) }} />;
    }

    if (props.format === "badge") {
        return <Badge>{props.text}</Badge>;
    }

    if (props.format === "link") {
        return <span><a href={props.url} target={props.target}>{props.text}</a></span>;
    }

    return <span>{props.text}</span>;
}
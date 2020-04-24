interface FileReaderEventTarget extends EventTarget {
    result: string;
}

interface FileReaderEvent extends ProgressEvent {
    target: FileReaderEventTarget;
    getMessage(): string;
}
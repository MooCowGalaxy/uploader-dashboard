function humanReadableBytes(bytes = 0) {
    if (bytes >= 1000 * 1000 * 1000 * 1000) {
        return `${Math.round(bytes / (1000 * 1000 * 1000 * 10)) / 100} TB`
    }
    if (bytes >= 1000 * 1000 * 1000) {
        return `${Math.round(bytes / (1000 * 1000 * 10)) / 100} GB`
    }
    if (bytes >= 1000 * 1000) {
        return `${Math.round(bytes / (1000 * 10)) / 100} MB`
    } else if (bytes >= 1000) {
        return `${Math.round(bytes / 10) / 100} KB`
    } else {
        return `${bytes} B`
    }
}

export default humanReadableBytes;

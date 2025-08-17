function parseNumber (value, defaultValue) {
    const isString = typeof value === "string";
    if (!isString) {
        return defaultValue;
    }

    const parsedValue = parseInt(value);
    if (Number.isNaN(parsedValue)) {
        return defaultValue;
    }

    return parsedValue;
}

export default function parsePaginationParams (query) {
    const {page, perPage} = query;

    const parsedPage = parseNumber(page, 1);
    const parsedPerPage = parseNumber(perPage, 10);

    return {
        page: parsedPage,
        perPage: parsedPerPage,
    }
}
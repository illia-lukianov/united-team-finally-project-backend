export default function calculatePaginationData(count, page, perPage) {
    const totalPages = Math.ceil(count/perPage);
    const hasNextPage = Boolean(totalPages-page);
    const hasPreviousPage = page !== 1;

    return {
        page,
        perPage,
        totalItems: count,
        totalPages,
        hasNextPage,
        hasPreviousPage,
    }
}
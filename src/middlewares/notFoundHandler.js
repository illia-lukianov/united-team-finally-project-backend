export function notFoundHandler(req, res) {
    res.status(404).json({ status: 404, message: 'Not found' });
}
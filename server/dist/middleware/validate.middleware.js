export const validateBody = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: result.error.errors.map((e) => ({
                    path: e.path.join('.'),
                    message: e.message,
                })),
            });
            return;
        }
        req.body = result.data;
        next();
    };
};
export const validateParams = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.params);
        if (!result.success) {
            res.status(400).json({
                success: false,
                error: 'Invalid route parameters',
                details: result.error.errors.map((e) => ({
                    path: e.path.join('.'),
                    message: e.message,
                })),
            });
            return;
        }
        req.params = result.data;
        next();
    };
};

import { Response } from 'express';

function handleError(res: Response, error: Error | string) {
    if (error instanceof Error) {
        console.error(error.message);
        return res.status(500).json({ message: error.message, status: 500 });
    } else if (typeof error === 'string') {
        console.error(error);
        return res.status(400).json({ message: error, status: 400 });
    } else {
        console.error('Unknown error:', error);
        return res.status(500).json({ message: 'Unknown error', status: 500 });
    }
}

export default handleError;

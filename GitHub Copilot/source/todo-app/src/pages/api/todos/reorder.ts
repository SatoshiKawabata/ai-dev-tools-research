import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        res.setHeader('Allow', ['PUT']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { todos } = req.body;
    try {
        const updatePromises = todos.map((t: { id: number, order: number }) =>
            prisma.todo.update({
                where: { id: Number(t.id) },
                data: { order: t.order },
            })
        );
        await Promise.all(updatePromises);
        return res.status(200).json({ message: 'Reordered successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to reorder todos' });
    }
}

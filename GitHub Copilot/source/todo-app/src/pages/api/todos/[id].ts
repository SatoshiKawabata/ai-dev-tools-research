import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    const { id } = req.query;

    switch (method) {
        case 'GET':
            try {
                const todo = await prisma.todo.findUnique({
                    where: { id: Number(id) },
                });
                if (!todo) {
                    return res.status(404).json({ message: 'Todo not found' });
                }
                return res.status(200).json(todo);
            } catch (error) {
                return res.status(500).json({ message: 'Error fetching todo' });
            }

        case 'PUT':
            try {
                const updatedTodo = await prisma.todo.update({
                    where: { id: Number(id) },
                    data: req.body,
                });
                return res.status(200).json(updatedTodo);
            } catch (error) {
                return res.status(500).json({ message: 'Error updating todo' });
            }

        case 'DELETE':
            try {
                await prisma.todo.delete({
                    where: { id: Number(id) },
                });
                return res.status(204).end();
            } catch (error) {
                return res.status(500).json({ message: 'Error deleting todo' });
            }

        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            return res.status(405).end(`Method ${method} Not Allowed`);
    }
}
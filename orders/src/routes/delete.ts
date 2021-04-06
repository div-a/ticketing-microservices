import express, {Request, Response} from 'express';
import { NotAuthorizedError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@divaltickets/common';
import { body } from 'express-validator'
import { Ticket } from '../models/ticket';
// import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher.';
import { natsWrapper } from '../nats-wrapper';
import { Order } from '../models/order';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher.';

const router = express.Router();

router.delete(
    '/api/orders/:orderId', 
    requireAuth, 
    async (req: Request, res: Response) => {
        const { orderId } = req.params;

        const order = await Order.findById(orderId).populate('ticket');

        if (!order) {
            throw new NotFoundError()
        }
        
        if(order.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }

        order.status = OrderStatus.Cancelled;
        await order.save();

        await new  OrderCancelledPublisher(natsWrapper.client).publish({
            id: order.id,
            ticket: {
                id: order.ticket.id,
            }
        })
        
        return res.status(204).send(order);
    }
);

export {router as deleteOrderRouter} 
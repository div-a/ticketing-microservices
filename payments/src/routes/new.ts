import express, {Request, Response} from 'express';
import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@divaltickets/common';
import { body } from 'express-validator'
import { Order } from '../models/order';
import mongoose from 'mongoose';
import { Payment } from '../models/payment';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
    '/api/payments', 
    requireAuth, 
    [
        body('token').not().isEmpty().withMessage('Must provide token'),
        body('orderId').not().isEmpty().withMessage('Must provide orderId')
    ], 
    validateRequest, 
    async (req: Request, res: Response) => {
        const {token, orderId} = req.body;

        const order = await Order.findById(orderId);

        if(!order){
            throw new NotFoundError();
        }

        if(order.userId !== req.currentUser!.id){
            throw new NotAuthorizedError();
        }

        if(order.status === OrderStatus.Cancelled){
            throw new BadRequestError('Cannot pay for cancelled order');
        }

        // generate fake stripe id charge.
        const fakeStripeId = new mongoose.Types.ObjectId().toHexString();
        const payment = Payment.build({
            orderId,
            stripeId : fakeStripeId
        })
        await payment.save();

        await new PaymentCreatedPublisher(natsWrapper.client).publish({
            id: payment.id,
            orderId: payment.orderId,
            stripeId: payment.stripeId
        })

        return res.status(201).send({id: payment.id});
    }
);

export {router as createChargeRouter} 
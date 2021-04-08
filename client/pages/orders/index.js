import useRequest from '../../hooks/use-request'
import Router from 'next/router'
import {useEffect, useState} from 'react'
import OrderShow from './[orderId]';

const OrderIndex = ({orders}) => {
    return (
        <ul>
            {orders.map(order => {
                return <li key = {order.id}>
                    {order.ticket.title} - {order.status}
                </li>
            })}
        </ul>
    )
}

OrderIndex.getInitialProps = async (context, client) => {
    const { data } = await client.get('/api/orders');
    return {orders: data};
};


export default OrderIndex;
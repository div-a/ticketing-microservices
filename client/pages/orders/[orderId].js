import useRequest from '../../hooks/use-request'
import Router from 'next/router'
import {useEffect, useState} from 'react'

const OrderShow = ({order}) => {
    const [timeLeft, setTimeLeft] = useState('');
    const { doRequest, errors } = useRequest({
        url: '/api/payments',
        method: 'post',
        body: {
            orderId: order.id
        },
        onSuccess: () => Router.push('/orders')
        
    })
   

    useEffect(() => {
        const findTimeLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date();
            setTimeLeft(Math.round(msLeft/1000));
        }

        findTimeLeft();
        const timerId = setInterval(findTimeLeft, 1000)

        return () => {
            clearInterval(timerId)
        };
    }, [])

    if (timeLeft < 0){
        return <div>Order Expired</div>
    }


    return (
        <div>
            {timeLeft} seconds left until order expires

            <button className="btn btn-primary" onClick={doRequest}> Pay </button>

        </div>
    )
}

OrderShow.getInitialProps = async (context, client) => {
    const { orderId } = context.query; //gets query params
    const { data } = await client.get(`/api/orders/${orderId}`);
    return {order: data};
};


export default OrderShow;
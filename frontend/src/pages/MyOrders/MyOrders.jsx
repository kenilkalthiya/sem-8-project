// import { useContext, useEffect, useState } from 'react'
// import './MyOrders.css'
// import axios from 'axios'
// import { StoreContext } from '../../Context/StoreContext';
// import { assets } from '../../assets/assets';

// const MyOrders = () => {
  
//   const [data,setData] =  useState([]);
//   const {url,token,currency} = useContext(StoreContext);

//   const fetchOrders = async () => {
//     const response = await axios.post(url+"/api/order/userorders",{},{headers:{token}});
//     setData(response.data.data)
//   }

//   useEffect(()=>{
//     if (token) {
//       fetchOrders();
//     }
//   },[token])

//   return (
//     <div className='my-orders'>
//       <h2>My Orders</h2>
//       <div className="container">
//         {data.map((order,index)=>{
//           return (
//             <div key={index} className='my-orders-order'>
//                 <img src={assets.parcel_icon} alt="" />
//                 <p>{order.items.map((item,index)=>{
//                   if (index === order.items.length-1) {
//                     return item.name+" x "+item.quantity
//                   }
//                   else{
//                     return item.name+" x "+item.quantity+", "
//                   }
                  
//                 })}</p>
//                 <p>{currency}{order.amount}.00</p>
//                 <p>Items: {order.items.length}</p>
//                 <p><span>&#x25cf;</span> <b>{order.status}</b></p>
//                 <button onClick={fetchOrders}>Track Order</button>
//             </div>
//           )
//         })}
//       </div>
//     </div>
//   )
// }

// export default MyOrders

import { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import axios from 'axios';
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';

const MyOrders = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { url, token, currency } = useContext(StoreContext);

  const fetchOrders = async () => {
    if (!token) return; // Prevent request if no token

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${url}/api/order/userorders`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }, // Ensure correct token format
        }
      );

      if (response.data.success) {
        setData(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch orders');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className='my-orders'>
      <h2>My Orders</h2>

      {loading && <p>Loading orders...</p>}
      {error && <p className="error">{error}</p>}

      <div className="container">
        {data.length > 0 ? (
          data.map((order) => (
            <div key={order._id} className='my-orders-order'>
              <img src={assets.parcel_icon} alt="Parcel Icon" />
              <p>
                {order.items.map((item, idx) => 
                  `${item.name} x ${item.quantity}${idx === order.items.length - 1 ? '' : ', '}`
                )}
              </p>
              <p>{currency}{order.amount}.00</p>
              <p>Items: {order.items.length}</p>
              <p><span>&#x25cf;</span> <b>{order.status}</b></p>
              <button onClick={() => fetchOrders()}>Track Order</button>
            </div>
          ))
        ) : (
          !loading && <p>No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default MyOrders;

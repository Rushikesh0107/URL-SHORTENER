import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';

function Home({isLogin}) {
  const [data, setdata] =  useState();
  const [shortID, setShortID] = useState();
  const [allData, setallData] = useState([]);

  const handleClick = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:3000/url', {
      url: data
    }).then((res) => setShortID(res.data.shortID))
    .catch((err) => {
      return err.message;
    })
    setdata('');
  }

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3000/url/${id}`)
    .then((res) => {
      if(res.status == 200){
        console.log("bingo");
      }
    })
    .catch((err) => {
      return err.message;
    })
  }

  useEffect(()=> {
    const getData = async () => {
        await axios.get(`http://localhost:3000`)
        .then((res)=> setallData(res.data))
    }
    getData();
  }, [allData, handleDelete])


  return (
  <>
    <div>
      <div className='bg-red-300 p-4 flex justify-around'>
        <h1 className='text-3xl font-bold '>
        URL Shortner
        </h1>
        <nav>
            <ul className='flex justify-center gap-2'>
                <li className='p-2 px-4 text-2xl font-bold hover:bg-white rounded-xl'>
                    <Link to='/'>Home</Link>
                </li>
                <li className='p-2 px-4  text-2xl font-bold hover:bg-white rounded-xl'>
                    <Link to='/login'>Login</Link>
                </li>
                <li className='p-2 px-4  text-2xl font-bold hover:bg-white rounded-xl'>
                    <Link to='/signup'>SignUp</Link>
                </li>
            </ul>
        </nav>
      </div>

                <div className='flex justify-center p-4'>
                <input 
                type="text" 
                onChange={(e) => setdata(e.target.value)}
                value={data}
                className='border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm mr-5 focus:outline-none'
                placeholder='Enter URL'
                />
                <span>        </span>
                <button
                onClick={(e) => handleClick(e)}
                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                >Shorten</button>
            </div>
            <br/>
            <br/>
            <div className='flex justify-center'>
                <table className="w-2/3 bg-white border border-gray-300 ">
                <thead>
                    <tr>
                    <th className="py-2 px-4 border">Short Link</th>
                    <th className="py-2 px-4 border">Actual Link</th>
                    <th className="py-2 px-4 border">Clicks</th>
                    </tr>
                </thead>
                <tbody>
                    {
                    allData.map((item) => {
                        return (
                        <tr key={item._id}>
                            <td className="py-2 px-4 border text-center">{item.shortID}</td>
                            <td className="py-2 px-4 border text-center grid grid-cols-2">
                              {item.redirectUrl}
                              <td 
                              className='bg-red-300 font-bold w-1/2 p-2 rounded-xl hover:cursor-pointer mx-auto'
                              onClick={() => handleDelete(item._id)}
                              >Delete</td>
                              </td>
                            <td className="py-2 px-4 border text-center">{item.visitHistory.length}</td>
                        </tr>
                        )
                    } )
                    }
                </tbody>
                {

                }
                </table>
            </div>
    </div>
  </>
  )
}

export default Home

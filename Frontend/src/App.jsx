import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'

function App() {
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

  useEffect(()=> {
    const getData = async () => {
        await axios.get(`http://localhost:3000`)
        .then((res)=> setallData(res.data))
    }
    getData();
  }, [allData])


  return (
  <>
    <div>
      <div className='bg-red-300 p-4 flex justify-center'>
        <h1 className='text-3xl font-bold '>
        URL Shortner
        </h1>
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
        <table class="w-2/3 bg-white border border-gray-300 ">
          <thead>
            <tr>
              <th class="py-2 px-4 border">Short Link</th>
              <th class="py-2 px-4 border">Actual Link</th>
              <th class="py-2 px-4 border">Clicks</th>
            </tr>
          </thead>
          <tbody>
            {
              allData.map((item) => {
                return (
                  <tr key={item._id}>
                    <td class="py-2 px-4 border text-center">{item.shortID}</td>
                    <td class="py-2 px-4 border text-center">{item.redirectUrl}</td>
                    <td class="py-2 px-4 border text-center">{item.visitHistory.length}</td>
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

export default App

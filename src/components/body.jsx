import { useState, useEffect } from "react"

export default function Body() {
    const [textObjs, setTextObjs] = useState([
      {
        id: 1,
        name: 'Text 1',
        value: "Test text 1u8yguygug"
      },
      {
        id: 2,
        name: 'Text 2',
        value: "Test text 2"
      }
    ]);
    const [memeImg, setMemeImg] = useState("http://i.imgflip.com/1bij.jpg")
    const [memeCollection, setMemeCollection] = useState([]);

    useEffect(() => { 
      const abortController = new AbortController();

      const fetchData = async () => {
        console.log('Fetching data')
        try {
          const res = await fetch('https://api.imgflip.com/get_memes', {
            signal: abortController.signal 
          });
          const resData = await res.json();
          const memeArray = resData.data.memes
          const filteredArray = memeArray.filter(obj => obj.box_count === 2);

          setMemeCollection(filteredArray);
        } catch (error) {
          if (!abortController.signal.aborted) {
            console.error(error);
          }
        }
      }
      fetchData();
      return () => {
        console.log('Cleaning up');
        abortController.abort()
      };
    }, []);

    const getMemeImage = () => {
      const randomNumber = Math.floor(Math.random() * memeCollection.length);
      const newMemeObj = memeCollection[randomNumber];
      console.log(newMemeObj);
      setMemeImg(newMemeObj.url);
    }

    const handleChange = (e) => {
      console.log(e);
      console.log(e.target);
      console.log(e.target.id);
      // setTextObjs(prevTextObjs => (prevTextObjs[e.target]);
    }
    // console.log(memeCollection);

    const TextInputs = () => {
      return (
        <>
          {textObjs.map((textObj) => (
            <label
              key={textObj.id}
            >
              {textObj.name}
              <input 
                id={textObj.id}
                type="text"
                name={textObj.name}
                value={textObj.value}
                onChange={handleChange}
              />
            </label>
          ))}
        </>
      );
    }
    return (
        <main>
            <div className="form">
                <TextInputs/>
                <button 
                  className={memeCollection.length === 0 ? 'submitting-disabled' : ''} 
                  onClick={getMemeImage} 
                  disabled={memeCollection.length === 0 ? true : false}
                >
                  {memeCollection.length === 0 ? 'Loading...' : 'Get New Img'}
                </button>
            </div>
            <div className="meme">
                <img src={memeImg} />
                {textObjs.map((textObj) => (
                  <span
                    key={textObj.id}
                  >
                    {textObj.value}
                  </span>
                ))}
            </div>
        </main>
    )
}
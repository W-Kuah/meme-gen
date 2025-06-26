import { useState, useEffect } from "react"
import { Rnd } from "react-rnd";
import cancelIcon from '../assets/remove.svg'


export default function Body() {
    const textObjs = [ 
      {
        id: 1,
        name: 'Text 1',
      },
      {
        id: 2,
        name: 'Text 2',
        value: "Walk Into Modor",
      },
      {
        id: 3,
        name: 'Text 3',
        value: "Example Text 3",
      },
      {
        id: 4,
        name: 'Text 4',
        value: "Example Text 4",
      },
      {
        id: 5,
        name: 'Text 5',
        value: "Example Text 5",
      },
      {
        id: 6,
        name: 'Text 6',
        value: "Example Text 6",
      }
    ];

    const [values, setValues] = useState({
      1: 'One Does Not Simply',
      2: 'Walk Into Modor',
      3: 'Example Text 3',
      4: 'Example Text 4',
      5: 'Example Text 5',
      6: 'Example Text 6',
    });

    const [hidden, setHidden] = useState({
      1: false,
      2: false,
      3: true,
      4: true,
      5: true,
      6: true,
    });

    const [memeImg, setMemeImg] = useState("http://i.imgflip.com/1bij.jpg")
    const [memeCollection, setMemeCollection] = useState([]);
    const [hasDragged, setHasDragged] = useState(false);

    const showNext = () => {
      for (let i = 1; i <= 6; i++) {
        if (hidden[i]) {
          return i;
        }
      }
      return 0;
    }



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

          setMemeCollection(memeArray);
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

    const getMemeImage = () => {``
      const randomNumber = Math.floor(Math.random() * memeCollection.length);
      const newMemeObj = memeCollection[randomNumber];
      console.log(newMemeObj);
      setMemeImg(newMemeObj.url);
    }

    const handleChange = (e) => {
      setValues(prevValues => ({
        ...prevValues, 
        [e.target.id]: e.target.value
      }));
    }

    const handleHide = (id) => {
      setHidden(prevHidden => ({
        ...prevHidden, 
        [id]: true
      }));
    };
    
    const handleShow = () => {
      console.log(hidden);
      const nextText = showNext();
      console.log(nextText);
      if (nextText !== 0) {
        setHidden(prevHidden => ({
          ...prevHidden,
          [nextText] : false
        }));
      }
    }

  
    return (
        <main>
            <div className="form">
                {textObjs.map((textObj) => (
                  // <>
                    (!hidden[textObj.id] ? <label
                      key={textObj.name}
                    >
                      {textObj.name + ':'}
                      <input 
                        id={textObj.id}
                        type="text"
                        name={textObj.name}
                        value={values[textObj.id]}
                        onChange={handleChange}
                      />
                      <img src={cancelIcon} onClick={() => handleHide(textObj.id)}/>
                    </label> : null)
              ))}
                <div className='addTextBox'>
                  <button onClick={handleShow}>+</button>
                  <div>Add up to 6 separate texts.</div>
                </div>
                <button 
                  className={memeCollection.length === 0 ? 'submitting-disabled' : ''} 
                  onClick={getMemeImage} 
                  disabled={memeCollection.length === 0 ? true : false}
                >
                  {memeCollection.length === 0 ? 'Loading...' : 'Get New Image'}
                </button>
            </div>
            <div className="meme">
                <img draggable="false" src={memeImg} />
                {textObjs.map((textObj) => (
                    (!hidden[textObj.id] ?  <Rnd
                      key={textObj.id}
                      bounds="parent"
                    >
                      {values[textObj.id]}
                  </Rnd> : null)
                ))}
            </div>
        </main>
    )
}
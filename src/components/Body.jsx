import { useState, useEffect, useRef } from "react"
import html2canvas from 'html2canvas';
import MemeTexts from './MemeTexts';
import cancelIcon from '../assets/remove.svg'
import downloadIcon from '../assets/download.svg'
import plusIcon from '../assets/plus.svg'


export default function Body() {
    const MIN_WIDTH = 150;
    const MIN_HEIGHT = 150;

    const textObjs = [ 
      {
        id: 1,
        name: 'Text 1',
      },
      {
        id: 2,
        name: 'Text 2',
      },
      {
        id: 3,
        name: 'Text 3',
      },
      {
        id: 4,
        name: 'Text 4',
      },
      {
        id: 5,
        name: 'Text 5',
      },
      {
        id: 6,
        name: 'Text 6',
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

    const [initLoc, setInitLoc] = useState(null);
    
    const [memeImg, setMemeImg] = useState("http://i.imgflip.com/1bij.jpg")
    const [memeCollection, setMemeCollection] = useState([]);
    const [hasDragged, setHasDragged] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [fileError, setFileError] = useState('');

    const memeRef = useRef(null);
    const uploadRef = useRef(null);

    useEffect(() => { 
      const abortController = new AbortController();
      
      const fetchData = async () => {
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
        abortController.abort()
      };
    }, []);

    useEffect(() => {
      if (memeRef.current && isLoaded) {
        const { width, height } = memeRef.current.getBoundingClientRect();
        const partWidth = width / 8;
        const partHeight = height / 8;
        console.log(getDeviceType());
        if (getDeviceType() === 'Mobile') {
          setInitLoc({
            1: {
              x: partWidth * 1.3,
              y: partHeight / 2
            },
            2: {
              x: partWidth * 1.5,
              y: height - (partHeight * 1.5)
            },
            3: {
              x: partWidth * 1.3,
              y: partHeight * 1.5
            },
            4: {
              x: partWidth * 1.3,
              y: partHeight * 2.5
            },
            5: {
              x: partWidth * 1.3,
              y: partHeight* 3.5
            },
            6: {
              x: partWidth * 1.3,
              y: partHeight * 4.5
            }
            });
        } else {
          setInitLoc({
            1: {
              x: partWidth * 1.8,
              y: partHeight / 2
            },
            2: {
              x: partWidth * 2.2,
              y: height - (partHeight * 1.5)
            },
            3: {
              x: partWidth * 1.8,
              y: partHeight * 1.5
            },
            4: {
              x: partWidth * 1.8,
              y: partHeight * 2.5
            },
            5: {
              x: partWidth * 1.8,
              y: partHeight* 3.5
            },
            6: {
              x: partWidth * 1.8,
              y: partHeight * 4.5
            }
            });
        }
      }
    }, [isLoaded]);
    
    const showNext = () => {
      for (let i = 1; i <= 6; i++) {
        if (hidden[i]) {
          return i;
        }
      }
      return 0;
    }

    const getDeviceType = () => {
      const userAgent = navigator.userAgent;
      console.log(userAgent);
      if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
        return "Tablet";
      }
      if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|NetFront|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/i.test(userAgent)) {
        return "Mobile";
      }
      return "Desktop";
    }

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

    const handleMemeLoad = () => {
      setIsLoaded(true)
    }

    const handleImageDownload = async (e) => {
      e.preventDefault();
      const element = document.getElementById('print'),
      canvas = await html2canvas(element, {useCORS: true}),
      data = canvas.toDataURL('image/jpg'),
      link = document.createElement('a');

      link.href = data;
      link.download = 'downloaded-image.jpg';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);  
    };

    const handleImageChange = (e) => {
      console.log('go');
      const file = e.target.files[0];
      if (!file) {
              console.log('no files');

        return
      };

      if (!file.type.match('image.*')) {
        setFileError('Please select a valid image file (JPEG, PNG, etc.)');
      return;
    }

      setFileError(''); 
      const reader = new FileReader();
      const img = new Image();
      reader.onload = (event) => {
        img.onload = () => {

          if (img.width >= MIN_WIDTH && img.height >= MIN_HEIGHT) {
            setMemeImg(event.target.result);
            console.log('image success');
          } else {
            setFileError(
              `Image must be at least ${MIN_WIDTH} x ${MIN_HEIGHT}px. 
              Your image: ${img.width} x ${img.height}px.`
            );
          };
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    };

    const handleUploadClick = () => {
      uploadRef.current.click();
    }

  
    return (
        <main>
            <div className="form">
                {textObjs.map((textObj) => (
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
                      <a onClick={() => handleHide(textObj.id)}>
                        <img src={cancelIcon} alt="remove text" />
                      </a>
                    </label> : null)
              ))}
                {(showNext() !== 0) ? <div className='addTextBox'>
                  <a onClick={handleShow}>
                    <img src={plusIcon} alt="add text" />
                  </a>
                  <div>Add up to 6 separate texts.</div>
                </div> : null}
                <div className="getImgGroup">
                  <button
                    className={`{memeCollection.length === 0 ? 'submitting-disabled' : ''} randomiser`} 
                    onClick={getMemeImage} 
                    disabled={memeCollection.length === 0 ? true : false}
                  >
                    {memeCollection.length === 0 ? 'Loading...' : 'Get Random Image'}
                  </button>
                  <button onClick={handleUploadClick} className="upload">
                    <input 
                      ref={uploadRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                    Upload Custom
                  </button>
                </div>
                {fileError==='' ? null : <span className='errorMessage'>{fileError}</span>}
            </div>
            <div id="print" ref={memeRef} className="meme">
                <img onLoad={handleMemeLoad} draggable="false" src={memeImg} />
                 <MemeTexts
                  textObjs={textObjs}
                  values={values}
                  hidden={hidden}
                  initLoc={initLoc}
                  isLoaded={isLoaded}
                  setHasDragged={setHasDragged}
                  hasDragged={hasDragged}
                />
            </div>
            <div className="downloadSection">
              <div className="downloadDiv">
                <a  onClick={handleImageDownload}>
                  <img src={downloadIcon} alt="download image" />
                </a>
              </div>
            </div>
            
            
        </main>
    )
}

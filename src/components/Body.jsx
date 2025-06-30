import { useState, useEffect, useRef } from "react"
import html2canvas from 'html2canvas';
import MemeTexts from './MemeTexts';
import cancelIcon from '../assets/remove.svg'
import downloadIcon from '../assets/download.svg'
import plusIcon from '../assets/plus.svg'


export default function Body() {
    const MIN_WIDTH = 150;
    const MIN_HEIGHT = 150;

    const MIN_TEXT = 1;
    const MAX_TEXT = 16;

    const textObjs = [ 
      {
        id: 1,
        name: '1',
      },
      {
        id: 2,
        name: '2',
      },
      {
        id: 3,
        name: '3',
      },
      {
        id: 4,
        name: '4',
      },
      {
        id: 5,
        name: '5',
      },
      {
        id: 6,
        name: '6',
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

    const [fontSize, setFontSize] = useState({
      1: 9,
      2: 9,
      3: 9,
      4: 9,
      5: 9,
      6: 9,
    });

    const [displaySize, setDisplaySize] = useState({
      1: 9,
      2: 9,
      3: 9,
      4: 9,
      5: 9,
      6: 9,
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
            const deviceSize = {
              1: 5,
              2: 5,
              3: 5,
              4: 5,
              5: 5,
              6: 5,
            }
            setDisplaySize(deviceSize);
            setFontSize(deviceSize);
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
          const deviceSize = {
            1: 12,
            2: 12,
            3: 12,
            4: 12,
            5: 12,
            6: 12,
          }
          setDisplaySize(deviceSize);
          setFontSize(deviceSize);
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
      setMemeImg(newMemeObj.url);
    }

    const handleChange = (e) => {
      setValues(prevValues => ({
        ...prevValues, 
        [e.target.name]: e.target.value
      }));
    }

    const handleHide = (id) => {
      setHidden(prevHidden => ({
        ...prevHidden, 
        [id]: true
      }));
    };
    
    const handleShow = () => {
      const nextText = showNext();
      if (nextText !== 0) {
        setHidden(prevHidden => ({
          ...prevHidden,
          [nextText] : false
        }));
      }
    }

    const handleSizeChange = (e) => {
      const value = e.target.value;
      const numValue = parseInt(value);
      if (numValue < 0) return;
      setDisplaySize(prevSizes => ({
        ...prevSizes,
        [e.target.name]: value
      }));

      if (numValue <= MAX_TEXT && numValue >= MIN_TEXT) {
        setFontSize(prevSizes => ({
        ...prevSizes,
        [e.target.name]: numValue
        }));
      }
    }

    const handleSizeUp = (e) => {
      const currentValue = parseInt(displaySize[e.target.name]);
      const newValue = currentValue + 1;
      if (newValue > MAX_TEXT) return;
      setDisplaySize(prevSizes => ({
        ...prevSizes,
        [e.target.name]: newValue
      }))
      if (newValue <= MAX_TEXT && newValue >= MIN_TEXT){
        setFontSize(prevSizes => ({
        ...prevSizes,
        [e.target.name]: newValue
        }));
      }

    }

    const handleSizeDown = (e) => {
      const currentValue = parseInt(displaySize[e.target.name]);
      const newValue = currentValue - 1;
      if (newValue < MIN_TEXT) return;
      setDisplaySize(prevSizes => ({
        ...prevSizes,
        [e.target.name]: newValue
      }))
      if (newValue <= MAX_TEXT && newValue >= MIN_TEXT) {
        setFontSize(prevSizes => ({
        ...prevSizes,
        [e.target.name]: newValue
        }));
      }

    }

    const handleMemeLoad = () => {
      setIsLoaded(true)
    }

    const handleImageDownload = async (e) => {
      e.preventDefault();
      setHasDragged(true);
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
      const file = e.target.files[0];
      if (!file) {
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

    const TextLeft = () => {
      let left = 0;
      for (let i = 1; i <= 6; i++) {
        if (hidden[i] === true) {
          left++;
        }
      }
      return (
        <div>{`${left} Remaining Text Boxes!`}</div>
      );
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
                        className="textInput"
                        type="text"
                        name={textObj.id}
                        value={values[textObj.id]}
                        onChange={handleChange}
                      />
                      <div className="sizeGroup">
                        <input
                          className={`textSize ${displaySize[textObj.id] > MAX_TEXT || displaySize[textObj.id] < MIN_TEXT ? 'errorSize' : ''}`}
                          type="numeric" 
                          name={textObj.id}
                          value={displaySize[textObj.id]}
                          onChange={handleSizeChange}
                        />
                        <div className='upDown'>
                          <button className={`up ${displaySize[textObj.id] > MAX_TEXT || displaySize[textObj.id] < MIN_TEXT ? 'errorSize' : ''}`}
                            name={textObj.id} 
                            onClick={handleSizeUp}>▲
                          </button>
                          <button className={`down ${displaySize[textObj.id] > MAX_TEXT || displaySize[textObj.id] < MIN_TEXT ? 'errorSize' : ''}`}
                            name={textObj.id}
                            onClick={handleSizeDown}>▼
                          </button>
                        </div>
                      </div>
                      
                      <a onClick={() => handleHide(textObj.id)}>
                        <img src={cancelIcon} alt="remove text" />
                      </a>
                    </label> : null)
              ))}
                {(showNext() !== 0) ? <div className='addTextBox'>
                  <a onClick={handleShow}>
                    <img src={plusIcon} alt="add text" />
                  </a>
                  <TextLeft/>
                </div> : null}
                <div className="getImgGroup">
                  <button
                    className={`${memeCollection.length === 0 ? 'submitting-disabled' : ''} randomiser`} 
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
                  fontSize={fontSize}
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

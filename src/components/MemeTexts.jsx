import { Rnd } from "react-rnd";

export default function MemeTexts(props) {
    const {textObjs, values, hidden, initLoc, isLoaded, setHasDragged, hasDragged, fontSize} = props;


    return (
            (initLoc !== null && isLoaded ? textObjs.map((textObj) => (
                (!hidden[textObj.id] ?  
                <Rnd
                    tabIndex="0"
                    key={textObj.id}
                    bounds="parent"
                    default={{
                    x: initLoc[textObj.id].x, 
                    y: initLoc[textObj.id].y
                    }}
                    onDragStart={() => setHasDragged(true)}
                    onResizeStart={() => setHasDragged(true)}
                    className={!hasDragged ? 'prompt' : null}  
                    style={{
                        fontSize: `clamp(${fontSize[textObj.id] / 16}em, 5vw, ${fontSize[textObj.id] / 8}em)`
                    }}
                >
                    {values[textObj.id]}
                    <svg 
                        className="marching-ants-border"
                        viewBox="0 0 200 100" 
                        preserveAspectRatio="none"
                    >
                        <rect x="0" y="0"/>
                    </svg>
                </Rnd> : null)
            )): null)
    )
}

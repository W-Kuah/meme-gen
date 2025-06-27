import { Rnd } from "react-rnd";

export default function MemeTexts(props) {
    const {textObjs, values, hidden, initLoc, isLoaded} = props;
    return (
            (initLoc !== null && isLoaded ? textObjs.map((textObj) => (
                (!hidden[textObj.id] ?  <Rnd
                    tabindex="0"
                    key={textObj.id}
                    bounds="parent"
                    default={{
                    x: initLoc[textObj.id].x, 
                    y: initLoc[textObj.id].y
                    }}
                >
                    {values[textObj.id]}
                </Rnd> : null)
            )): null)
    )
}

import memeLogo from "../assets/meme-icon.svg"

export default function Header() {
    return (
        <header className="header">
            <img 
                src={memeLogo} 
            />
            <h1>MEME-ERATOR</h1>
        </header>
    )
}

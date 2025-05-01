import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components'
import { palette } from '../myPalettes';
import { SketchPicker } from 'react-color';


const del = <i className="fa-sharp fa-solid fa-trash"></i>
const brush = <i className="fa-solid fa-brush"></i>
const paletteIcon = <i className="fa-solid fa-palette"></i>

function Palette() {
    const {id} = useParams()
    const initialPalette = palette.find(pal => pal.name === id)

    //state
    const [myPalette, setMyPalette] = React.useState(() => {
        const savedPalette = localStorage.getItem(`myPalette-${id}`)
        return savedPalette ? JSON.parse(savedPalette) : initialPalette
    })

    const [toRgb, setToRgb] = React.useState('hex');
    const [toggleColorPicker, setToggleColorPicker] = React.useState(false);
    const [colorPickerColor, setColorPickerColor] = React.useState('#fff');
    const [currentColor, setCurrentColor] = React.useState('');


    //random texts
    const copyTexts = ['Paste Me!', 'Copied!','Oh Paste Me','Already Copied!', 'Nice!', 'Okay!', 'Done!', 'Good Choice!', 'Right One!'];


    //send to localStorage
    useEffect(() => {
        localStorage.setItem(`myPalette-${id}`, JSON.stringify(myPalette))
    }, [myPalette])

    const toggleToRgb = (e) => {
        if(e.target.value === 'rgb'){
            setToRgb('rgb')
        }else{
            setToRgb('hex')
        }
    }

    const convertToRGB = (hex) => {
        hex = hex.replace('#', '')
        const r = parseInt(hex.substring(0, 2), 16)
        const g = parseInt(hex.substring(2, 4), 16)
        const b = parseInt(hex.substring(4, 6), 16)

        return `rgb(${r}, ${g}, ${b})`
    }

    const handleColorChange = (color) => {
        setColorPickerColor(color.hex)
    }

    const handleFullColorClick = (event) => {
        setCurrentColor(event)
        setTimeout(() => {
            setCurrentColor('')
        }, 1300)
    }

    const createColor = () => {
        if(!colorPickerColor) return

        const newColors = [...myPalette.colors]
        if(newColors.length < 20){
            newColors.push(colorPickerColor)
            setMyPalette({...myPalette, colors: newColors})
        }else{
            alert('You can only add 20 colors to a palette');
        }
    }

    const handleCopyToClipboard = (e) => {
        const text = e.target.innerText;
        navigator.clipboard.writeText(text)
    }
    
    const deleteColor = (index) => {
        const newColors = [...myPalette.colors]
        newColors.splice(index, 1)
        setMyPalette({...myPalette, colors: newColors})
    }

    const clear = () => {
        setMyPalette({...myPalette, colors: []})
    }

    const generateRandomText = () => {
        return copyTexts[Math.floor(Math.random() * copyTexts.length)]
    }

    return (
        <PaletteStyled>
            <div className="header-items">
                <div className="link-con">
                    <Link to={'/'}>&larr;&nbsp; Back</Link>
                </div>
                <div className="select-type">
                    <select  value={toRgb} onChange={toggleToRgb}>
                        <option value="hex">HEX</option>
                        <option value="rgb">RGB</option>
                    </select>
                </div>
                <div className="right">
                    <button onClick={() => setToggleColorPicker(!toggleColorPicker)} className="btn-icon">
                        {paletteIcon}
                    </button>
                    <button className='btn-icon' onClick={clear}>{brush}</button>
                </div>
            </div>
            {toggleColorPicker &&
                <div className="color-picker-con">
                    <div className="color-picker">
                        <SketchPicker
                            color={colorPickerColor} 
                            onChange={handleColorChange} 
                            width="400px"
                        />
                        <button className='btn-icon' onClick={() => {
                            createColor();
                        }}><i className="fa-solid fa-plus"></i> Add</button>
                    </div>
                    <div onClick={() => setToggleColorPicker(!toggleColorPicker)} className="color-picker-overlay"></div>
                </div>
            }
            <div className="colors">
                {myPalette.colors.map((color, index) => {
                    return <div 
                        key={index} 
                        style={{background: color}}
                        className="full-color"
                        onClick={(e) => {
                            handleCopyToClipboard(e)
                            handleFullColorClick(e.target.style.backgroundColor);
                        }}
                        >
                            <h4>
                                {toRgb === 'hex' ? color : convertToRGB(color)}
                            </h4>
                            <button className='btn-icon' onClick={() => {
                                deleteColor(index);
                            }}>{del}</button>
                        </div>
                })}
            </div>
            {currentColor && <div className="current-color" style={{backgroundColor: currentColor}}>
                <div className="text">
                    <h3>{generateRandomText()}</h3>
                </div>
            </div>
            }
        </PaletteStyled>
    )
}

const PaletteStyled = styled.div`
    position: relative;
    z-index: 5;
    width: 100%;
    .btn-icon{
        outline: none;
        cursor: pointer;
        font-size: 1.5rem;
        border: none;
        outline: none;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: .5rem 1rem;
        border-radius: 7px;
        color: white;
        background: #A855F7;
        transition: all 0.3s ease-in-out;
        &:hover{
            background: #0D0B33;
        }
    }
    .header-items{
        height: 6vh;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 2rem;
        background-color: #fff;
        .link-con{
            a{
                text-decoration: none;
                font-family: inherit;
                font-size: inherit;
                color: #000;
                font-weight: 500;
                width: 50%;
            }
        }
        select{
            font-family: inherit;
            font-size: inherit;
            font-weight: 500;
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 5px;
            outline: none;
            color: #fff;
            background-color: #000;
            cursor: pointer;
        }
        .right{
            display: flex;
            align-items: center;
            gap: .8rem;
            button:last-child{
                background-color: red;
            }
        }
    }
    .current-color{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: scale(0);
        transition: all 0.3s ease-in-out;
        animation: show 0.3s ease-in-out forwards;
        .text{
            background: rgba(255, 255, 255, 0.26);
            padding: 2rem 6rem;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 0 2px 5px 0 rgba(0,0,0,0.09);
            h3{
                text-align: center;
                font-size: 5rem;
                color: white;
                font-weight: 700;
                text-transform: uppercase;
                text-shadow: 3px 5px 7px rgba(0,0,0, 0.1);
            }
        }
        @keyframes show {
            0% {
                transform: scale(0);
                opacity: 0;
            }
            100% {
                transform: scale(1);
                opacity: 1;
            }
        }
    }
    .colors{
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        width: 100%;
        min-height: 94vh;
        .full-color{
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            h4{
                font-size: 1.2rem;
                color: #fff;
                text-transform: uppercase;
                font-weight: 700;
                text-shadow: 3px 3px 1px rgba(0,0,0, 0.2);
                pointer-events: none;
            }
            button{
                position: absolute;
                right: 0;
                bottom: 0px;
                border-bottom-left-radius: 0;
                border-top-right-radius: 0;
                border-bottom-right-radius: 0;
                padding: .3rem .4rem;
                font-size: 1.1rem;
                color: #fff;
                background: transparent;
                filter: drop-shadow(0 3px 0.3rem rgba(0,0,0,0.4));
            }
        }
    }

    .color-picker-con{
        .sketch-picker{
            box-shadow: 3px 3px 15px rgba(0,0,0, 0.5) !important;
        }
        .color-picker{
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 11;
            button{
                display: flex;
                align-items: center;
                gap: .5rem;
                box-shadow: 2px 2px 15px rgba(0,0,0,0.5);
            }
        }

        .color-picker-overlay{
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0, 0.8);
            z-index: 1;
        }
    }
`;

export default Palette
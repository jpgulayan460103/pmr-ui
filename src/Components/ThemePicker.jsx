import React from 'react';
import { useThemeSwitcher } from "react-css-theme-switcher";
import Icon from '@ant-design/icons';

const ColorSvg = ({color}) => (
    <svg t="1647332265237" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6265" width="1.5em" height="1.5em"><path d="M853.333333 597.333333a341.333333 341.333333 0 0 1-682.666666 0c0-162.56 122.026667-314.026667 234.666666-426.666666l77.653334-77.653334a32 32 0 0 1 22.613333-7.68h12.8a32 32 0 0 1 22.613333 9.386667L618.666667 170.666667c112.64 112.64 234.666667 264.106667 234.666666 426.666666z" p-id="6266" fill={color}></path></svg>
)

const Themepicker = () => {
    const { switcher, themes } = useThemeSwitcher();
    const switchTheme = (e) => {
        switcher({ theme: themes[e] });
        localStorage.setItem("theme", e);
    };
    return (
        <div className='text-center'>
            <Icon onClick={() => switchTheme('main') } component={ () => <ColorSvg color="#4834d4" /> } />
            <Icon onClick={() => switchTheme('blue') } component={ () => <ColorSvg color="#546de5" /> } />
            <Icon onClick={() => switchTheme('purple') } component={ () => <ColorSvg color="#8e44ad" /> } />
            <Icon onClick={() => switchTheme('pink') } component={ () => <ColorSvg color="#c44569" /> } />
            <Icon onClick={() => switchTheme('orange') } component={ () => <ColorSvg color="#f19066" /> } />
            <Icon onClick={() => switchTheme('yellow') } component={ () => <ColorSvg color="#f5cd79" /> } />
            <Icon onClick={() => switchTheme('green') } component={ () => <ColorSvg color="#16a085" /> } />
            <Icon onClick={() => switchTheme('dark') } component={ () => <ColorSvg color="#2c3e50" /> } />
        </div>
    );
}

export default Themepicker;

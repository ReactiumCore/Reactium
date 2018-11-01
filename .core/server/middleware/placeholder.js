const express = require('express');
const router = express.Router();
const xss = require('xss');

const placeholder = (req, res) => {
    const { width = 640, height = 480, filename = '' } = req.params;

    const {
        title = '',
        pattern = '#f7f7f7',
        color = '#fff',
        background = '#444',
        notes = '',
        region = '0,0,100,100',
        content = 'none',
    } = req.query;

    const [
        xPercent = 0,
        yPercent = 0,
        widthPercent = 100,
        heightPercent = 100,
    ] = (region || []).split(',');

    const useTitle = title === '' ? filename : title;

    res.set('Content-Type', 'image/svg+xml');
    res.send(`<?xml version="1.0" standalone="no"?>
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${xss(
        width
    )}" height="${xss(height)}" viewBox="0 0 ${xss(width)} ${xss(
        height
    )}" font-family="sans-serif"  preserveAspectRatio="none">
    <mask id="mask">
        <rect width="100%" height="100%" fill="#444"/>
        <rect x="${xss(xPercent)}%" y="${xss(yPercent)}%" width="${xss(
        widthPercent
    )}%" height="${xss(heightPercent)}%" fill="#fff"/>
    </mask>
<pattern id="pattern" x="50%" y="50%" width="40" height="40" patternUnits="userSpaceOnUse">
            <rect width="100%" height="100%"/>
    <path fill="#fff" d="M0,0L50,50V40L10,0zM0,30V40H10M30,0L50,20V30L20,0zM0,10L40,50H30L0,20" />
</pattern>
<pattern id="mountains" width="100" height="11"  patternUnits="userSpaceOnUse">
    <polygon fill="black" points="0,11.1 6.7,4.4 7.2,4.9 8.9,3.3 12.3,6.7 13.3,5.7 16.5,8.9 18.6,6.8 20.1,8.3 23.5,5 26.4,7.9 33.2,1.2 38.2,6.2 39.4,4.9 45.2,10.7 50.9,5.1 53.4,7.6 57.7,3.3 58.5,4.1 62.6,0 64.9,2.3 66,1.1 74.3,9.4 78.9,4.8 80.7,6.5 85.8,1.4 89.5,5.1 91.8,2.9 100,11.1 "/>
</pattern>
    <symbol id="male" viewBox="0 0 100 100" overflow="visible">
        <circle cx="50" cy="50" r="30"/>
        <rect x="10" y="85" width="80" height="100" rx="30"/>
        <rect x="23" y="160" width="24" height="120" rx="10"/>
        <rect x="53" y="160" width="24" height="120" rx="10"/>
    </symbol>
    <symbol id="female" viewBox="0 0 100 100" overflow="visible">
        <use xlink:href="#male" />
        <path d="M50,85L95,200H5"/>
    </symbol>

    <symbol id="landscape" viewBox="0 0 100 100" overflow="visible">
        <circle cx="50" cy="50" r="30" fill="white"/>
        <rect transform="translate(-2140,50) scale(8)"  width="4000" height="11" fill="url(#mountains)"/>
<rect x="-2140" y="137" width="32000" height="5000%"  fill="black"/>
    </symbol>
<rect width="100%" height="100%" fill="${xss(background)}" />
    <svg x="${xss(xPercent)}%" y="${xss(yPercent)}%" width="${xss(
        widthPercent
    )}%" height="${xss(heightPercent)}%" overflow="visible" opacity="0.25" >
    <use xlink:href="#${xss(content)}"/>
</svg>
<rect mask="url(#mask)" width="100%" height="100%" fill="url(#pattern)" opacity=".05" />
<rect width="100%" height="100%" fill="none" stroke="${xss(
        color
    )}" stroke-opacity="0.7" stroke-width="2%" />
<svg viewBox="0 0 60 100">
    <text transform="translate(30,44)" text-anchor="middle" alignment-baseline="central" font-size="12" fill="${xss(
        color
    )}">
        <tspan x="0">${xss(
            width
        )}</tspan><tspan x="0" dy="9">×</tspan><tspan x="0" dy="11">${xss(
        height
    )}</tspan>
    </text>
</svg>
<svg height="20%" viewBox="0 0 200 40" preserveAspectRatio="xMidYMin" opacity=".5" font-size="10" overflow="visible">
    <text transform="translate(100,37)" text-anchor="middle" fill="${xss(
        color
    )}">
        <tspan x="0">${xss(useTitle)}</tspan>
    </text>
</svg>
<svg y="80%" height="20%" viewBox="0 0 200 40" preserveAspectRatio="xMidYMax" font-size="10" opacity=".5" overflow="visible">
    <text transform="translate(100,11)" text-anchor="middle" fill="${xss(
        color
    )}">
        <tspan x="0">${xss(notes)}</tspan>
    </text>
</svg>
</svg>`);
};

router.get('/placeholder/:width/:height/:filename', placeholder);
router.get('/placeholder/:width/:height', placeholder);

module.exports = router;

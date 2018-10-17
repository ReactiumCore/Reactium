const express = require('express');
const router = express.Router();
const xss = require('xss');

const placeholder = (req, res) => {
    const { width = 640, height = 480, title = 'Title' } = req.params;

    const {
        pattern = '#f7f7f7',
        color = '#fff',
        background = '#444',
        notes = '',
    } = req.query;

    res.set('Content-Type', 'image/svg+xml');
    res.send(`<?xml version="1.0" standalone="no"?>
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${xss(
            width
        )}" height="${xss(height)}" viewBox="0 0 ${xss(width)} ${xss(
        height
    )}" font-family="sans-serif"  preserveAspectRatio="none">
        <pattern id="pattern" x="50%" y="50%" width="40" height="40" patternUnits="userSpaceOnUse">
            <path fill="#f7f7f7" opacity="0.07" d="M0,0L50,50V40L10,0zM0,30V40H10M30,0L50,20V30L20,0zM0,10L40,50H30L0,20" />
        </pattern>
        <rect width="100%" height="100%" fill="${xss(background)}" />
        <rect width="100%" height="100%" fill="url(#pattern)" />
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
                <tspan x="0">${xss(title)}</tspan>
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

router.get('/placeholder/:width/:height/:title', placeholder);

module.exports = router;

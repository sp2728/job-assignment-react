import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { select } from 'd3';
import * as constants from '../../Constant';
import jsPDF from 'jspdf'
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Button } from '@mui/material';
import './Charts.css';

const GeoChart = ({ data, stateData, property, viewPatients }) => {
    const svgRef = useRef();
    const wrapperRef = useRef();
    const [states, setStates] = useState({})

    const downloadGraph = () => {
        var svgElement = document.getElementById('svg');
        let { width, height } = svgElement.getBBox();

        let clonedSvgElement = svgElement.cloneNode(true);

        let outerHTML = clonedSvgElement.outerHTML,
            blob = new Blob([outerHTML], { type: 'image/svg+xml;charset=utf-8' });
        let URL = window.URL || window.webkitURL || window;
        let blobURL = URL.createObjectURL(blob);

        let image = new Image();
        image.src = blobURL;
        let canvas = document.createElement('canvas');
        canvas.widht = width;

        canvas.height = height;
        let context = canvas.getContext('2d');
        // draw image in canvas starting left-0 , top - 0  
        context.drawImage(image, 0, 0, width, height);
        //  downloadImage(canvas); need to implement
        var dataUrl = canvas.toDataURL("image/png");

        var doc = new jsPDF();
        doc.text(`Geochart`, 60, 15)
        doc.addImage(dataUrl, 15, 40, 180, 100);
        doc.save(`GeoChart-${Date.now()}.pdf`);

    }

    useEffect(() => {
        if (stateData.states && Object.keys(stateData).length > 0) {
            Object.keys(stateData.states).map(e => {
                states[constants.AcronymToStateNames[e]] = stateData.states[e];
            });
            setStates(states);
        }

        const svg = select(svgRef.current);

        // Map and projection
        var path = d3.geoPath();

        //Width and height of map
        const width = 960;
        const height = 500;

        // D3 Projection
        var projection = d3.geoAlbersUsa()
            .translate([width / 2, height / 2])    // translate to center of screen
            .scale([1000]);          // scale things down so see entire US

        // Data and color scale
        var colorScale = d3.scaleThreshold()
            .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
            .range(d3.schemeBlues[7]);


        // create a tooltip
        var tooltip = d3.select(".map-tooltip")
            .style("opacity", 0)
            .attr("position", "absolute")
            .style("padding", "5px")

        let mouseOver = function (event, d) {
            tooltip
                .style("opacity", 1)
                .html(`${d.properties.NAME} \n Count: ${states[d.properties.NAME] || 0}`)
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 80) + "px")

            d3.selectAll(".states")
                .transition()
                .style("opacity", 1)
            d3.select(this)
                .transition()
                .style("opacity", 0.5)
                .style("cursor", "pointer")
        }

        let mouseLeave = function (d) {
            tooltip
                .style("opacity", 0)
            d3.selectAll(".states")
                .transition()
                .style("opacity", 1)
            d3.select(this)
                .transition()
                .style("opacity", 1)
        }


        svg.append("g")
            .selectAll("path")
            .data(data.features)
            .enter()
            .append("path")
            .attr("fill", '#6495ED')
            .attr("class", "states")
            .attr("d", d3.geoPath()
                .projection(projection))
            .attr("fill", function (d) {
                let val = states[d.properties.NAME] || 0;
                return colorScale(val * 1000000);
            })
            .on("click", viewPatients)
            .attr("class", function (d) { return "states" })
            .style("stroke", "black")
            .on("mouseover", mouseOver)
            .on("mouseleave", mouseLeave)

    }, [data, property, stateData])

    console.log(stateData);

    return (
        <div ref={wrapperRef} style={{ marginBottom: '2rem' }}>


            {Object.keys(stateData).length != 0 && <Button id='geochart-download'
                onClick={downloadGraph}
                className="download-icon"
                style={{ color: 'royalblue' }}
                title="Download">
                <FileDownloadIcon />
                Download
            </Button>}
            <svg id="svg" style={{ width: 960, height: 500 }} ref={svgRef}>
            </svg>
            <div className="map-tooltip"></div>
        </div>
    )
}

export default GeoChart

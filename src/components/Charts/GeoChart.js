import React, { StyleSheet, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { select, geoPath, geoAlbersUsa } from 'd3';
import { showModal } from '../../store/modals';
import * as constants from '../../Constant';
import { useSelector, useDispatch } from 'react-redux';

const GeoChart = ({ data, property }) => {
    const svgRef = useRef();
    const dispatch = useDispatch();
    const wrapperRef = useRef();
    const statesData = {}

    useEffect(() => {
        if(Object.keys(data.stateData).length > 0 ){
            Object.keys(data.stateData.states).map(e => {
                statesData[constants.AcronymToStateNames[e]] = data.stateData.states[e];
            });
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
            .html(`${d.properties.NAME} \n Count: ${statesData[d.properties.NAME] || 0}` )
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY-80) + "px")

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

        let viewPaitents = (event, d) => {
            dispatch(showModal({ messageType: constants.MESSAGE_TYPES.VIEW_HEATMAP_PATIENTS, action: 'open', data: { name: d.properties.NAME } }));
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
                let val = statesData[d.properties.NAME] || 0;
                return colorScale(val * 1000000);
            })
            .on("click", viewPaitents)
            .attr("class", function (d) { return "states" })
            .style("stroke", "black")
            .on("mouseover", mouseOver)
            .on("mouseleave", mouseLeave)
            
    }, [data, property])

    return (
        <div ref={wrapperRef} style={{ marginBottom: '2rem' }}>
            <svg style={{ width: 960, height: 500 }} ref={svgRef}>
            </svg>                
            <div className="map-tooltip"></div>
        </div>
    )
}

export default GeoChart

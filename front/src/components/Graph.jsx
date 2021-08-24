import {useRef, useEffect, useState} from "react";
import * as d3 from "d3";
import {useIntl} from "react-intl";


function Graph(){

    const intl = useIntl();

    const canvas = useRef()

    const stepConteo = 5;

    const [data, setData] = useState([]);

    useEffect(()=>{
        fetch("/servicios").then(resp=>resp.json()).then(servicios=>{
            const temp = {};
            servicios.forEach(servicio=>{
                if(temp[servicio.categoria]){
                    temp[servicio.categoria].conteo++;
                }else{
                    temp[servicio.categoria] = {categoria: servicio.categoria, conteo: 1}
                }

            })
            setData(Object.values(temp))
        })
    }, [])

    useEffect(() => {
        function getSuperiorLimitConteo(){
            const result = Math.max(...data.map(d=>parseFloat(d.conteo)))
            return (Math.floor(result/stepConteo)+1)*stepConteo
        }

    function drawGraph(){
        d3.select(canvas.current).selectAll("*").remove();
        const svg = d3
            .select(canvas.current)
            .append("svg")

        const width = 700;
        const height = 500;
        const margin = {top: 10, left: 50, bottom: 40, right: 10};
        const iwidth = width - margin.left - margin.right;
        const iheight = height - margin.top - margin.bottom;

        svg.attr("width", width);
        svg.attr("height", height);

        svg.style("background-color", "white");

        let g = svg
            .append("g")
            .attr("transform", `translate(${margin.left+50},${margin.top})`);

        const widthScale = d3.scaleLinear()
            .domain([0, getSuperiorLimitConteo()])
            .range([0, iwidth]);


        const y = d3.scaleBand()
            .domain(data.map(d => intl.formatMessage({id:d.categoria})) )
            .range([0, iheight])
            .padding(0.1);



        g.append("g")
            .classed("x--axis", true)
            .call(d3.axisBottom(widthScale))
            .attr("transform", `translate(0, ${iheight})`);

        g.append("g")
            .classed("y--axis", true)
            .call(d3.axisLeft(y));

        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", width/2+100)
            .attr("y", height - 6)
            .text(intl.formatMessage({id:"xD3"}))
            .attr("font-size", "1em");

        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", 10)
            .attr("x", -height/3)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text(intl.formatMessage({id:"yD3"}))
            .attr("font-family", "Open Sans")
            .attr("color", "#373842")
            .attr("font-size", "1em");

    }
         drawGraph();
    }, [data, intl]);


    return (
            <div ref={canvas}/>
    );


}

export default Graph
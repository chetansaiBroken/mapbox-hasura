import React, { useState, useEffect } from 'react';
import './web-component.css'

import * as turf from "@turf/turf";
import { get_test, get_test2, get_test3, get_markers, get_clusters } from './graphql_queries';


function Web_component() {

    let [containers, set_containers] = useState([
        {
            name: "0",
            id: 0,
            webc: null
        }
    ]);
    let [selected, set_selected] = useState(0);

    const [showText, setShowText] = useState(false);
    const add_one_more_container = () => set_containers([...containers, { name: `${containers.length}`, id: containers.length, webc: null }]);

    const add_script = (url, callback) => {
        const s = document.createElement("script");
        s.src = url;
        s.addEventListener("load", callback);
        document.body.appendChild(s);
    }

    const insert_web_component = (name) => {
        if (!name) return;

        // const webc_path = "https://wec_repo.brokenatom.io/company_name";
        // const url = webc_path + `/${name}.js`;


        const url = `/webc/${name}.js`;
        add_script(url, () => {
            console.log("loaded: ", name);

            set_selected(i => {
                set_containers(cs => {
                    cs[i].webc = "broken-w1";
                    return [...cs];
                })
                return i;
            });
        })
    }

    const get_web_component_and_insert_map = () => {
        // let prompt_res = prompt("web component name");
        let prompt_res = "broken-map";
        insert_web_component(prompt_res);
    }
    const get_web_component_and_insert_charts = () => {
        // let prompt_res = prompt("web component name");
        let prompt_res = "broken-charts";
        insert_web_component(prompt_res);
    }

    const insert_marker1 = async (lat_max, lat_min, lon_max, lon_min) => {
        // let x = map.getcenter();
        // console.log("x is", x);
        // let r1 = await get_test();
        // r1 = r1.data;
        // let features1 = [];
        // for(let i = 0; i < r1.length; i++){
        //   features1.push({type:"Feature", geometry:{type:"Point", coordinates: r1[i].location.coordinates},
        //          properties: {
        //         title: "Mapbox",
        //        // description: "Balurghat, West Bengal, India",
        //   },})
        // }

        // let r2 = await get_test2();
        // r2 = r2.data;
        // console.log("r2 is", r2);
        // let features2 = [];
        // for(let i = 0; i < r2.length; i++){
        //   features2.push({type:"Feature", geometry:{type:"Point", coordinates: [r2[i].c_x, r2[i].c_y]},
        //          properties: {
        //         title: "Mapbox",
        //        // description: "Balurghat, West Bengal, India",
        //   },})
        // }


        //   let r3 = await get_test3(d, lat, lng);
        //   if(!r3){r3 = []}
        //   r3 = r3.data;
        //  // console.log("r3 is", r3);
        //   let features3 = [];
        //   for(let i = 0; i < r3.length; i++){
        //     features3.push({type:"Feature", geometry:{type:"Point", coordinates: [r3[i].c_x, r3[i].c_y]},
        //            properties: {
        //           title: "Mapbox",
        //          // description: "Balurghat, West Bengal, India",
        //     },})
        //   }

        let r = await get_clusters(lat_max, lat_min, lon_max, lon_min, 10);
        if (!r) {console.log("no response from hasura"); r = [] }
        r = r.data;
        console.log("r is", r);
        let total
        let counts = r.map(c=>c.count) // => [12, 23, 34]
        if(counts.length == 0){total = 0}
        else{total = counts.reduce((t, c)=>t+c)};
       
        if(total < 50){
            let m = await get_markers(lat_max, lat_min, lon_max, lon_min);
            if (!m) { m = [] }
            m = m.data;
            console.log("m is", m);
            let m_features = [];
            for (let i = 0; i < m.length; i++) {
                m_features.push({
                    type: "Feature", geometry: { type: "Point", coordinates: [m[i].c_x, m[i].c_y] },
                    properties: {
                        title: "Mapbox",
                        // description: "Balurghat, West Bengal, India",
                    },
                })
            }
            const geojson_marker= {
                type: "FeatureCollection",
                features: m_features
            }
            let e = new CustomEvent("add_markers", { detail: { geojson: geojson_marker } });
            window.dispatchEvent(e);
            const geojson_cluster = {
                type: "FeatureCollection",
                features: []
            }
            e = new CustomEvent("add_clusters", { detail: { geojson: geojson_cluster } });
            window.dispatchEvent(e);
        }
       
        if(total > 50){
            let c_features = [];
            for (let i = 0; i < r.length; i++) {
                c_features.push({
                    type: "Feature", geometry: { type: "Point", coordinates: [r[i].c_x, r[i].c_y] },
                    properties: {
                        title: "Mapbox",
                        // description: "Balurghat, West Bengal, India",
                    },
                })
            }
            const geojson_cluster = {
                type: "FeatureCollection",
                features: c_features
            }
            let e = new CustomEvent("add_clusters", { detail: { geojson: geojson_cluster } });
            window.dispatchEvent(e);
            const geojson_marker = {
                type: "FeatureCollection",
                features: []
            }
            e = new CustomEvent("add_markers", { detail: { geojson: geojson_marker } });
            window.dispatchEvent(e);
       }
      
       


        //   console.log("features are", features1)
        //   console.log("features of clusters are", features2)
        // const geojson = {
        //     type: "FeatureCollection",
        //     features: [
        //       {
        //         type: "Feature",
        //         geometry: {
        //           type: "Point",
        //           coordinates: [88.778695, 25.231729],
        //         },
        //         properties: {
        //           title: "Mapbox",
        //           description: "Balurghat, West Bengal, India",
        //         },
        //       },

        //       {
        //         type: "Feature",
        //         geometry: {
        //           type: "Point",
        //           coordinates: [78.382577, 17.440692],
        //         },
        //         properties: {
        //           title: "Mapbox",
        //           description: "Hyderabad, Telengena, India",
        //         },
        //       },
        //     ],
        //   };
        // const geojson2 = {
        //   type: "FeatureCollection",
        //   features: features1
        // }
        // const geojson3 = {
        //   type: "FeatureCollection",
        //   features: features2
        // }
        // const geojson4 = {
        //     type: "FeatureCollection",
        //     features: features3
        //   }
     



        // console.log("geojson2 is", geojson2)
       
    }



    // const insert_marker = () => {
    //     const geojson = {
    //         type: "FeatureCollection",
    //         features: [
    //           {
    //             type: "Feature",
    //             geometry: {
    //               type: "Point",
    //               coordinates: [72.877655, 19.075983],
    //             },
    //             properties: {
    //               title: "Mapbox",
    //               description: "Mumbai, Maharastra, India",
    //             },
    //           },
    //         ],
    //       };
    //     let e = new CustomEvent("add_markers", {detail: {geojson: geojson}});
    //    window.dispatchEvent(e);
    // }

    // const getCenter = () => {
    //   let e = new CustomEvent("onZoomin")
    //   window.dispatchEvent(e);
    // }

    // only once
    useEffect(() => {
        // const e = new CustomEvent("broken_map_subscribe_center_updated");
        // window.dispatchEvent(e);

        insert_web_component("broken-map");

        const listen_to_center_change = (e) => {

            if (!e.detail) return console.warn("invalid event data", e);

            let bounds = e.detail.bounds;
            if (!bounds) return;
            console.log("bounds are: ", bounds)
            let lat_min = bounds._sw.lat;
            let lon_min = bounds._sw.lng;
            let lat_max = bounds._ne.lat;
            let lon_max = bounds._ne.lng;
            let center = e.detail.center;
            console.log("center is : ", center)
            console.log("lat is: ", center.lat, " lng is: ", center.lng)


            // console.log(bounds);

            const from = turf.point([center.lng, center.lat]);
            const to = turf.point([center.lng, bounds._ne.lat]);

            const d = turf.distance(from, to, { units: 'meters' });

            console.log("from: ", from, " to: ", to, " distance: ", d);
            insert_marker1(lat_max, lat_min, lon_max, lon_min);


        }

        window.addEventListener("broken_map_bounds_changed", listen_to_center_change);

        return () => {
            window.removeEventListener("broken_map_bounds_changed", listen_to_center_change);
        }
    }, []);


    return (
        <div >


            {containers.map((e, i) => (
                <div key={i} id={e.id} className='broken-container'
                    onClick={() => { set_selected(i) }}
                    style={{ border: selected === i ? "2px solid #c1c1e1" : "2px solid #eeeeee", backgroundColor: selected === i ? "lavender" : "" }}>
                    <button onClick={get_web_component_and_insert_map} style={{ padding: "1rem" }}>Map</button>
                    {/* <h1>{e.name}</h1> */}
                    {/* <p class="check"> <input id="mycheckbox" type="checkbox" class="remember" style={{padding: "0.5rem", float:"right"}}/></p> */}
                    <p style={{ padding: "0.5rem", float: "right" }}>
                        <button onClick={insert_marker1} >Marker</button>
                        {/* <button onClick={insert_marker} >Charts</button> */}
                        {/* <button onClick={getCenter}>Center</button> */}
                    </p>

                    {e.webc && (
                        <broken-map></broken-map>
                    )}

                    {e.webc && (
                        <broken-charts></broken-charts>
                    )}


                </div>
            ))}

            <div>
                <button onClick={add_one_more_container}>+</button>
            </div>


        </div>
    )
}


export default Web_component
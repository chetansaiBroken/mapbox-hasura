import React, { useState } from 'react';
import './web-component.css'


var axios = require ("axios");

let API_URL = "http://localhost:8080/v1/graphql";

const get_test = async() => {
    const graphqlQuery = {
        "operationName": "MyQuery",
        "query": `query MyQuery {
            beacons {
              location
            }
          }`,
        "variables": {}
    };
    const url = API_URL;
    console.log(url);
    let r = await axios.post(url,  graphqlQuery ).then( console.log("time 2 is", Date.now()))
    // if(r.data){console.log("yes!", r.data.data.beacons[3].location.coordinates)}
    if(!r.data.data.beacons){
      return({success: false, data: []})
    }
    return ({success: true, data:r.data.data.beacons})
}

const get_test2 = async() => {
  const graphqlQuery = {
      "operationName": "MyQuery",
      "query": `query MyQuery {
        get_beacon_clusters(args: {no_of_clusters: 6}) {
          c_x
          c_y
          cid
          count
        }
      }`,
      "variables": {}
  };
  const url = API_URL;
  console.log(url);
  console.log("time 1 is", Date.now());
  let r = await axios.post(url,  graphqlQuery ).then(console.log("time 2 is", Date.now()));
  // if(r.data){console.log("yes!", r.data.data.beacons[3].location.coordinates)}
  if(!r.data){
    return({success: false, data: []})
  }
  console.log()
  return ({success: true, data:r.data.data.get_beacon_clusters})
}


function Web_component() {

    let [containers, set_containers] = useState ([
        {
            name: "0",
            id: 0,
            webc: null
        }
    ]);
    let [selected, set_selected] = useState(0);

    const [showText, setShowText] = useState(false);
    const add_one_more_container = () => set_containers([...containers, {name: `${containers.length}`, id: containers.length, webc: null}]);
    
    const add_script = (url, callback) => {
        const s = document.createElement("script");
        s.src = url;
        s.addEventListener("load", callback);
        document.body.appendChild(s);
    }

    const insert_web_component = (name) => {
        if(!name) return;

        // const webc_path = "https://wec_repo.brokenatom.io/company_name";
        // const url = webc_path + `/${name}.js`;


        const url = `/webc/${name}.js`;
        add_script(url, ()=>{
            console.log("loaded: ", name);
            
            set_selected(i=>{
                set_containers(cs=>{
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

    const insert_marker1 = async () => {
      let r1 = await get_test();
      r1 = r1.data;
      console.log("r is", r1);
      let features1 = [];
      for(let i = 0; i < r1.length; i++){
        features1.push({type:"Feature", geometry:{type:"Point", coordinates: r1[i].location.coordinates},
               properties: {
              title: "Mapbox",
             // description: "Balurghat, West Bengal, India",
        },})
      }

      let r2 = await get_test2();
      r2 = r2.data;
      console.log("r2 is", r2);
      let features2 = [];
      for(let i = 0; i < r2.length; i++){
        features2.push({type:"Feature", geometry:{type:"Point", coordinates: [r2[i].c_x, r2[i].c_y]},
               properties: {
              title: "Mapbox",
             // description: "Balurghat, West Bengal, India",
        },})
      }



      console.log("features are", features1)
      console.log("features of clusters are", features2)
        const geojson = {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [88.778695, 25.231729],
                },
                properties: {
                  title: "Mapbox",
                  description: "Balurghat, West Bengal, India",
                },
              },
      
              {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [78.382577, 17.440692],
                },
                properties: {
                  title: "Mapbox",
                  description: "Hyderabad, Telengena, India",
                },
              },
            ],
          };
        const geojson2 = {
          type: "FeatureCollection",
          features: features1
        }
        const geojson3 = {
          type: "FeatureCollection",
          features: features2
        }
       // console.log("geojson2 is", geojson2)
        let e = new CustomEvent("add_markers", {detail: {geojson: geojson3}});
        window.dispatchEvent(e);
    }



    const insert_marker = () => {
        const geojson = {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [72.877655, 19.075983],
                },
                properties: {
                  title: "Mapbox",
                  description: "Mumbai, Maharastra, India",
                },
              },
            ],
          };
        let e = new CustomEvent("add_markers", {detail: {geojson: geojson}});
       window.dispatchEvent(e);
    }
    
    return (
      <div >


        {containers.map((e, i)=>(
            <div key={i} id={e.id} className='broken-container' 
                onClick={()=>{set_selected(i)}} 
                style={{border: selected===i?"2px solid #c1c1e1": "2px solid #eeeeee", backgroundColor: selected===i?"lavender": "" }}> 
                <button onClick={get_web_component_and_insert_map} style={{padding: "1rem"}}>Map</button>
                {/* <h1>{e.name}</h1> */}
                {/* <p class="check"> <input id="mycheckbox" type="checkbox" class="remember" style={{padding: "0.5rem", float:"right"}}/></p> */}
                <p style={{padding: "0.5rem", float:"right"}}>
                    <button onClick={insert_marker1} >Marker</button>
                    <button onClick={insert_marker} >Charts</button>
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
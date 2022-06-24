//import exp = require("constants");



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
        get_beacon_clusters(args: {no_of_clusters: 10}) {
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



const get_test3 = async(d, lat, lng) => {
    console.log("d : ", d, " lat :", lat, " lng: ", lng);
    
  const graphqlQuery = {
      "operationName": "MyQuery",
      "query": `query MyQuery {
        get_beacon_clusters_within(args: {distance: "${d}", lat: "${lat}", lon: "${lng}", no_of_clusters: 10}) {
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
  let r = await axios.post(url,  graphqlQuery );
  if(!r.data){
    return({success: false, data: []})
  }
  console.log()
  if(!r.data.data){return({success: false, data: []})}
  return ({success: true, data:r.data.data.get_beacon_clusters_within})
}
const get_clusters = async(lat_max, lat_min, lon_max, lon_min, n) => {
    console.log("get_test4", lat_max, lat_min, lon_max, lon_min );
   
    const graphqlQuery = {
        "operationName": "MyQuery",
        "query": `query MyQuery {
            get_beacon_clusters_within_box2(args: { lat_max: ${lat_max}, lat_min: ${lat_min}, lon_max: ${lon_max}, lon_min: ${lon_min}, no_of_clusters: ${n}}) {
            cid
            count
            c_y
            c_x
            }
        }`,
        "variables": {}
    };
    const url = API_URL;
    console.log(url);
    let r = await axios.post(url,  graphqlQuery)
    if(!r.data){
        console.log("something wrong here")
        return({success: false, data: []})
    }
    if(!r.data.data){
      return ({success: false, data: []})
    }
    return ({success: true, data:r.data.data.get_beacon_clusters_within_box2})
}


const get_markers = async(lat_max, lat_min, lon_max, lon_min) => {
    const graphqlQuery = {
        "operationName": "MyQuery",
        "query": `query MyQuery {
            get_beacon_points_within_box3(args: {lat_max: ${lat_max}, lat_min: ${lat_min}, lon_max: ${lon_max}, lon_min: ${lon_min}}) {
              c_x
              c_y
            }
          }`,
        "variables": {}
    };
    const url = API_URL;
    console.log(url);
    let r = await axios.post(url,  graphqlQuery)
    if(!r.data){
        console.log("something wrong here")
        return({success: false, data: []})
    }
    if(!r.data.data){
      return ({success: false, data: []})
    }
    return ({success: true, data:r.data.data.get_beacon_points_within_box3})
}






export {
    get_test,
    get_test2, 
    get_test3,
    get_markers,
    get_clusters
}
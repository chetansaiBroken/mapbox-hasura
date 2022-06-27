class BrokenMap extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div id="broken-map"></div>
        `;

        const map_el = this.querySelector("div#broken-map");
        if (!map_el) return;

        map_el.style.width = "80%";
        map_el.style.height = "500px";
        // map_el.style.margin-left = "auto";
        map_el.style.left = "10%";


        const add_script = (url, callback) => {
            const s = document.createElement("script");
            s.src = url;
            s.id = 'script-mapbox-gl';
            s.addEventListener("load", callback);
            document.body.appendChild(s);
        };

        let url = "https://api.mapbox.com/mapbox-gl-js/v2.8.2/mapbox-gl.js";
        add_script(url, () => {
            console.log(`url: ${url} loaded`);


            const mapboxgl = window.mapboxgl;
            mapboxgl.accessToken =
                "pk.eyJ1Ijoicm95OTYiLCJhIjoiY2w0Y2Jtd3pxMXVvbDNpbnN0M3FxN200bCJ9.Gfy-dqVVJL7amvseEvAqMw";

            const map = new mapboxgl.Map({
                container: "broken-map", // container ID
                style: "mapbox://styles/roy96/cl4cp1zjf003k14nxt863gf4u", // style URL
                center: [78.962883, 20.593683], // starting position [lng, lat]
                zoom: 3, // starting zoom
            });
            console.log("center is", map.getCenter());

            window.glmap = map;
            // const add_markers = (geojson) => {

            //     for (let f of geojson.features){
            //         const marker = new mapboxgl.Marker();
            //         marker.setLngLat(f.geometry.coordinates).addTo(map);
            //     }

            // };

            map.on("load", ()=>{
            
                let markers = [];
    
                const add_markers_old = (geojson) => {
                    for (let m of markers) {
                        m.remove();
                    }
    
                    for (let f of geojson.features) {
    
                        // create a HTML element for each feature
                        const el = document.createElement("div");
                        el.className = "marker";
    
                        let m = new mapboxgl.Marker();
                        m.setLngLat(f.geometry.coordinates).addTo(map);
    
                        markers.push(m);
                    }
                };
    
    
                map.addSource('markers', {
                    type: 'geojson',
                    data: {
                        type: "FeatureCollection",
                        features: [],
                    },
                    cluster: true,
                    clusterMaxZoom: 14,
                    clusterRadius: 50
                });
    
    
    
                map.addLayer({
                    id: 'markers',
                    type: 'circle',
                    source: 'markers',
                    paint: {
                        'circle-color': '#06AA7C',
                        'circle-radius': 6,
                        'circle-stroke-width': 2,
                        'circle-stroke-color': '#FFFFFF'
                    }
                });
    
                const add_markers = (geojson) => {
                    const source = map.getSource('markers');
                    if (source) {
                        source.setData(geojson);
                    }
                };



                map.addSource('clusters', {
                    type: 'geojson',
                    data: {
                        type: "FeatureCollection",
                        features: [],
                    },
                    // cluster: true,
                    clusterMaxZoom: 14,
                    clusterRadius: 50
                });
    
    
    
                map.addLayer({
                    id: 'clusters',
                    type: 'circle',
                    source: 'clusters',
                    paint: {
                        'circle-color': '#DC143C',
                        'circle-radius': ['number', ['get', 'size'], 100],
                        'circle-stroke-width': 1,
                        'circle-stroke-color': '#FFFFFF'
                    }
                });


                const add_clusters = (geojson) => {
                    const source = map.getSource('clusters');
                    if (source) {
                        source.setData(geojson);
                    }
                };
    
    
                // const subscriptions = []; // center
    
                let publish_center = true;
                let publish_bounds = true;
    
                // map.on('zoomend', () => {
                //     if(publish_bounds){
                //         const c = map.getCenter();
                //         const bb = map.getBounds();
                //         let e = new CustomEvent("broken_map_bounds_changed", {detail: {center: c, bounds: bb}});
                //         window.dispatchEvent(e);
                //     }
                // });
                // map.on('dragend', () => {
                //     if(publish_bounds){
                //         const c = map.getCenter();
                //         const bb = map.getBounds();
                //         let e = new CustomEvent("broken_map_bounds_changed", {detail: {center: c, bounds: bb}});
                //         window.dispatchEvent(e);
                //     }
                // });
    
    
                map.on('moveend', () => {
                    if (publish_bounds) {
                        const c = map.getCenter();
                        const bb = map.getBounds();
                        let e = new CustomEvent("broken_map_bounds_changed", { detail: { center: c, bounds: bb } });
                        window.dispatchEvent(e);
                    }
                });
                
                
                
                
                window.addEventListener("add_markers", function (e) {
                    // console.log(e.detail);
                    add_markers(e.detail.geojson);
                });
                window.addEventListener("add_clusters", function (e) {
                    // console.log(e.detail);
                    add_clusters(e.detail.geojson);
                });
                window.addEventListener("broken_map_subscribe_center_updated", function (e) {
                    // console.log("new center is", map.getCenter())
                    publish_center = true;
    
                });
                window.addEventListener("broken_map_subscribe_bounds_changed", function (e) {
                    publish_bounds = true;
    
                });
            });







        });

        // button.addEventListener("click", this.myFunction);
        // button.addEventListener("mouseover", this.mySecondFunction);
    }

    // myFunction(e) {
    //     document.getElementById("demo").innerHTML += "Hello World";
    // }
    // mySecondFunction() {
    //     document.getElementById("demo").innerHTML += "Hello Roy!<br>"
    //   }
}

window.customElements.define("broken-map", BrokenMap);

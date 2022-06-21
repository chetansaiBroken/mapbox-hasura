class BrokenMap extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div id="broken-map"></div>
        `;

        const map_el = this.querySelector("div#broken-map");
        if(!map_el) return;
        
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

            // const add_markers = (geojson) => {
    
            //     for (let f of geojson.features){
            //         const marker = new mapboxgl.Marker();
            //         marker.setLngLat(f.geometry.coordinates).addTo(map);
            //     }
    
            // };
            let markers = [];
    
            const add_markers = (geojson) => {
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
    
            // add markers to map
            // for (const feature of geojson.features) {
            //   // create a HTML element for each feature
            //   const el = document.createElement("div");
            //   el.className = "marker";
    
            //   // make a marker for each feature and add to the map
            //   new mapboxgl.Marker(el)
            //     .setLngLat(feature.geometry.coordinates)
            //     .setPopup(
            //       new mapboxgl.Popup({ offset: 25 }) // add popups
            //         .setHTML(
            //           `<h3>${feature.properties.title}</h3><p>${feature.properties.description}</p>`
            //         )
            //     )
            //     .addTo(map);
            // }
    
            window.addEventListener("red", function (e) {
                console.log("listend to check event");
                console.log(e.detail);
            });
    
            window.addEventListener("add_markers", function (e) {
                console.log(e.detail);
                add_markers(e.detail.geojson);
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

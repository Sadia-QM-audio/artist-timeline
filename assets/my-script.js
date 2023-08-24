const generateButton = document.getElementById("generatebutton");

//for storing attributes of an artwork
//this step is necessary, as different APIs use different structures and attribute names
//basically, this standardizes info from multiple APIs
class Work {
    constructor(title, year, artist, img, info, source) {
        this.title = title;
        this.year = year;
        this.img = img;
        this.artist = artist;
        this.info = info;
        this.source = source;
    }
}

let workListMET;
let workListCMA;

async function mainFunc(artistName) {
    try {
        await Promise.all([metAPI(artistName), cmaAPI(artistName)]);
        await timeline(workListMET, workListCMA); // Execute the third function after both have finished
    } catch (error) {
        console.error("Error:", error);
    }
}

generateButton.addEventListener("click", async function() {
    //q is not case sensitive
    //returns list of ids of artworks
    let artistName // =`Henri-Edmond Cross` //for testing
    artistName = document.getElementById('artistNameInput').value;

    //if nothing is entered, generate error message
    if (artistName == "") {
        document.getElementById("allIDs").innerHTML = "Please enter a valid name";
        return;
    }

    // await metAPI(artistName);
    // await cmaAPI(artistName);

    mainFunc(artistName);
    
});



async function timeline(workListMET, workListCMA) {
    //For the webpage
    const loadingContainer = document.getElementById("loadingTimeline");
    loadingContainer.innerHTML = `[Loading timeline]`
    
    //combine both lists
    let workList = workListMET.concat(workListCMA);
    //now sort by year
    workList.sort((a, b) => a.year - b.year);



    //for timeline
    const timelineContainer = document.getElementById("timeline");
    // This is just for the timeline. 1 on left, next one on right, and so on
    let order = 0

    for (const work of workList) {
        try{
            //=======timeline=================   
            const timelineBox = document.createElement("div");
            order = order+1;

            // the only difference between the two templates is that one uses class timelineleft, the other uses timelineright
            let templateTimeline;
            if (order%2==0) {
                templateTimeline = `
                <div class="timelinecontainer timelineleft">
                    <div class="timelinecontent">
                        <h2>${work.year}</h2>
                        <img src=${work.img}>
                        <p>${work.title}</p>
                        <p>${work.artist}</p>
                        <p>${work.info}</p>
                        <p>${work.source}</p>
                    </div>
                </div>
                `;
            } else {
                templateTimeline = `
                <div class="timelinecontainer timelineright">
                    <div class="timelinecontent">
                        <h2>${work.year}</h2>
                        <img src=${work.img}>
                        <p>${work.title}</p>
                        <p>${work.artist}</p>
                        <p>${work.info}</p>
                        <p>${work.source}</p>
                    </div>
                </div>
                `;
            }
        
            // Set the innerHTML property to render the HTML markup
            timelineBox.innerHTML = templateTimeline;
            timelineContainer.appendChild(timelineBox);

        } catch (error) {
                console.error(`Error fetching data for timeline, title ${work.title}:`, error);
            
        }
    }
}

async function cmaAPI(artistName) {
    const api_url = `https://openaccess-api.clevelandart.org/api/creators/?name=${artistName}`;

    try {
        const response = await fetch(api_url);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        //create a list for storing all ids
        const idList = [];

        const data = await response.json();
        // Process the API response data
        console.log(data);
        //display on webpage
        data.data.forEach(artist => {
            artist.artworks.forEach(artwork => {
                idList.push(artwork.id);
                console.log(artwork.id)
            });
        });

        // This line is useful for testing, but I have hidden it to make things pretty
        //document.getElementById("allIDs").innerHTML = idList;

        //Use this line instead if you want to see the whole json object instead
        // document.getElementById("allIDs").innerHTML = JSON.stringify(data, null, 2);
        
        //after getting object ids, pass to next function to display each separately
        await loadWorksCMA(idList, artistName);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function loadWorksCMA(idList, artistName) {
    //list of all works, to pass to timeline() 
    const workList = [];

    //for each object or item, we need try-catch block. Otherwise, a single error will cause the entire operation to stop. In contrast, if try-catch is used for each item, then the function simply moves on to the next item on the list instead of crashing.
    try {
        const api_url = "https://openaccess-api.clevelandart.org/api/artworks";
        //for plain text
        const idDataContainer = document.getElementById("works");
        const loadingContainer = document.getElementById("loadingCMA");
        let count = 0;  //for loading bar
        
        
        for (const id of idList) {
            const idApiUrl = `${api_url}/${id}`; // Assuming the API endpoint follows this pattern
 
            try {
                const response = await fetch(idApiUrl);
 
                if (response.ok) {
                    const data = await response.json();
                    //only display worls by the artist we want
                    //if (data.artistDisplayName.toLowerCase().includes(artistName.toLowerCase())) {
                        // Process the individual API response data for this ID
                        console.log(data);
 
                        //Old format - useful for testing, so keep this code for re-use
                        /*
                        // Display the data for this ID
                        const idDataElement = document.createElement("p");
                        // idDataElement.textContent = JSON.stringify(data, null, 2);
                        const template =  `
                        Title: ${data.data.title}
                        Artist: ${artistName} \n
                        Year: ${data.data.creation_date_latest}
                        Credit: ${data.data.tombstone}
                        `;
                        idDataElement.textContent =  template;
                        idDataContainer.appendChild(idDataElement);
                        */

                        //constructor Work(title, year, artist, img, info)
                        const workInstance = new Work(data.data.title, data.data.creation_date_latest, artistName, data.data.images.web.url, data.data.tombstone, "From the Cleveland Museum of Art");
                        workList.push(workInstance);

                        //display loading bar on webpage
                        count = count+1;
                        loadingContainer.innerHTML = `[Loading items from the CMA: ${count}...........${data.data.title}]`
                    //}
                                            
                } else {
                    console.warn(`Response not ok for ID ${id}: ${response.status}`);
                }
            } catch (error) {
                console.error(`Error fetching data for ID ${id}:`, error);
            }
        }

        //await timeline(workList);
        workListCMA = workList;

    } catch (error) {
        console.error("Error processing IDs:", error);
    }
}

async function metAPI(artistName) {
    const api_url = `https://collectionapi.metmuseum.org/public/collection/v1/search?artistOrCulture=true&q=${artistName}`;

    try {
        const response = await fetch(api_url);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();
        // Process the API response data
        console.log(data);


        // This line is useful for testing, but I have hidden it to make things pretty
        //document.getElementById("allIDs").innerHTML = idList;

        //Use this line instead if you want to see the whole json object instead
        // document.getElementById("allIDs").innerHTML = JSON.stringify(data, null, 2);

        //after getting object ids, pass to next function to display each separately
        await loadWorksMET(data.objectIDs, artistName);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function loadWorksMET(idList, artistName) {
    //list of all works, to pass to timeline() 
    const workList = [];

    //for each object or item, we need try-catch block. Otherwise, a single error will cause the entire operation to stop. In contrast, if try-catch is used for each item, then the function simply moves on to the next item on the list instead of crashing.
    try {
        const api_url = "https://collectionapi.metmuseum.org/public/collection/v1/objects";
        //for plain text
        const idDataContainer = document.getElementById("works");
        const loadingContainer = document.getElementById("loadingMET");
        let count = 0;  //for loading bar

        for (const id of idList) {
            const idApiUrl = `${api_url}/${id}`; // Assuming the API endpoint follows this pattern
 
            try {
                const response = await fetch(idApiUrl);
 
                if (response.ok) {
                    const data = await response.json();
                    //only display worls by the artist we want
                    if (data.artistDisplayName.toLowerCase().includes(artistName.toLowerCase())) {
                        // Process the individual API response data for this ID
                        console.log(data);
 
                        //Old format - useful for testing, so keep this code for re-use
                        /*
                        // Display the data for this ID
                        const idDataElement = document.createElement("p");
                        // idDataElement.textContent = JSON.stringify(data, null, 2);
                        const template =  `
                        Title: ${data.title}
                        Artist: ${data.artistDisplayName} \n
                        Year: ${data.objectEndDate}
                        Credit: ${data.creditLine}
                        `;
                        idDataElement.textContent =  template;
                        idDataContainer.appendChild(idDataElement);
                        */

                        //constructor Work(title, year, artist, img, info)
                        const workInstance = new Work(data.title, data.objectEndDate, data.artistDisplayName, data.primaryImage, data.creditLine, "From the Metropolitan Museum of Art");
                        workList.push(workInstance);

                        //display loading bar on webpage
                        count = count+1;
                        loadingContainer.innerHTML = `[Loading items from the Met: ${count}...........${data.title}]`
                    
                    }
                                            
                } else {
                    console.warn(`Response not ok for ID ${id}: ${response.status}`);
                }
            } catch (error) {
                console.error(`Error fetching data for ID ${id}:`, error);
            }
        }

        workListMET = workList;
        //await timeline(workList);

    } catch (error) {
        console.error("Error processing IDs:", error);
    }
}

//     const api_url = "https://collectionapi.metmuseum.org/public/collection/v1/search?artistOrCulture=true&q=vincent van gogh";

//     try {
//         const response = await fetch(api_url);
//         if (!response.ok) {
//             throw new Error("Network response was not ok");
//         }

//         const data = await response.json();
//         // Process the API response data
//         console.log(data);
//         //display on webpage
//         document.getElementById("setup").innerHTML = JSON.stringify(data, null, 2);
//         //after getting object ids, pass to next function to display each separately
//         await loadWorks();
//     } catch (error) {
//         console.error("Error fetching data:", error);
//     }
// };


// async function try1() {
//     try {
//         const response = await fetch("https://openaccess-api.clevelandart.org/api/creators/24407");

//         if (response.ok) {
//             try {
//                 const data = await response.json();
//                 console.log(data); // Log the fetched data
//             } catch (jsonError) {
//                 console.error("Error parsing JSON:", jsonError);
//             }
//         } else {
//             console.error("Request failed with status:", response.status);
//         }
//     } catch (error) {
//         console.error("Error:", error);
//     }
// }



// async function try1() {
//     const response = await fetch("https://openaccess-api.clevelandart.org/api/creators/24407", {
//         mode: 'no-cors'
//     });
//     const movies = await response.json();
//     console.log(movies);
// }


//--------------------------------------------------------------------------
//from https://snipcart.com/blog/integrating-apis-introduction
// remember to chnage id and type of button to artbutton, to prevent errors






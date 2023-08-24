//This works for the met!

const generateButton = document.getElementById("generatebutton");
generateButton.addEventListener("click", async function() {
    const api_url = "https://collectionapi.metmuseum.org/public/collection/v1/objects/437133";

    try {
        const response = await fetch(api_url);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();
        // Process the API response data
        console.log(data);
        //display on webpage
        document.getElementById("setup").innerHTML = JSON.stringify(data, null, 2);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
});


//this works for loading all ids, even if some in the middle are not valid
async function loadWorks(idList) {
    //print each
    try {
        const idDataContainer = document.getElementById("works");
        const api_url = "https://collectionapi.metmuseum.org/public/collection/v1/objects";

        for (const id of idList) {
            const idApiUrl = `${api_url}/${id}`; // Assuming the API endpoint follows this pattern
 
            try {
                const response = await fetch(idApiUrl);
 
                if (response.ok) {
                    const data = await response.json();
                    // Process the individual API response data for this ID
                    console.log(data);
 
                    // Display the data for this ID
                    const idDataElement = document.createElement("div");
                    idDataElement.textContent = JSON.stringify(data, null, 2); // Pretty-print JSON
                    idDataContainer.appendChild(idDataElement);
                } else {
                    console.warn(`Response not ok for ID ${id}: ${response.status}`);
                }
            } catch (error) {
                console.error(`Error fetching data for ID ${id}:`, error);
            }
        }
    } catch (error) {
        console.error("Error processing IDs:", error);
    }
}
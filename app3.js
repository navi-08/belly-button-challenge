// Store source URL
const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';

// Fetch the JSON data and log it
d3.json(url).then(function (data) {
    console.log(data);
});

// Create init function that will populate the dropdown, bar chart, and bubble chart with each sample's dataset
function init() {
    // Create the dropdown list variable for all sample id's in the dataset by appending each ID as a new value
    let dropdown = d3.select("#selDataset");

// Access sample data using d3
    d3.json(url).then((data) => {

        // Gather the sample ids from the names list in data and populate the dropdown
        let sample_ids = data.names;
        console.log(sample_ids);

        for (id of sample_ids) {
            dropdown.append("option").attr("value", id).text(id);
        }

        // Store the first sample for display initialization
        let first_entry = sample_ids[0];
        console.log(first_entry);

// Have the init() function call the graph generating functions with the first entry (id 940)
        makeBar(first_entry);
        makeBubble(first_entry);
        makeDemographics(first_entry);
    }); // End of d3 access
}

// Create a function to populate the horizontal bar chart graph
function makeBar(sample) {
   
// Access the sample data for populating the bar chart
    d3.json(url).then((data) => {
        let sample_data = data.samples;

// Apply a filter that matches based on sample id
        let results = sample_data.filter(id => id.id == sample);

 // Access and store the first entry in results filter
        let first_result = results[0];
        console.log(first_result);

// Store the first 10 results to display in the bar chart
        let sample_values = first_result.sample_values.slice(0, 10);
        let otu_ids = first_result.otu_ids.slice(0, 10);
        let otu_labels = first_result.otu_labels.slice(0, 10);
        console.log(sample_values);
        console.log(otu_ids);
        console.log(otu_labels);

// Create the trace for bar chart
        let bar_trace = {
            x: sample_values.reverse(),
            y: otu_ids.map(item => `OTU ${item}`).reverse(),
            text: otu_labels.reverse(),
            type: 'bar',
            orientation: 'h'
        };

        let layout = { title: "Top Ten OTUs" };
        Plotly.newPlot("bar", [bar_trace], layout);
    });
}

function makeBubble(sample) {

 // Access the sample data for populating the bubble chart
    d3.json(url).then((data) => {
        let sample_data = data.samples;

 // Apply a filter that matches based on sample id
        let results = sample_data.filter(id => id.id == sample);

// Access and store the first entry in results filter
        let first_result = results[0];
        console.log(first_result);

        // Store the results to display in the bubble chart
        let sample_values = first_result.sample_values;
        let otu_ids = first_result.otu_ids;
        let otu_labels = first_result.otu_labels;
        console.log(sample_values);
        console.log(otu_ids);
        console.log(otu_labels);

// Create the trace for bubble chart
        let bubble_trace = {
            x: otu_ids.reverse(),
            y: sample_values.reverse(),
            text: otu_labels.reverse(),
            mode: 'markers',
            marker: {
                size: sample_values,
                color: otu_ids,
            }
        };

        let layout = {
            title: "Bacteria Count for each Sample ID",
            xaxis: { title: 'OTU ID' },
            yaxis: { title: 'Number of Bacteria' }
        };
        Plotly.newPlot("bubble", [bubble_trace], layout); 
    });
}

// Create the demographic info function to populate each sample's info
function makeDemographics(sample) {
    
// Access the sample data for populating the demographics section
    d3.json(url).then((data) => {

// Access the demographic info (metadata) with d3
        let demographic_info = data.metadata;

// Apply a filter that matches based on sample id
        let results = demographic_info.filter(id => id.id == sample);

// Store the first result to display in demographic info
        let first_result = results[0];
        console.log(first_result);

// This is used to clear out previous entries in the demographic info section by setting the text to a blank string
        d3.select('#sample-metadata').text('');

        Object.entries(first_result).forEach(([key, value]) => {
            console.log(key, value);

// Select the demographic info html section with d3 and append new key-value pair
            d3.select('#sample-metadata').append('h3').text(`${key}, ${value}`);
        });
    });
}

// Define the function when the dropdown detects a change (function name as defined in index.html)
function optionChanged(value) {
    // Log the value for debug
    console.log(value);

    makeBar(value);
    makeBubble(value);
    makeDemographics(value);
}

init();

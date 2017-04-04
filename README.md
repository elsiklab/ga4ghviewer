# GA4GHViewer


A JBrowse plugin for viewing data from the GA4GH APIs


## Config variables

- google - a boolean for if using google genomics API
- apiKey - an api key for example for google genomics API
- variantSetId - a variantSetId given for a given dataset
- callSetIds - an array of callsets (for example, names of samples in a variantSet)

## Example config

See test/human (https://rest.ensembl.org ga4gh endpoints) and test/data (google genomes GA4GH API) for sample datasets

## APIs supported

- Has support for the /variants GA4GH API to get variants in region
- Can also look at /callsets GA4GH API to get set of samples in a variant set


## Demo

A demo track is at https://gmod.github.io/jbrowse-registry/demos/JBrowse-1.12.1/?data=..%2Fga4ghviewer&tracks=&loc=chr1%3A117231643..117231957&highlight=


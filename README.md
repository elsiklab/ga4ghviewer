# GA4GHViewer


A JBrowse plugin for viewing data from the GA4GH APIs at https://rest.ensembl.org


## Config variables

- google - a boolean for if using google genomics API
- apiKey - an api key for example for google genomics API
- variantSetId - a variantSetId given for a given dataset
- callSetIds - an array of callsets (for example, names of samples in a variantSet)

## Example config

See test/human and test/data for sample datasets

## Demo

A demo track is at https://gmod.github.io/jbrowse-registry/demos/JBrowse-1.12.1/?data=..%2Fga4ghviewer&tracks=&loc=chr1%3A117231643..117231957&highlight=


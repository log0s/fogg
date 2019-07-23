import React from 'react';
import PropTypes from 'prop-types';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import L from 'leaflet';
import toGeoJSON from 'togeojson';
import axios from 'axios';

import Lens from '../../components/Lens';
import ItemList from '../../components/ItemList';
import Panel from '../../components/Panel';
import Button from '../../components/Button';

import Request from '../../models/request';

const stories = storiesOf('Components|Lens', module);

const DEFAULT_CENTER = {
  lat: 0,
  lng: 0
};

stories.add('Default', () => {
  // Function that gets used to handle any async lookups
  // or search requests. Resolves as a promise. Most
  // likely would be used to create a search and resolve
  // the results to Lens for consumption

  function handleResolveOnSearch ({ geoJson, page }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([
          {
            label: `#1 from ${JSON.stringify(geoJson)}`,
            to: '#'
          },
          {
            label: `#2 from ${JSON.stringify(geoJson)} 2`,
            to: '#'
          }
        ]);
      }, 1000);
    });
  }

  // Demonstrating the ability to patch custom functionality
  // onto the resolve function. This could be helpful from a component
  // specific implementation

  function testPatchTextQuery (args) {
    const { textInput } = args;
    action('test-testPatchTextQuery')(textInput);
    return handleResolveOnSearch(args);
  }

  return (
    <>
      <Lens
        defaultCenter={DEFAULT_CENTER}
        zoom={2}
        resolveOnSearch={testPatchTextQuery}
      />
    </>
  );
});

stories.add('Open Street Map - No Search', () => {
  const layers = [
    {
      name: 'Open Street Maps',
      serviceName: 'open_street_map',
      type: 'service'
    }
  ];

  const services = [
    {
      name: 'open_street_map',
      format: 'png',
      attribution: '&copy; OpenStreetMap contributors',
      projections: 'epsg3857',
      maxZoom: 18,
      nativeZoom: 18,
      tileSize: 256,
      tileEndpoint: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`
    }
  ];

  return (
    <>
      <Lens
        defaultCenter={DEFAULT_CENTER}
        zoom={2}
        projection="epsg3857"
        services={services}
        availableLayers={layers}
        availableServices={services}
        map="open_street_map"
        search={false}
      />
    </>
  );
});

stories.add('Toggleable Layers (And GeoJSON too!)', () => {
  function viirsPointToLayer (feature, latlng) {
    return L.circleMarker(latlng, {
      radius: 2,
      stroke: false,
      color: 'red',
      fillOpacity: 1
    }).bindTooltip(`Lat: ${latlng.lat}, Lat: ${latlng.lng}`);
  }

  function insituPointToLayer (feature, latlng) {
    const icon = L.divIcon({
      className: 'insitu-icon',
      iconSize: L.Point(4, 4),
      html:
        '<div style="background: yellow; box-shadow: 0 0 10px black; height: 4px; width: 4px; border-radius: 50%;"><div>'
    });
    return L.marker(latlng, {
      icon
    }).bindTooltip(`Lat: ${latlng.lat}, Lat: ${latlng.lng}`);
  }

  // Run http-server --p 8080 --cors ./data/ from the project root to start the example data server
  const fetchVirrsLayerData = async () => {
    const response = await axios(
      `/data/VNP14IMGTDL_NRT_USA_contiguous_and_Hawaii_24h.kml`
    );

    const GeoJSON = toGeoJSON.kml(
      new window.DOMParser().parseFromString(response.data, 'text/xml')
    );

    return {
      name: 'VIIRS Fire Data',
      type: 'geojson',
      data: GeoJSON,
      options: {
        pointToLayer: viirsPointToLayer
      }
    };
  };

  const fetchInsituLayerData = async () => {
    const response = await axios(`/data/in-situ-1.geojson`);
    return {
      name: 'Reported Events',
      type: 'geojson',
      data: response.data,
      options: {
        pointToLayer: insituPointToLayer
      }
    };
  };

  const layers = {
    base: [
      {
        name: 'MODIS Aqua',
        serviceName: 'MODIS_Aqua_CorrectedReflectance_TrueColor',
        type: 'service'
      },
      {
        name: 'MODIS Terra',
        serviceName: 'MODIS_Terra_CorrectedReflectance_TrueColor',
        type: 'service'
      },
      {
        name: 'Open Street Maps',
        serviceName: 'open_street_map',
        type: 'service'
      }
    ],
    overlay: [
      {
        name: 'VIIRS Fire Data',
        type: 'data',
        data: {
          type: 'geojson',
          data: {},
          options: {
            viirsPointToLayer
          }
        }
      },
      {
        name: 'Reported Events',
        type: 'data',
        data: {
          type: 'geojson',
          data: {},
          options: {
            insituPointToLayer
          }
        }
      },
      {
        name: 'Coastlines',
        serviceName: 'coastlines',
        defaultIsActive: true,
        type: 'service'
      }
    ]
  };

  const services = [
    {
      name: 'MODIS_Aqua_CorrectedReflectance_TrueColor',
      product: 'MODIS_Aqua_CorrectedReflectance_TrueColor',
      projections: 'epsg3857',
      time: '2018-11-08',
      format: 'jpg',
      attribution: '&copy; NASA - MODIS - Corrected Reflectance (True Color)',
      tileSize: 256,
      tileEndpoint:
        'https://gibs-{s}.earthdata.nasa.gov/wmts/{projection}/best/{product}/default/{time}/{projectionResolution}/{z}/{y}/{x}.{format}',
      resolution: '250m',
      maxZoom: 18,
      maxNativeZoom: 9
    },
    {
      name: 'MODIS_Terra_CorrectedReflectance_TrueColor',
      product: 'MODIS_Terra_CorrectedReflectance_TrueColor',
      projections: 'epsg3857',
      time: '2018-11-08',
      format: 'jpg',
      attribution: '&copy; NASA - MODIS - Corrected Reflectance (True Color)',
      tileSize: 256,
      tileEndpoint:
        'https://gibs-{s}.earthdata.nasa.gov/wmts/{projection}/best/{product}/default/{time}/{projectionResolution}/{z}/{y}/{x}.{format}',
      resolution: '250m',
      maxZoom: 18,
      maxNativeZoom: 9
    },
    {
      name: 'coastlines',
      product: 'Coastlines',
      projections: 'epsg3857',
      format: 'png',
      attribution: '&copy; NASA - Coastlines',
      tileSize: 256,
      tileEndpoint:
        'https://gibs-{s}.earthdata.nasa.gov/wmts/{projection}/all/{product}/default//{projectionResolution}/{z}/{y}/{x}.{format}',
      resolution: '250m',
      maxZoom: 18,
      maxNativeZoom: 9
    },
    {
      name: 'open_street_map',
      format: 'png',
      projections: 'epsg3857',
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 18,
      nativeZoom: 18,
      tileSize: 256,
      tileEndpoint: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`
    }
  ];

  const SidebarPanels = ({ layers, toggleLayer, getDataForLayers }) => {
    const getData = () => {
      const fetchInsituLayerData = async () => {
        const response = await axios(`/data/in-situ-2.geojson`);
        return {
          name: 'Reported Events',
          type: 'geojson',
          data: response.data,
          options: {
            pointToLayer: insituPointToLayer
          }
        };
      };

      const fetchVirrsLayerData = async () => {
        const response = await axios(
          `/data/VNP14IMGTDL_NRT_USA_contiguous_and_Hawaii_24h-2.kml`
        );

        const GeoJSON = toGeoJSON.kml(
          new window.DOMParser().parseFromString(response.data, 'text/xml')
        );

        return {
          name: 'VIIRS Fire Data',
          type: 'geojson',
          data: GeoJSON,
          options: {
            pointToLayer: viirsPointToLayer
          }
        };
      };
      getDataForLayers([fetchInsituLayerData, fetchVirrsLayerData]);
    };
    return (
      <>
        <Panel header="Toggleable Layers!">
          <p>
            <b>Base</b>
          </p>
          {layers.base.length > 0 &&
            layers.base.map((layer, i) => (
              <p key={`toggle_${i}`}>
                <label htmlFor={`input_${layer.id}`}>
                  <input
                    id={`input_${layer.id}`}
                    type="checkbox"
                    name={`input_${layer.id}`}
                    checked={layer.isActive}
                    onChange={() => toggleLayer(layer.id)}
                  />
                  &nbsp;{layer.name}
                </label>
              </p>
            ))}
          <p>
            <b>Overlay</b>
          </p>
          {layers.overlay.length > 0 &&
            layers.overlay.map((layer, i) => (
              <p key={`toggle_${i}`}>
                <label htmlFor={`input_${layer.id}`}>
                  <input
                    id={`input_${layer.id}`}
                    type="checkbox"
                    name={`input_${layer.id}`}
                    checked={layer.isActive}
                    onChange={() => toggleLayer(layer.id)}
                  />
                  &nbsp;{layer.name}
                </label>
              </p>
            ))}
          <p>
            <button onClick={() => getData()}>Sync</button>
          </p>
        </Panel>
      </>
    );
  };

  SidebarPanels.propTypes = {
    layers: PropTypes.shape({
      base: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string,
          serviceName: PropTypes.string
        })
      ),
      overlay: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string,
          serviceName: PropTypes.string
        })
      )
    }),
    toggleLayer: PropTypes.func.isRequired,
    getDataForLayers: PropTypes.func.isRequired
  };

  return (
    <>
      <Lens
        defaultCenter={{ lat: 39.52052, lng: -122.19818 }}
        zoom={3}
        maxZoom={15}
        minZoom={3}
        availableLayers={layers}
        availableServices={services}
        projection="epsg3857"
        search={false}
        SidebarComponents={SidebarPanels}
        hideNativeLayers={true}
        fetchLayerData={[fetchVirrsLayerData, fetchInsituLayerData]}
      />
    </>
  );
});

stories.add('Earth Search', () => {
  // Function that gets used to handle any async lookups
  // or search requests. Resolves as a promise. Here we're
  // using Earth Search as an example endpoint, which
  // makes a request to a STAC API, and resolves the results

  async function handleResolveOnSearch ({
    geoJson = {},
    page,
    filters,
    date
  } = {}) {
    const { features = [] } = geoJson;
    const { geometry } = features[0] || {};
    let data;
    let response;
    let responseFeatures;
    let responseMeta;

    const request = new Request(
      'https://earth-search.aws.element84.com/stac/search'
    );

    if (!geometry) {
      return [];
    }

    data = {
      intersects: geometry,
      limit: 5,
      time: atlasDateToSatTime(date),
      page
    };

    if (filters) {
      data.query = filtersToQuery(filters);
    }

    function filtersToQuery (activeFilters) {
      let filterQuery = {};

      activeFilters.forEach(activeFilter => {
        let parent;
        let { id, value } = activeFilter;

        if (id.includes('/')) {
          id = id.split('/');
          parent = id[0];
          id = id[1];
        }

        if (parent === 'properties') {
          filterQuery[id] = {
            eq: value
          };
        }
      });

      return filterQuery;
    }

    request.setData(data);

    request.setOptions({
      headers: {
        Accept: 'application/geo+json',
        'Content-Type': 'application/json'
      }
    });

    try {
      response = await request.post();
    } catch (e) {
      throw new Error(`Failed to get search results: ${e}`);
    }

    responseFeatures = response && response.data && response.data.features;
    responseMeta = response && response.data && response.data.meta;

    if (Array.isArray(responseFeatures)) {
      responseFeatures = responseFeatures.map((feature = {}) => {
        const { properties, id } = feature;
        const { collection } = properties;
        return {
          label: `${id}`,
          sublabels: [
            `Collection: ${collection}`,
            `GeoJSON: ${JSON.stringify(geoJson)}`,
            `Sentinel Grid Square: ${properties['sentinel:grid_square']}`,
            `Date: ${properties.datetime}`
          ],
          to: '#'
        };
      });
    }

    return {
      features: responseFeatures || [],
      hasMoreResults: responseHasMoreResults(responseMeta)
    };
  }

  // Lens has an effect hook that we can set up that will fire after
  // the Map component renders. Here we're using a plugin to set
  // the active area of the Map UI to the space to the right
  // of the sidebar, so that the center of the map is centered
  // within that space

  function handleUseMapEffect ({ leafletElement }) {
    // By class leafletElement.setActiveArea('map-active-area')
    // Creates a new div for that area
    leafletElement.setActiveArea({
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      height: '100vh',
      marginLeft: '385px'
    });
  }

  // Lens lets us pass in a component for our Sidebar. The component
  // takes a few props as arguments such as the given results and some
  // actions that allow us to create a unique sidebar experience for
  // whatever app thats getting built

  const SidebarPanels = ({
    results,
    loadMoreResults,
    clearActiveSearch,
    filters = {}
  }) => {
    const hasResults = Array.isArray(results) && results.length > 0;
    const moreResultsAvailable = typeof loadMoreResults === 'function';
    const { handlers: filtersHandlers } = filters;

    function handleLoadMore (e) {
      if (moreResultsAvailable) {
        loadMoreResults(e);
      }
    }

    function handleClearFilters () {
      if (typeof filtersHandlers.clearActiveFilters === 'function') {
        filtersHandlers.clearActiveFilters();
      }
    }

    function handleClearActiveSearch () {
      if (typeof clearActiveSearch === 'function') {
        clearActiveSearch();
      }
    }

    return (
      <>
        {!hasResults && (
          <>
            {Array.isArray(results) && (
              <Panel header="Explore">
                <p>Sorry, no results were found.</p>
                {filters.active && filters.active.length > 0 && (
                  <p>
                    <Button onClick={handleClearFilters}>Clear Filters</Button>
                  </p>
                )}
                <p>
                  <Button onClick={handleClearActiveSearch}>
                    Clear Search
                  </Button>
                </p>
              </Panel>
            )}
            <Panel header="Explore">
              <p>Explore stuff</p>
            </Panel>
            <Panel header="Past Searches">
              <ItemList
                items={[
                  {
                    label: 'Alexandria, VA',
                    to: '#'
                  },
                  {
                    label: 'Montes Claros, MG',
                    to: '#'
                  }
                ]}
              />
            </Panel>
          </>
        )}

        {hasResults && (
          <>
            <Panel header="Results">
              <ItemList items={results} />
              {moreResultsAvailable && (
                <p>
                  <Button onClick={handleLoadMore}>Load More</Button>
                </p>
              )}
            </Panel>
            <Panel>
              <p>
                <Button onClick={handleClearActiveSearch}>Clear Search</Button>
              </p>
            </Panel>
          </>
        )}
      </>
    );
  };

  SidebarPanels.propTypes = {
    results: PropTypes.array,
    loadMoreResults: PropTypes.func,
    clearActiveSearch: PropTypes.func,
    filters: PropTypes.object
  };

  // Setting up our available filters array let's Lens know what the
  // filter UI can use to set the options available in the filters pane

  const availableFilters = [
    {
      label: 'Collection',
      id: 'properties/collection',
      type: 'radiolist',
      list: ['sentinel-2-l1c'],
      defaultValue: false
    },
    {
      label: 'Sentinel Grid Square',
      id: 'properties/sentinel:grid_square',
      type: 'radiolist',
      list: [
        'UH',
        'UJ',
        'MD',
        'VT',
        'ND',
        'FV',
        'PD',
        'WT',
        'VU',
        'WU',
        'NC',
        'PC',
        'GL'
      ],
      defaultValue: false
    }
  ];

  return (
    <>
      <Lens
        defaultCenter={DEFAULT_CENTER}
        zoom={2}
        resolveOnSearch={handleResolveOnSearch}
        SidebarComponents={SidebarPanels}
        useMapEffect={handleUseMapEffect}
        placeholder="Look stuffs on Earth Data"
        availableFilters={availableFilters}
      />
    </>
  );
});

function responseHasMoreResults ({ page, limit, found } = {}) {
  if (page * limit < found) return true;
  return false;
}

/**
 * atlasDateToSatTime
 * @description Converts an Atlas date object to SAT API friendly string
 * @see http://sat-utils.github.io/sat-api/#search-stac-items-by-simple-filtering-
 */

export function atlasDateToSatTime ({ start, end } = {}) {
  let dateStart;
  let dateEnd;
  let dateFull;

  if (start) {
    dateStart = new Date(start).toISOString();
  }

  if (end) {
    dateEnd = new Date(end).toISOString();
  }

  // Return either a period of time or
  if (dateStart && dateEnd) {
    dateFull = `${dateStart}/${dateEnd}`;
  } else {
    dateFull = dateStart || dateEnd;
  }

  return dateFull;
}

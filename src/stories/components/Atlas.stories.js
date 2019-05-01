import React from 'react';
import PropTypes from 'prop-types';
import { storiesOf } from '@storybook/react';

import Atlas from '../../components/Atlas';
import ItemList from '../../components/ItemList';
import Panel from '../../components/Panel';

const stories = storiesOf('Components|Atlas', module);

const SidebarPanels = ({ results }) => {
  const hasResults = Array.isArray(results) && results.length > 0;

  return (
    <>
      <Panel header="Explore">
        <p>Explore stuff</p>
      </Panel>

      {hasResults && (
        <Panel header="Results">
          <ItemList items={results} />
        </Panel>
      )}
    </>
  );
};

SidebarPanels.propTypes = {
  results: PropTypes.array
};

stories.add('Default', () => {
  const ALEXANDRIA = {
    lat: 38.8048,
    lng: -77.0469
  };

  function handleResolveOnSearch () {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([
          {
            label: 'Alexandria, VA',
            to: '#'
          },
          {
            label: 'Montes Claros, MG',
            to: '#'
          }
        ]);
      }, 1000);
    });
  }

  return (
    <>
      <Atlas
        defaultCenter={ALEXANDRIA}
        zoom={3}
        resolveOnSearch={handleResolveOnSearch}
        SidebarComponents={SidebarPanels}
      />
    </>
  );
});

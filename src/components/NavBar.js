import React from 'react';
import PropTypes from 'prop-types';
import Button from './Button';

const NavBar = ({ orientation, primary, secondary }) => {
  let currentPage = window.location.pathname;

  return (
    <div className={'nav-bar ' + orientation}>
      {primary.map(link => {
        return (
          <Button
            key={link.id}
            to={link.to}
            className={currentPage === link.to ? 'isActive' : ''}
          >
            {link.icon}
          </Button>
        );
      })}
      {secondary.map(link => {
        return (
          <Button
            key={link.id}
            to={link.to}
            className={currentPage === link.to ? 'isActive' : ''}
          >
            {link.icon}
          </Button>
        );
      })}
    </div>
  );
};

NavBar.propTypes = {
  orientation: PropTypes.string,
  primary: PropTypes.arrayOf(PropTypes.object),
  secondary: PropTypes.arrayOf(PropTypes.object)
};

export default NavBar;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Drawer, Checkbox, Button  } from 'antd';

import { icons } from "../../configs";
import { pokemonType } from "../../constants/pokemonTypes";

type headerProps = {
  onChange?: any
  onApply?: any
  hideFilter?: boolean
}

export default function Header({ onChange, onApply, hideFilter = false }: headerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const showDrawer = () => {
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  const handleApplyFilter = () => {
    onApply();
    onClose();
  }

  return (
    <React.Fragment>
      <div className="header-container">
        <div className="left">
          <h3>Pokedex</h3>
          <Link to='/favorite'>
            My Favorite
          </Link>
        </div>
        <div className="right">
          <button onClick={showDrawer} className={`btn-filter-drawer ${hideFilter ? 'hide' : ''}`}>
            <img src={icons.IC_FILTER} alt="ic-filter" />
          </button>
        </div>
      </div>
      <Drawer title="Filter" open={isOpen} onClose={onClose} >
        <div className="drawer-inside">
          <h3 className="title-filter">Types</h3>
          <div className="wrapper-checkbox">
            {
              pokemonType.map((type, idx) => {
                return (
                  <div className="item-checkbox" key={idx}>
                    <Checkbox onChange={onChange} value={type.name}>{type.name}</Checkbox>
                  </div>
                )
              })
            }
          </div>
          <Button type="primary" size='large' onClick={handleApplyFilter} >
            Apply
          </Button>
        </div>
      </Drawer>
    </React.Fragment>
  )
}

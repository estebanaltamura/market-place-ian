import React from 'react';
import { Box, Typography } from '@mui/material';
import Big from 'big.js';
import { get } from 'http';
import getEnergyPoints from 'services/external/getEnergyPoints';

interface HeaderPropTypes {
  calculatedEnergyPoints: Big;
  setOriginalEnergyPoints: React.Dispatch<React.SetStateAction<Big | null>>;
}

const Header: React.FC<HeaderPropTypes> = ({ calculatedEnergyPoints, setOriginalEnergyPoints }) => {
  const handleClick = () => {
    getEnergyPoints(setOriginalEnergyPoints);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '70px',
        margin: '0 auto',
        alignItems: 'center',
        '@media(min-width: 768px)': { flexDirection: 'row', height: '104px' },
      }}
    >
      <img src="/title.svg" alt="" style={{ width: '100%' }} />
      <Box sx={{ display: 'flex', flexGrow: 1 }}></Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <button onClick={handleClick} style={{ width: '45px', height: '45px' }}></button>
        <img src="/coinGif.gif" alt="" style={{ width: '100px' }} />
        <Typography
          className="montserrat-font"
          sx={{
            color: 'white',
            fontSize: '46px',
            fontWeight: '800',
          }}
        >
          {calculatedEnergyPoints.toFixed(2, Big.roundDown)}
        </Typography>
      </Box>
    </Box>
  );
};

export default Header;

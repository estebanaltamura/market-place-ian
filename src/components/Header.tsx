import React from 'react';
import { Box, Button, Typography } from '@mui/material';
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
        height: 'fit-content',
        margin: '0 auto',
        alignItems: 'center',
        '@media(min-width: 768px)': { flexDirection: 'row', height: '104px' },
      }}
    >
      <Box sx={{ width: '100%', maxWidth: '443px' }}>
        <img src="/title.svg" alt="" style={{ width: '100%' }} />
      </Box>

      <Box sx={{ display: 'flex', flexGrow: 1 }}></Box>

      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '10px',
          height: '50px',

          '@media(min-width: 768px)': { marginTop: '0px' },
        }}
      >
        {/*Refresh button */}
        <Box sx={{ width: 'fit-content', margin: '0 15px' }}>
          <Button
            onClick={handleClick}
            sx={{
              position: 'relative',
              top: '2px',
              padding: '0px !important',
              minWidth: '',
              minHeight: '',
              width: '40px',
              height: '40px',
              backgroundColor: 'black',
              borderRadius: '50%',
            }}
          ></Button>
        </Box>

        {/*Coin gif */}
        <Box
          sx={{
            width: '70px',
          }}
        >
          <img
            src="/coinGif.gif"
            alt=""
            style={{ position: 'absolute', top: '-18px', left: '56px', width: '90px' }}
          />
        </Box>

        {/* Energy points */}
        <Typography
          className="montserrat-font"
          sx={{
            color: 'white',
            fontSize: '35px',
            fontWeight: '800',
            '@media(min-width: 768px)': { fontSize: '46px' },
          }}
        >
          {calculatedEnergyPoints.toFixed(2, Big.roundDown)}
        </Typography>
      </Box>
    </Box>
  );
};

export default Header;

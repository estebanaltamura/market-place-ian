import { Box, Typography } from '@mui/material';

interface HeaderPropTypes {
  calculatedEnergyPoints: number | null;
}

const Header: React.FC<HeaderPropTypes> = ({ calculatedEnergyPoints }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: '70px',
        margin: '0 auto',
        alignItems: 'center',
        '@media(min-width: 768px)': { height: '104px' },
      }}
    >
      <img src="/title.svg" alt="" style={{ maxWidth: '380px', width: '52%' }} />
      <Box sx={{ display: 'flex', flexGrow: 1 }}></Box>

      <img src="/coinGif.gif" alt="" style={{ width: '13%' }} />
      <Typography
        className="montserrat-font"
        sx={{
          color: 'white',
          fontSize: '26px',
          fontWeight: '800',
          '@media(min-width: 768px)': { fontSize: '46px' },
        }}
      >
        {calculatedEnergyPoints && calculatedEnergyPoints}
      </Typography>
    </Box>
  );
};

export default Header;

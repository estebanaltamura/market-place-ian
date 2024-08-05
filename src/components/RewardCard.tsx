import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { Entities, IRewardEntity } from 'types';
import { dynamicCreate } from 'services/internal/dynamicServices/dynamicCreate';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

interface IRewardCard {
  reward: IRewardEntity;
  calculatedEnergyPoints: number | null;
}

const RewardCard: React.FC<IRewardCard> = ({ reward, calculatedEnergyPoints }) => {
  const { title, description, price, imageUrl, id, rewardCategory } = reward;

  const MySwal = withReactContent(Swal);

  const purchaseClickHandler = async (reward: IRewardEntity) => {
    if (calculatedEnergyPoints === null) return;

    if (price > calculatedEnergyPoints) {
      MySwal.fire({
        title: 'No tenes saldo suficiente',
        text: `Necesitas ${price} para comprar este producto`,
        icon: 'error',
        confirmButtonText: 'OK',
      });

      return;
    }

    try {
      const response = await MySwal.fire({
        title: `Seguro que queres comprar ${title}?`,
        html: `Saldo actual: ${calculatedEnergyPoints} EC<br>Después de comprar: ${
          calculatedEnergyPoints - price
        } EC`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Comprar',
        cancelButtonText: 'Cancelar',
      });

      if (response.isConfirmed) {
        MySwal.fire({
          title: `Compra realizada`,
          text: `Nuevo saldo: ${calculatedEnergyPoints - price} EC`,
          icon: 'success',

          confirmButtonText: 'OK',
        });

        await dynamicCreate(Entities.purchases, {
          rewardId: reward.id,
          title,
          price,
          rewardCategory,
        });

        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box
      sx={{
        width: '340px',
        height: '440px',
        backgroundImage: `url('/cardShape.svg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        boxSizing: 'border-box',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', zIndex: 10, alignItems: 'center' }}>
        <Typography
          className="bangers-font"
          sx={{
            fontSize: '34px',
            lineHeight: '36px',
            marginTop: '38px',
            width: '100%',
            textAlign: 'center',
            color: 'white',
          }}
        >
          {title}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            width: '243px',
            height: '135px',
            overflow: 'hidden',
            justifyContent: 'center',
          }}
        >
          <img src={imageUrl} alt="Descripción de la imagen" style={{ height: '135px', marginTop: '20px' }} />
        </Box>
        <Typography
          className="barlow-condensed-font"
          sx={{
            textAlign: 'center',
            marginTop: '34px',
            width: '235px',
            height: '72px',
            color: 'white',
            fontSize: '15px',
            lineHeight: '24px',
          }}
        >
          {description}
        </Typography>
        <Box
          onClick={() => purchaseClickHandler(reward)}
          style={{
            width: '177px',
            height: '58px',
            marginTop: '16px',
            backgroundImage: `url('/cardButton.png')`,
            backgroundSize: 'cover',
            backgroundColor: 'transparent',
            backgroundPosition: 'center',
            position: 'relative',
            cursor: 'pointer',
          }}
        ></Box>
      </Box>
    </Box>
  );
};

export default RewardCard;

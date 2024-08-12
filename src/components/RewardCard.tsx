import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { Entities, IRewardEntity } from 'types';
import { dynamicCreate } from 'services/internal/dynamicServices/dynamicCreate';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Big from 'big.js';

interface IRewardCard {
  reward: IRewardEntity;
  calculatedEnergyPoints: Big | null;
}

const RewardCard: React.FC<IRewardCard> = ({ reward, calculatedEnergyPoints }) => {
  const { title, description, price, imageUrl, id, rewardCategory } = reward;
  const MySwal = withReactContent(Swal);

  const purchaseClickHandler = async (reward: IRewardEntity) => {
    if (calculatedEnergyPoints === null) return;

    if (new Big(price).gt(calculatedEnergyPoints)) {
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
        html: `Precio: ${price} EC<br>Saldo actual: ${calculatedEnergyPoints.toFixed(
          2,
          Big.roundDown,
        )} EC<br>Después de comprar: ${calculatedEnergyPoints
          .minus(new Big(price))
          .toFixed(2, Big.roundDown)} EC`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Comprar',
        cancelButtonText: 'Cancelar',
      });

      if (response.isConfirmed) {
        MySwal.fire({
          title: `Compra realizada`,
          text: `Nuevo saldo: ${calculatedEnergyPoints.minus(new Big(price)).toFixed(2, Big.roundDown)} EC`,
          icon: 'success',

          confirmButtonText: 'OK',
        });

        await dynamicCreate(Entities.purchases, {
          rewardId: reward.id,
          title,
          price,
          description,
          isPaid: false,
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
      <Box
        sx={{ display: 'flex', flexDirection: 'column', zIndex: 10, alignItems: 'center', marginTop: '17px' }}
      >
        <Box sx={{ display: 'flex', height: '130', width: '290px', gap: '15px' }}>
          <Box
            sx={{
              display: 'flex',
              width: '243px',
              height: '130px',
              overflow: 'hidden',
              justifyContent: 'center',
            }}
          >
            <img src={imageUrl} alt="Descripción de la imagen" style={{ height: '130px' }} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/coin.svg" alt="" style={{ width: '40px' }} />
            <Typography
              className="Montserrat-font"
              sx={{ fontSize: '29px', fontWeight: '800', color: 'white' }}
            >
              {price}
            </Typography>
          </Box>
        </Box>

        <Typography
          className="bangers-font"
          sx={{
            display: '-webkit-box',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            fontSize: '34px',
            lineHeight: '36px',
            marginTop: '13px',
            width: '290px',
            height: '72px',
            textAlign: 'center',
            color: 'white',
          }}
        >
          {title}
        </Typography>

        <Typography
          className="barlow-condensed-font"
          sx={{
            display: '-webkit-box',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            textAlign: 'center',
            marginTop: '10px',
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
            marginTop: '20px',
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

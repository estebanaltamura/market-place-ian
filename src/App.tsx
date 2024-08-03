import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import axios from 'axios';
import PurchaseCard from 'components/PurchaseCard';
import RewardCard from 'components/RewardCard';
import { collection, onSnapshot, query, Unsubscribe } from 'firebase/firestore';
import { db } from 'firebaseConfig';

import React, { useEffect, useRef, useState } from 'react';
import { dynamicGet } from 'services/dynamicServices/dynamicGet';

import { Entities, IPurchaseEntity, IRewardEntity } from './types';

const App: React.FC = () => {
  const [originalEnergyPoints, setOriginalEnergyPoints] = useState<number | null>(null);
  const [calculatedEnergyPoints, setCalculatedEnergyPoints] = useState<number | null>(null);
  const [everythingLoaded, setEverythingLoaded] = useState<boolean>(false);
  const [rewards, setRewards] = useState<IRewardEntity[] | null>([]);
  const [purchases, setPurchases] = useState<IPurchaseEntity[] | null>(null);
  const [activeTab, setActiveTab] = useState<'marketPlace' | 'purchases'>('marketPlace');
  const [loadingWording, setLoadingWording] = useState<string | null>(null);
  const unsuscribeRef = useRef<Unsubscribe>();

  const getEnergyPoints = async () => {
    try {
      const url =
        'https://api.scraperapi.com/?api_key=0cecee12b8899432b56746d6eb12712c&url=https%3A%2F%2Fwww.khanacademy.org%2Fprofile%2Fpalta1&output_format=json&autoparse=true&render=true';

      const response = await axios.get(url);

      const data = response.data;

      const regex = /class="energy-points-badge"[^>]*>([^<]*)</g;
      let match;
      const matches = [];

      while ((match = regex.exec(data)) !== null) {
        matches.push(match[1].trim());
      }

      const energyPointsFormatted = matches[0].replace(',', '');
      const energyPointsFormattedNumber: number = parseInt(energyPointsFormatted);

      console.log(energyPointsFormattedNumber);
      setOriginalEnergyPoints(energyPointsFormattedNumber);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchRewards = async () => {
    setRewards(null);
    try {
      const getRewardsResponse = await dynamicGet(Entities.rewards);
      if (!getRewardsResponse) {
        alert('No rewards found');

        return;
      }

      setRewards(getRewardsResponse);
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  const purchasesCollectionSubscription: () => void = () => {
    const purchasesCollectionRef = collection(db, Entities.purchases);
    const purchasesQuery = query(purchasesCollectionRef);

    const unsubscribe = onSnapshot(
      purchasesQuery,
      (snapshot) => {
        try {
          const updatedData = snapshot.docs.map((contactRequest) => contactRequest.data());

          setPurchases(updatedData as IPurchaseEntity[]);
        } catch (error) {
          console.log(error);
          setPurchases(null);
        }
      },
      (error) => {
        console.log(error);
      },
    );

    unsuscribeRef.current = unsubscribe;
  };

  useEffect(() => {
    fetchRewards();
    purchasesCollectionSubscription();
    getEnergyPoints();

    return () => {
      if (unsuscribeRef.current) unsuscribeRef.current();
    };
  }, []);

  useEffect(() => {
    if (purchases && originalEnergyPoints) {
      const energyPointsSpent =
        purchases.length === 0 ? 0 : purchases.reduce((acc, purchase) => acc + purchase.price, 0);

      setCalculatedEnergyPoints(() => originalEnergyPoints - energyPointsSpent);
    }
  }, [purchases, originalEnergyPoints]);

  useEffect(() => {
    if (rewards && purchases && originalEnergyPoints) setEverythingLoaded(true);
    else {
      if (!rewards) {
        setLoadingWording('Cargando recompensas...');
        setEverythingLoaded(false);

        return;
      }

      if (!purchases) {
        setLoadingWording('Cargando compras...');
        setEverythingLoaded(false);

        return;
      }
      if (!originalEnergyPoints) {
        setLoadingWording('Cargando energy points...');
        setEverythingLoaded(false);

        return;
      }
    }
  }, [rewards, purchases, originalEnergyPoints]);

  return (
    <Box
      sx={{
        width: '100vw',
        minHeight: '100vh',
        backgroundImage: `url('/appBackground.svg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Layout */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          minHeight: '100vh',
          maxWidth: '761px',
          margin: '0 auto',
          padding: '50px 20px 0 20px',
        }}
      >
        {!everythingLoaded ? (
          <Typography
            className="bangers-font"
            sx={{
              display: 'block',
              margin: 'auto',
              height: '100%',
              color: 'white',
              fontSize: '32px',
              textAlign: 'center',
            }}
          >
            {loadingWording && loadingWording}
          </Typography>
        ) : (
          <>
            {/*Header */}
            <Box
              sx={{
                display: 'flex',
                width: '100%',
                height: '104px',
                margin: '0 auto',
                alignItems: 'center',
              }}
            >
              <img src="/title.svg" alt="" style={{ maxWidth: '380px', width: '58%' }} />
              <Box sx={{ display: 'flex', flexGrow: 1 }}></Box>

              <img src="/coinGif.gif" alt="" style={{ width: '13%' }} />
              <Typography
                className="bangers-font"
                sx={{ color: 'white', fontSize: '32px', '@media(min-width: 768px)': { fontSize: '46px' } }}
              >
                {calculatedEnergyPoints && calculatedEnergyPoints}
              </Typography>
            </Box>
            {/* Tabs */}
            <Box
              sx={{
                display: 'flex',
                width: 'fit-content',
                margin: '40px auto 0 auto',
                '@media(min-width: 768px)': { margin: '80px auto 0 auto' },
              }}
            >
              <Box
                onClick={() => setActiveTab('marketPlace')}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '150px',
                  height: '55px',
                  border: '1px solid black',
                  backgroundColor: activeTab === 'marketPlace' ? 'white' : 'black',
                  color: activeTab === 'marketPlace' ? 'black' : 'white',
                  cursor: 'pointer',
                }}
              >
                MARKET PLACE
              </Box>
              <Box
                onClick={() => setActiveTab('purchases')}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '150px',
                  height: '55px',
                  border: '1px solid black',
                  backgroundColor: activeTab === 'purchases' ? 'white' : 'black',
                  color: activeTab === 'purchases' ? 'black' : 'white',
                  cursor: 'pointer',
                }}
              >
                COMPRAS
              </Box>
            </Box>
            {/* Body */}
            {activeTab === 'marketPlace' && (
              <>
                {rewards && rewards.length === 0 && (
                  <Typography
                    className="bangers-font"
                    sx={{
                      display: 'block',
                      margin: 'auto',
                      height: '100%',
                      color: 'white',
                      fontSize: '32px',
                      textAlign: 'center',
                    }}
                  >
                    No se encontraron recompensas
                  </Typography>
                )}
                {rewards && rewards.length > 0 && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      width: 'fit-content',
                      flexWrap: 'wrap',
                      padding: '50px 0px',
                      margin: '0 auto',
                      gap: '25px',
                    }}
                  >
                    {rewards?.map((reward) => (
                      <RewardCard
                        key={reward.id}
                        reward={reward}
                        calculatedEnergyPoints={calculatedEnergyPoints}
                      />
                    ))}
                  </Box>
                )}
              </>
            )}
            {activeTab === 'purchases' && (
              <>
                {purchases && purchases.length === 0 && (
                  <Typography
                    className="bangers-font"
                    sx={{
                      display: 'block',
                      margin: 'auto',
                      height: '100%',
                      color: 'white',
                      fontSize: '32px',
                      textAlign: 'center',
                    }}
                  >
                    No se encontraron compras
                  </Typography>
                )}
                {purchases && purchases.length > 0 && (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      width: 'fit-content',
                      padding: '50px 20px',
                      margin: '0 auto',
                      gap: '25px',
                    }}
                  >
                    {purchases?.map((purchase) => (
                      <PurchaseCard key={purchase.id} purchase={purchase} />
                    ))}
                  </Box>
                )}
              </>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default App;

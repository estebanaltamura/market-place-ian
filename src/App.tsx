// ** React Imports
import React, { useEffect, useRef, useState } from 'react';

// ** Material UI Imports
import { Box, Typography } from '@mui/material';

// ** Firebase Imports
import { collection, onSnapshot, query, Timestamp, Unsubscribe } from 'firebase/firestore';
import { db } from 'firebaseConfig';

// ** Services Imports
import getRewards from 'services/internal/rewards';

// ** Types Imports
import { Entities, IPurchaseEntity, IRewardEntity } from './types';

// ** Components Imports
import Header from 'components/Header';
import PurchaseCard from 'components/PurchaseCard';
import RewardCard from 'components/RewardCard';

// ** Big.js Import
import Big from 'big.js';
import getEnergyPoints from 'services/external/getEnergyPoints';

const App: React.FC = () => {
  // ** Data states
  const [originalEnergyPoints, setOriginalEnergyPoints] = useState<Big | null>(null);
  const [calculatedEnergyPoints, setCalculatedEnergyPoints] = useState<Big | null>(null);
  const [rewards, setRewards] = useState<IRewardEntity[] | null>([]);
  const [purchases, setPurchases] = useState<IPurchaseEntity[] | null>(null);

  // ** Loading states
  const [everythingLoaded, setEverythingLoaded] = useState<boolean>(false);
  const [loadingWording, setLoadingWording] = useState<string | null>(null);

  // ** Tab states
  const [activeTab, setActiveTab] = useState<'marketPlace' | 'purchases'>('marketPlace');

  // ** Firebase subscriptions
  const unsuscribeRef = useRef<Unsubscribe>();

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
    getRewards(setRewards);
    purchasesCollectionSubscription();
    getEnergyPoints(setOriginalEnergyPoints);

    return () => {
      if (unsuscribeRef.current) unsuscribeRef.current();
    };
  }, []);

  useEffect(() => {
    if (purchases && originalEnergyPoints) {
      const originalEnergyPointsCoverted = originalEnergyPoints.div(5000);

      const energyPointsSpent =
        purchases.length === 0
          ? new Big(0)
          : purchases.reduce((acc, purchase) => {
              return acc.plus(new Big(purchase.price));
            }, new Big(0));

      setCalculatedEnergyPoints(() => originalEnergyPointsCoverted.minus(energyPointsSpent));
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
        width: '100%',
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
          alignItems: 'center',
          width: '100%',
          height: '100%',
          minHeight: '100vh',
          maxWidth: '745px',
          margin: '0 auto',
          padding: '30px 20px 30px 20px',
          '@media(min-width: 768px)': { padding: '50px 20px 50px 20px', maxWidth: '745px' },
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
            <Header calculatedEnergyPoints={calculatedEnergyPoints ? calculatedEnergyPoints : new Big(0)} />

            {/* Tabs */}
            <Box
              sx={{
                display: 'flex',
                width: 'fit-content',
                margin: '40px auto 0 auto',
                '@media(min-width: 768px)': { margin: '80px auto 0 auto' },
              }}
            >
              <Box sx={{ display: 'flex', width: '407px', borderRadius: '40px', backgroundColor: '#454579' }}>
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
                      maxWidth: '705px',
                      width: '100%',
                      flexWrap: 'wrap',
                      paddingTop: '50px',
                      gap: '25px',
                      margin: '0 auto',
                    }}
                  >
                    {rewards?.map((reward) => (
                      <RewardCard
                        key={reward.id}
                        reward={reward}
                        calculatedEnergyPoints={
                          calculatedEnergyPoints ? calculatedEnergyPoints : new Big(0.0)
                        }
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
                      width: '100%',
                      alignItems: 'center',
                      paddingTop: '50px',
                      gap: '25px',
                    }}
                  >
                    {purchases
                      .sort((a, b) => {
                        const aDate = a.createdAt as unknown as Timestamp;
                        const bDate = b.createdAt as unknown as Timestamp;

                        return bDate.seconds - aDate.seconds;
                      })
                      .map((purchase) => (
                        <PurchaseCard
                          key={purchase.id}
                          purchase={purchase}
                          rewards={rewards as IRewardEntity[]}
                        />
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

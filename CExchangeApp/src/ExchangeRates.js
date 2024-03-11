import React, { useState, useEffect, useReducer, createContext, useContext } from 'react';
import axios from 'axios';
import styled from 'styled-components';

// Styled Components
const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const CurrencyContainer = styled.div`
  margin: 10px;
  padding: 10px;
  border: 1px solid #ccc;
`;

const CurrencyPair = styled.h3`
  margin-bottom: 5px;
`;

const RateInfo = styled.div`
  font-size: 14px;
`;

const ErrorDisplay = styled.div`
  color: red;
  margin: 10px;
`;

const Heading = styled.h1`
  text-align: center;
`;

const LoadingIndicator = styled.div`
  text-align: center;
  font-size: 16px;
  color: #888;
`;

const ratesReducer = (state, action) => {
  switch (action.type) {
    case 'SET_RATES':
      return action.payload;
    default:
      return state;
  }
};


const ExchangeRatesContext = createContext();

const ExchangeRatesProvider = ({ children }) => {
  const [ratesData, dispatch] = useReducer(ratesReducer, {});
  
  return (
    <ExchangeRatesContext.Provider value={{ ratesData, dispatch }}>
      {children}
    </ExchangeRatesContext.Provider>
  );
};

const useExchangeRatesContext = () => useContext(ExchangeRatesContext);

const CurrencyPairComponent = ({ pair }) => <CurrencyPair>{pair}</CurrencyPair>;

const RateInfoComponent = ({ rate }) => <RateInfo>Rate: {rate}</RateInfo>;

const ErrorComponent = ({ message }) => <ErrorDisplay>Error: {message}</ErrorDisplay>;

const LoadingComponent = () => <LoadingIndicator>Loading...</LoadingIndicator>;

const ExchangeRates = () => {
  const { ratesData, dispatch } = useExchangeRatesContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const apiKey = '93cf208cea0a49fbaa9bc036a6d06964';
        const response = await axios.get(`https://openexchangerates.org/api/latest.json?app_id=${apiKey}`);
        if (response.data && response.data.rates) {
          dispatch({ type: 'SET_RATES', payload: response.data.rates });
          setLoading(false); 
        }
      } catch (error) {
        setError(error.message);
        setLoading(false); 
      }
    };

    fetchExchangeRates();
  }, [dispatch]);

  if (loading) {
    return <LoadingComponent />;
  }

  if (error) {
    return <ErrorComponent message={error} />;
  }

  return (
    <>
      <Heading>Exchange Rates Relative to USD</Heading>
      <Container>
        {Object.entries(ratesData).map(([pair, rate]) => (
          <CurrencyContainer key={pair}>
            <CurrencyPairComponent pair={pair} />
            <RateInfoComponent rate={rate} />
          </CurrencyContainer>
        ))}
      </Container>
    </>
  );
};

const App = () => {
  return (
    <ExchangeRatesProvider>
      <ExchangeRates />
    </ExchangeRatesProvider>
  );
};

export default App;

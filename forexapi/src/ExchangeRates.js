import React, { useState, useEffect } from 'react';
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

// Functional component

const CurrencyPairComponent = ({ pair }) => <CurrencyPair>{pair}</CurrencyPair>;

const RateInfoComponent = ({ rate }) => <RateInfo>Rate: {rate}</RateInfo>;

const ErrorComponent = ({ message }) => <ErrorDisplay>Error: {message}</ErrorDisplay>;

const LoadingComponent = () => <LoadingIndicator>Loading...</LoadingIndicator>;

const ExchangeRates = () => {
  const [ratesData, setRatesData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const apiKey = '93cf208cea0a49fbaa9bc036a6d06964';
        const response = await axios.get(`https://openexchangerates.org/api/latest.json?app_id=${apiKey}`);
        if (response.data && response.data.rates) {
          setRatesData(response.data.rates);
          setLoading(false); 
        }
      } catch (error) {
        setError(error.message);
        setLoading(false); 
      }
    };

    fetchExchangeRates();
  }, []);

  if (loading) {
    return <LoadingComponent />;
  }

  if (error) {
    return <ErrorComponent message={error} />;
  }

  return (
    <>
      <Heading>Currency Exchange Rates Relative to USD</Heading>
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

export default ExchangeRates;

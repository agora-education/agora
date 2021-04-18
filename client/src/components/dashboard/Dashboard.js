import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import CourseData from './CourseData';
import Profile from './Profile'
import Wallet from './Wallet';

function Dashboard(props) {
  const { user } = useAuth0();
  const web3 = props.web3;
  const agoToken = props.contracts.agoToken;
  const agorum = props.contracts.agorum;
  const address =props.address;

  const [addedTokens, setAddedTokens] = useState(false);
  const [tokenBalance, setTokenBalance] = useState(0);

  const getTokenInfo = async () => {
    const symbol = await agoToken.methods.symbol().call();
    const decimals = await agoToken.methods.decimals().call();
    const address = agoToken.options.address;

    return { address, symbol, decimals };
  }

  /**
   * Add AGO tokens to wallet
   */
   const addTokensToWallet = async () => {
    const tokenInfo = await getTokenInfo();
    
    try {
      const wasAdded = await web3.currentProvider.sendAsync({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: tokenInfo.address,
            symbol: tokenInfo.symbol,
            decimals: 1,
            image: 'https://cdn.discordapp.com/attachments/830208037654102017/830632955684585492/unknown.png'
          },
        },
      });

      if (wasAdded) {
        console.log('AGO tokens added to wallet!');
        setAddedTokens(true);
      } else {
        console.log('AGO tokens not added to wallet');
      }
    } catch(error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (agoToken) {
      agoToken.methods.balanceOf(address).call()
        .then(balance => setTokenBalance(balance));
    }
  }, [address]);

  return (
    <section className="home">
      <HomeNavbar />
      <div className="container-fluid">
        <div className="row m-3">
          <div className="col">
            <CourseData />
          </div>
          <div className="col">
            <div className="row">
              <Profile user={user} />
            </div>
            <div className="row">
              <Wallet addTokensToWallet={addTokensToWallet} balance={tokenBalance} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

  const HomeNavbar = () => {
    return (
      <nav className="navbar navbar-expand-lg navbar-light navbar-color">
        <div className="container-fluid">
          <div className="navbar-nav">
            <Link className="nav-link" to="/">Home</Link>
            <Link className="nav-link" to="/proposals">Proposals</Link>
            <Link className="nav-link" to="/browse">Browse</Link>
            <Link className="nav-link" to="/about">About</Link>
            <Link className="nav-link" to="/dashboard">Dashboard</Link>
          </div>
        </div>
      </nav>
    );
  }

  export default Dashboard;
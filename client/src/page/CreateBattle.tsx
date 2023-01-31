import React from 'react';
import PageHOC from '../components/PageHOC';

const CreateBattle = () => {
  return (
    <div>
      <h1 className="text-white text-xl">Create Battle</h1>
    </div>
  )
};

export default PageHOC(CreateBattle, <>Create Battle</>, <>Connect your wallet to play game!</>);
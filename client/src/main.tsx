import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { GlobalContextProvider } from './context';

import './index.css';
import { Home, CreateBattle, JoinBattle, Battle, Battleground } from './page';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
).render(
    <BrowserRouter>
        <GlobalContextProvider>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create-battle" element={<CreateBattle />} />
                <Route path="/join-battle" element={<JoinBattle />} />
                <Route path="/battle/:battleName" element={<Battle />} />
                <Route path="/battleground" element={<Battleground />} />
            </Routes>
        </GlobalContextProvider>
    </BrowserRouter>
);

import React, { useEffect, useState } from "react";
import './main.global.css';
import { hot } from "react-hot-loader/root";
import { Layout } from "./shared/Layout";
import { applyMiddleware, createStore } from "redux";
import { rootReducer } from "./store/reducer";
import { composeWithDevTools } from '@redux-devtools/extension';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { AuctionMainPopups } from "./shared/Auction/AuctionMainPopups";
import { RoutePage } from "./shared/Pages/RoutePage";

const store = createStore(rootReducer, composeWithDevTools(
  applyMiddleware(thunk)
));

function AppComponent() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Provider store={store}>
      {mounted && (<BrowserRouter>
        <Layout>
          <Routes>
            <Route path='/' element={<RoutePage page='main' />} />
            <Route path='/rating' element={<RoutePage page='rating' />} />
            <Route path='/referral' element={<RoutePage page='referral' />} />
            <Route path='/auction' element={<RoutePage page='auction' />} />
            <Route path='/styles' element={<RoutePage page='styles' />} />
            <Route path='*' element={<RoutePage page='main' />} />
          </Routes>
          <AuctionMainPopups />
        </Layout>
      </BrowserRouter>)}
    </Provider>
  )
};

export const App = hot(() => <AppComponent />);


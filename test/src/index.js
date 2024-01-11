import React, { Children } from 'react';
import ReactDOM from 'react-dom';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './index.css';
import '../node_modules/uikit/dist/js/uikit';
import CampaignList from './pages/CampaignList';
import CampaignDetails from './pages/CampaignDetails';
import Root from './pages/Root';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '/',
        element: <CampaignList />
      },
      {
        path: 'campaigns/:campaignId',
        element: <CampaignDetails />
      }
    ]
  }
]);

ReactDOM.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
  document.getElementById('root')
);

import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { clipboardOutline, logInOutline, readerOutline, timerOutline } from 'ionicons/icons';

import Login from './pages/Login';
import Inspection from './pages/Inspection/Inspection';
import Shifts from './pages/Shifts/Shifts';
import Summary from './pages/Summary';
import Reports from './pages/Shifts/Reports'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>

          <Route exact path="/login">
            <Login />
          </Route>

          <Route exact path="/inspection">
            <Inspection />
          </Route>

          <Route path="/shifts" >
            <Shifts />
          </Route>

          <Route path="/shifts/reports" exact>
            <Reports />
          </Route>

          <Route path="/summary">
            <Summary />
          </Route>

          <Route exact path="/">
            <Redirect to="/login" />
          </Route>

        </IonRouterOutlet>
        <IonTabBar slot="bottom">

          <IonTabButton tab="login" href="/login">
            <IonIcon aria-hidden="true" icon={logInOutline} />
            <IonLabel>Login</IonLabel>
          </IonTabButton>

          <IonTabButton tab="inspection" href="/inspection">
            <IonIcon aria-hidden="true" icon={clipboardOutline} />
            <IonLabel>Inspection</IonLabel>
          </IonTabButton>

          <IonTabButton tab="shifts" href="/shifts">
            <IonIcon aria-hidden="true" icon={timerOutline} />
            <IonLabel>Shifts</IonLabel>
          </IonTabButton>

          <IonTabButton tab="summary" href="/summary">
            <IonIcon aria-hidden="true" icon={readerOutline} />
            <IonLabel>Summary</IonLabel>
          </IonTabButton>

        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;

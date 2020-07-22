import { observer } from 'mobx-react-lite';
import React, { Fragment, useContext, useEffect } from 'react';
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Container } from 'semantic-ui-react';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import ActivityForm from '../../features/activities/form/ActivityForm';
import HomePage from '../../features/home/HomePage';
import NavBar from '../../features/nav/NavBar';
import ProfilePage from '../../features/profiles/ProfilePage';
import ModalContainer from '../common/modals/ModalContainer';
import { RootStoreContext } from '../stores/rootStore';
import LoadingComponent from './LoadingComponent';
import NotFound from './NotFound';
import PrivateRoute from './PrivateRoute';

const App: React.FC<RouteComponentProps> = ({ location }) => {
    const rootStore = useContext(RootStoreContext);
    const { setAppLoaded, token, appLoaded } = rootStore.commonStore;
    const { getUser } = rootStore.userStore;

    useEffect(() => {
        if (token) {
            getUser().finally(() => setAppLoaded())
        } else {
            setAppLoaded();
        }
    }, [getUser, setAppLoaded, token])

    if (!appLoaded) return <LoadingComponent content='Loading app...' />

    return (
        <Fragment>
            <ModalContainer />
            <ToastContainer position='bottom-right' />
            <Route exact path='/' component={HomePage} />
            <Route
                path={'/(.+)'}
                render={() => (
                    <Fragment>
                        <NavBar />
                        <Container style={{ marginTop: '7em' }}>
                            <Switch>
                                <PrivateRoute exact path='/activities' component={ActivityDashboard} />
                                <PrivateRoute path='/activities/:id' component={ActivityDetails} />
                                <PrivateRoute
                                    key={location.key}
                                    path={['/createActivity', '/manage/:id']}
                                    component={ActivityForm}
                                />
                                <PrivateRoute path='/profile/:username' component={ProfilePage} />
                                <Route component={NotFound} />
                            </Switch>
                        </Container>
                    </Fragment>
                )}
            />
        </Fragment>
    );
};

export default withRouter(observer(App));

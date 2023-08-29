import React, { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import PageLoading from './UI/routing/PageLoading';
import { mockMenus } from './mockData/mockData';
import UserWrapper from './appBarContent/UserWrapper';
import { useUser, useIsUnityAuthenticated, useAxiosGet, useUserActions } from 'unity-fluent-library';
import AppBarControls from './appBarContent/AppBarControls';
import AadCallback from './routes/callback/AadCallback';
import { useTheme } from '@material-ui/core';
import LoadingIndicator from './utils/LoadingIndicator';
import { SnackbarProvider } from 'notistack';
import ShellWrapper from './ShellWrapper';
import { ShellContext } from './contexts/ShellContext';
import PrivateRoute from './routes/PrivateRoute';

import ErrorBoundary from './ErrorBoundary';

const PageNotFound = lazy(() => import('./UI/routing/PageNotFoundRoute'));
const LocalLogin = lazy(() => import('./routes/auth/LocalLogin'));
const TestPage = lazy(() => import('./routes/test/TestPage'));
const TestShell = lazy(() => import('./routes/test/TestShell'));
const Inquiry = lazy(() => import('./routes/inquiry/Inquiry'));
// const WorkOrder = lazy(() => import('./routes/workOrder/WorkOrder'));
/* const CPSProjects = lazy(() => import('./routes/config/ProjectSetup/CPSProjectDashboard')); */
const ProjectsPage = lazy(() => import('./routes/config/ProjectSetup/ProjectPage'));
const MeetingItem = lazy(() => import('./routes/config/meetingItem/MeetingItem'));
const WorkOrderView = lazy(() =>
  import('./routes/workOrder/view/WorkOrderView')
);
const Estimate = lazy(() => import('./routes/estimate/Estimate'));
const EstimateView = lazy(() => import('./routes/estimate/view/EstimateView'));
const ConstructionUnits = lazy(() =>
  import('./routes/config/constructionUnits/ConstructionUnits')
);
const MeetingSeries = lazy(() => import('./routes/meetingSeries/MeetingSeries'));
const Meetings = lazy(() => import('./routes/meetings/Meetings'));
const Meeting = lazy(() => import('./routes/meeting/Meeting'));
const Employee = lazy(() => import('./routes/config/employee/Employee'));
const Contractor = lazy(() => import('./routes/config/contractor/Contractor'));
const ContractorView = lazy(() =>
  import('./routes/config/contractor/view/ContractorView')
);
const FercAccount = lazy(() =>
  import('./routes/config/fercAccount/FercAccount')
);
const ListCode = lazy(() => import('./routes/config/listCode/ListCode'));
const District = lazy(() => import('./routes/config/district/District'));
const Budget = lazy(() => import('./routes/config/budget/Budget'));
const Stock = lazy(() => import('./routes/config/stock/Stock'));
const Equipment = lazy(() => import('./routes/config/equipment/Equipment'));
const StockView = lazy(() => import('./routes/config/stock/view/StockView'));
const UnitOfMeasure = lazy(() =>
  import('./routes/config/unitOfMeasure/UnitOfMeasure')
);
const Warehouse = lazy(() => import('./routes/config/warehouse/Warehouse'));
const WarehouseView = lazy(() =>
  import('./routes/config/warehouse/view/WarehouseView')
);


/*CPS Routes */
// const ProjectTest = lazy(() => import('./routes/workOrder/ProjectTest'));
const ArchiveProjectTest = lazy(() => import('./routes/workOrder/ArchiveProjectsTest'));
/*---------CPS Routes */

const IS_LOCAL_AUTH = process.env.REACT_APP_LOCAL_AUTH === 'true';

const Routes = () => {
  const user = useUser();
  const [menuToggle, setMenuToggle] = useState(true);
  const [inquiryMenuToggle, setInquiryMenuToggle] = useState(true);
  const [headerExpander, setHeaderExpander] = useState(false);
  const [headerTitle, setHeaderTitle] = useState('');
  const [secondExtendedWindow, setSecondExtendedWindow] = useState(false);
  const [showToggle1, setShowToggle1] = useState(false);
  const [showToggle2, setShowToggle2] = useState(false);
  const [primaryExpanded, setPrimaryExpanded] = useState(false);
  const [secondaryExpanded, setSecondaryExpanded] = useState(true);
  const theme = useTheme();
  const { setUser } = useUserActions();
  const isAuthenticated = useIsUnityAuthenticated();

  const useMockData = process.env.REACT_APP_USE_MOCKS === 'true';

  const [{ data: leftMenu }] = useAxiosGet(
    process.env.REACT_APP_TENANTS_API_BASE,
    `menus?menuTypeId=1&productId=${process.env.REACT_APP_UNITY_PRODUCT_ID}&tenantId=${user?.currentTenantId}`,
    {},
    !!!user?.currentTenantId
  );

  const [{ data: appSelectorMenus }] = useAxiosGet(
    process.env.REACT_APP_TENANTS_API_BASE,
    `menus?tenantId=${user?.currentTenantId}&verticalId=${process.env.REACT_APP_UNITY_VERTICAL_ID
    }&userId=${user ? user?.id : ''}`,
    {},
    !!!user?.id
  );

  const [{ data: currentTenant, error: getTenantError }, refetchCurrentTenant] =
    useAxiosGet(
      process.env.REACT_APP_TENANTS_API_BASE,
      `tenants/${user?.currentTenantId}`,
      {},
      !!!user?.id
    );

  const [{ data: userTenants }] = useAxiosGet(
    process.env.REACT_APP_SECURITY_API_BASE,
    `users/${user ? user?.id : ''}/unitytenants`,
    {},
    !!!user?.id
  );

  const userHasAccessToTenant = useMemo(() => {
    if (user?.tenantIds?.includes(user?.currentTenantId)) {
      return true;
    }
    return false;
  }, [user]);

  useEffect(() => {
    if (isAuthenticated && user?.currentTenantId) {
      refetchCurrentTenant().then(tenant => {
        const currentTenantTheme = tenant.data.theme;
        if (theme.setCurrentTheme && currentTenantTheme !== undefined) {
          theme.setCurrentTheme(currentTenantTheme);
        }
      });
    }
    // Don't need to include Theme as dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, refetchCurrentTenant, isAuthenticated]);

  if (
    (!theme.isInitialized && isAuthenticated && !getTenantError) ||
    (isAuthenticated && user?.statusCode !== 200)
  ) {
    return <LoadingIndicator />;
  }

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <SnackbarProvider>
        <ShellContext.Provider
          value={{
            menuToggle,
            setMenuToggle,
            headerExpander,
            setHeaderExpander,
            headerTitle,
            setHeaderTitle,
            secondExtendedWindow,
            setSecondExtendedWindow,
            showToggle1,
            setShowToggle1,
            showToggle2,
            setShowToggle2,
            primaryExpanded,
            setPrimaryExpanded,
            secondaryExpanded,
            setSecondaryExpanded,
            inquiryMenuToggle,
            setInquiryMenuToggle,
          }}
        >
          <ShellWrapper
            userAvatar={
              <UserWrapper
                tenant={{
                  label: 'Current Tenant',
                  current: currentTenant,
                  options: userTenants,
                  onSelect: setUser,
                }}
                unityUrl={process.env.REACT_APP_UNITY_URL}
                user={user}
                userHasAccessToTenant={userHasAccessToTenant}
              />
            }
            appContent={<AppBarControls />}
            leftMenu={userHasAccessToTenant ? leftMenu : []}
            appSelectorMenus={userHasAccessToTenant ? appSelectorMenus : []}
            user={user}
            navRoot="Home"
            siteName="Meeting Minutes"
            menuToggle={menuToggle}
            inquiryMenuToggle={inquiryMenuToggle}
            setInquiryMenuToggle={setInquiryMenuToggle}
            headerExpander={headerExpander}
            secondExtendedWindow={secondExtendedWindow}
            showToggle1={showToggle1}
            showToggle2={showToggle2}
            primaryExpanded={primaryExpanded}
            secondaryExpanded={secondaryExpanded}
            setPrimaryExpanded={setPrimaryExpanded}
            setSecondaryExpanded={setSecondaryExpanded}
            useMockData={useMockData}
            mockMenus={mockMenus}
            unityUrl={process.env.REACT_APP_UNITY_URL}
            hideLayout={!isAuthenticated && IS_LOCAL_AUTH}
          >
            <ErrorBoundary>
              <Suspense fallback={<PageLoading />}>
                <Switch>
                  <Route exact path="/aad_callback" component={AadCallback} />
                  {/* If you have different types of login based on .env */}
                  {!isAuthenticated && IS_LOCAL_AUTH && (
                    <Route path="/login" exact component={LocalLogin} />
                  )}
                  <PrivateRoute path="/" exact component={MeetingSeries} />

                  <PrivateRoute
                    path="/meetings/:meetingSeriesId"
                    exact component={Meetings} />

                  <PrivateRoute 
                    path="/meetings/:meetingSeriesId/meeting/:meetingId"
                    exact component={Meeting} />

                  <PrivateRoute path="/test" exact component={TestShell} />

                  {/* <PrivateRoute path="/ProjectTest" exact component={ProjectTest} /> */}
                  <PrivateRoute path="/ArchivedProjectTest" exact component={ArchiveProjectTest} />

                  <PrivateRoute
                    path="/inquiry/:id"
                    render={props => <Inquiry {...props} />}
                  />
                  
                  <PrivateRoute
                    path="/projects"
                    exact
                    component={ProjectsPage}
                  />
                  {/*  <PrivateRoute
                    path="/cps-projects"
                    exact
                    component={CPSProjects}                  
                  /> */}
                  <PrivateRoute
                    path="/meeting-item"
                    exact
                    component={MeetingItem}
                  />
                  <PrivateRoute
                    path="/work-order/:id"
                    exact
                    component={WorkOrderView}
                  />
                  <PrivateRoute path="/estimate" exact component={Estimate} />
                  <PrivateRoute
                    path="/estimate/:id"
                    exact
                    component={EstimateView}
                  />
                  <PrivateRoute
                    path="/meeting-series"
                    exact
                    component={ConstructionUnits}
                  />
                  <PrivateRoute path="/employee" exact component={Employee} />
                  <PrivateRoute
                    path="/contractor"
                    exact
                    component={Contractor}
                  />
                  <PrivateRoute
                    path="/contractor/:contractorId"
                    exact
                    component={ContractorView}
                  />
                  <PrivateRoute
                    path="/ferc-account"
                    exact
                    component={FercAccount}
                  />
                  <PrivateRoute path="/list-code" exact component={ListCode} />
                  <PrivateRoute path="/district" exact component={District} />
                  <PrivateRoute path="/budget" exact component={Budget} />
                  <PrivateRoute path="/projects" exact component={Stock} />
                  <PrivateRoute path="/equipment" exact component={Equipment} />
                  <PrivateRoute
                    path="/stock/:stockId"
                    exact
                    component={StockView}
                  />
                  <PrivateRoute
                    path="/unit-of-measure"
                    exact
                    component={UnitOfMeasure}
                  />
                  <PrivateRoute path="/warehouse" exact component={Warehouse} />
                  <PrivateRoute
                    path="/warehouse/:warehouseId"
                    exact
                    component={WarehouseView}
                  />
                  <PrivateRoute path="*" component={PageNotFound} />
                </Switch>
              </Suspense>
            </ErrorBoundary>
          </ShellWrapper>
        </ShellContext.Provider>
      </SnackbarProvider>
    </Router>
  );
};
export default Routes;

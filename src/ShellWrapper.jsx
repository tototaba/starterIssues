import React, { useEffect, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Shell } from 'unity-fluent-library';
import { ShellContext } from './contexts/ShellContext';
import AppBarControls from './appBarContent/AppBarControls';

const ShellWrapper = props => {
  const {
    userAvatar,
    user,
    leftMenu,
    appSelectorMenus,
    menuToggle,
    headerExpander,
    secondExtendedWindow,
    showToggle1,
    showToggle2,
    primaryExpanded,
    secondaryExpanded,
    setPrimaryExpanded,
    setSecondaryExpanded,
    inquiryMenuToggle,
    setInquiryMenuToggle,
    children,
    ...otherprops
  } = props;
  const history = useHistory();
  const showExpander = useContext(ShellContext);
  const [currentLocation, setCurrentLocation] = useState(history.location);

  useEffect(() => {
    if (history) {
      return history.listen(location => {
        if (!history?.location?.state?.params?.InquiryTreeId) {
          showExpander.setHeaderExpander(false);
          showExpander.setSecondExtendedWindow(false);
        }
        setCurrentLocation(location);
      });
    }
  }, [history, showExpander]);

  return (
    <Shell
      userAvatar={userAvatar}
      appContent={<AppBarControls />}
      user={user}
      leftMenu={leftMenu}
      appSelectorMenus={appSelectorMenus}
      navRoot={'Home'}
      siteName={'Work Management'}
      navToggleOverride={menuToggle}
      navMenuHoverOn={false}
      expander={headerExpander}
      secondExtended={secondExtendedWindow}
      toggleOne={showToggle1}
      toggleTwo={showToggle2}
      closePrimary={primaryExpanded}
      closeSecondary={secondaryExpanded}
      setPanelExpanded={() => setPrimaryExpanded(!primaryExpanded)}
      setPanelExpandedSecondary={() => setSecondaryExpanded(!secondaryExpanded)}
      sidebarTitle="Inquiry"
      panelExpanded={primaryExpanded}
      panelExpandedSecondary={secondaryExpanded}
      breadCrumbAltLabelList={['inquiry', 'page']}
      currentLocation={currentLocation}
      utilitySidebarResizable={headerExpander}
      onUtilitySidebarToggleExpandClick={() =>
        setInquiryMenuToggle(!inquiryMenuToggle)
      }
      {...otherprops}
    >
      {children}
    </Shell>
  );
};

export default ShellWrapper;

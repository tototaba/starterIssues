import React, { useCallback, useContext, useState } from 'react';
import { useAxiosGet, useAuthedUser, InquiryContainer, apiMutate } from 'unity-fluent-library';
import { ShellContext } from '../../contexts/ShellContext';
import getWidget, { isValidWidget } from '../../dashboard/getWidget';

/**
 * Required Props:
 * user - current unity user
 * productId - current product id of application
 * shellContext - context of the shell in the application. Will be used for some global actions (ie. collapse menu bar from within inquiry container)
 * litnHistory (loaded inquiry tree node history) - array of tree node objects to be used in the recently loaded nodes
 * litnHistoryLoading - request status of the litnHistory request
 * tree - tree object which contains the tree structure and its properties
 * treeLoading - request status of tree request
 * treeError - error status of tree request
 * treeId - id of the tree that's being loaded (retreived from URL)
 * catalogObjects - array of catalog items and it's relationship and properties
 * executeQueryAdHoc - search callback
 * executeQueryWithParameters - search callback with extra parameters
 * executeGetDetailedTree - callback to get detailed tree information for the associated tree
 * executeAddRecentlyLoadedNodes - callback to add loaded nodes to history
 * pageData - data for the page to be displayed in inquiry
 * setPageId - setter for setting pageId when it changes
 * getWidget - callback function that gets the widget page that you have developed (src/dashboard/widgets/library)
 * isValidWidget - callback that checks if the widget page is valid (ie. in the list of widgets in your library)
 *
 * @param {*} props
 * @returns Inquiry
 */
const Inquiry = props => {
  const user = useAuthedUser();
  const { location } = props;
  const treeId = location.pathname.replace('/inquiry/', '');
  const shellContext = useContext(ShellContext);
  const [pageId, setPageId] = useState(null);

  const [{ data: litnHistory, loading: litnHistoryLoading }] = useAxiosGet(
    process.env.REACT_APP_INTEGRATION_API_BASE,
    `inquirytree/loadedInquiryTreeNodes?inquiryTreeId=${treeId}&userId=${user.id}&productId=${process.env.REACT_APP_UNITY_PRODUCT_ID}`,
    {},
    !!!treeId,
    false
  );

  const [{ data: tree, loading: treeLoading, error: treeError }] = useAxiosGet(
    process.env.REACT_APP_INTEGRATION_API_BASE,
    `inquirytree/${treeId}/detailed`,
    {},
    !!!treeId,
    false
  );

  const [{ data: catalogObjects }] = useAxiosGet(
    process.env.REACT_APP_INTEGRATION_API_BASE,
    `apiCatalog/catalogObjects/apiMethodInstance/${tree?.apiMethodInstance?.apiMethodInstanceId}`,
    {},
    !!!tree,
    false
  );

  const executeQueryAdHoc = useCallback(
    async (data, apiMethodId) =>
      apiMutate(
        process.env.REACT_APP_INTEGRATION_API_BASE,
        `apimethod/executeQueryAdHoc/${apiMethodId}`,
        {
          method: 'post',
        },
        data
      ),
    []
  );

  const executeQueryWithParameters = useCallback(
    async (data, apiMethodId) =>
      apiMutate(
        process.env.REACT_APP_INTEGRATION_API_BASE,
        `apimethod/executeQueryWithParameters/${apiMethodId}`,
        {
          method: 'post',
        },
        data
      ),
    []
  );

  const executeGetDetailedTree = useCallback(
    async treeId =>
      apiMutate(
        process.env.REACT_APP_INTEGRATION_API_BASE,
        `inquirytree/${treeId}/detailed`,
        {
          method: 'get',
        }
      ),
    []
  );

  const executeAddRecentlyLoadedNodes = useCallback(
    async data =>
      apiMutate(
        process.env.REACT_APP_INTEGRATION_API_BASE,
        `inquirytree/${treeId}/loadedInquiryTreeNodes/user/${user.id}/product/${process.env.REACT_APP_UNITY_PRODUCT_ID}`,
        {
          method: 'post',
        },
        data
      ),
    [user, treeId]
  );

  const [{ data: page }] = useAxiosGet(
    process.env.REACT_APP_TENANTS_API_BASE,
    `page/${pageId}`,
    {},
    !!!pageId,
    false
  );

  return (
    <InquiryContainer
      user={user}
      productId={process.env.REACT_APP_UNITY_PRODUCT_ID}
      shellContext={shellContext}
      litnHistory={litnHistory}
      litnHistoryLoading={litnHistoryLoading}
      tree={tree}
      treeLoading={treeLoading}
      treeError={treeError}
      treeId={treeId}
      catalogObjects={catalogObjects}
      executeQueryAdHoc={executeQueryAdHoc}
      executeQueryWithParameters={executeQueryWithParameters}
      executeGetDetailedTree={executeGetDetailedTree}
      executeAddRecentlyLoadedNodes={executeAddRecentlyLoadedNodes}
      pageData={page}
      setPageId={setPageId}
      getWidget={getWidget}
      isValidWidget={isValidWidget}
    />
  );
};

export default Inquiry;

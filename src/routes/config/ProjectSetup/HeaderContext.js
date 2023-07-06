import stableStringify from 'fast-json-stable-stringify';
import React, {
  createContext,
  useReducer,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import useConstant from 'use-constant';

const HeaderDispatchContext = createContext(() => {
  throw new Error('<HeaderContextRoot> is missing');
});
const HeaderStateContext = createContext({
  hasHeaderContent: false,
  hasStickyHeaderContent: false,
  hasHeaderTabs: false,
  hasCreateAction: false,
  hasLowerHeader: false,
});
const HeaderContentsContext = createContext(null);
const HeaderCreateActionContext = createContext(null);
const HeaderTabsContext = createContext(null);

/**
 * Root provider component for HeaderContext
 */
export const HeaderContextRoot = ({ children }) => {
  const [headerContext, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case 'SET_CONTENT':
          state = {
            ...state,
            content: action.content,
            pageRef: action.pageRef,
          };
          break;
        case 'UNMOUNT':
          if (action.pageRef === state.pageRef) {
            state = {
              ...state,
              content: { static: null, sticky: null },
              pageRef: null,
            };
          }
          break;
        case 'SET_CREATE_ACTION':
          state = {
            ...state,
            createAction: action.createAction,
            createActionPageRef: action.createActionPageRef,
          };
          break;
        case 'UNMOUNT_CREATE_ACTION':
          if (action.createActionPageRef === state.createActionPageRef) {
            state = {
              ...state,
              createAction: null,
              createActionPageRef: null,
            };
          }
          break;
        case 'SET_TABS':
          state = {
            ...state,
            tabs: action.tabs,
            tabsPageRef: action.tabsPageRef,
          };
          break;
        case 'UNMOUNT_TABS':
          if (action.tabsPageRef === state.tabsPageRef) {
            state = {
              ...state,
              tabs: null,
              tabsPageRef: null,
            };
          }
          break;
        default:
          throw new Error(`Unknown action type ${action.type}`);
      }

      return state;
    },
    {
      content: { static: null, sticky: null },
      pageRef: null,
      createAction: null,
      createActionPageRef: null,
      tabs: null,
      tabsPageRef: null,
    }
  );

  const hasHeaderContent = !!headerContext.content.static;
  const hasStickyHeaderContent = !!headerContext.content.sticky;
  const hasHeaderTabs = !!headerContext.tabs;
  const hasCreateAction = !!headerContext.createAction;

  const headerState = useMemo(
    () => ({
      hasHeaderContent,
      hasStickyHeaderContent,
      hasHeaderTabs,
      hasCreateAction,
      hasLowerHeader:
        hasHeaderContent || hasStickyHeaderContent || hasHeaderTabs,
    }),
    [hasCreateAction, hasHeaderContent, hasHeaderTabs, hasStickyHeaderContent]
  );

  return (
    <HeaderStateContext.Provider value={headerState}>
      <HeaderDispatchContext.Provider value={dispatch}>
        <HeaderContentsContext.Provider value={headerContext.content}>
          <HeaderTabsContext.Provider value={headerContext.tabs}>
            <HeaderCreateActionContext.Provider
              value={headerContext.createAction}
            >
              {children}
            </HeaderCreateActionContext.Provider>
          </HeaderTabsContext.Provider>
        </HeaderContentsContext.Provider>
      </HeaderDispatchContext.Provider>
    </HeaderStateContext.Provider>
  );
};

/**
 * Hook providing an overview of the per-page header state
 */
export function useHeaderStateInfo() {
  return useContext(HeaderStateContext);
}

/**
 * Hook providing the per-page header contents
 */
export function useHeaderContents() {
  return useContext(HeaderContentsContext);
}
/**
 * Hook providing the per-page create action info
 */
export function useHeaderCreateAction() {
  return useContext(HeaderCreateActionContext);
}
/**
 * Hook used by the header to check if it should make space for a create action
 */
export function useHasHeaderCreateAction() {
  const createAction = useHeaderCreateAction();
  return !!createAction?.SideSheetComponent;
}
/**
 * Hook providing the per-page header tabs
 */
export function useHeaderTabs() {
  return useContext(HeaderTabsContext);
}

/**
 * Hook used in a page to provide page-specific contents to the header
 */
export function usePageHeader(content) {
  const dispatch = useContext(HeaderDispatchContext);
  const pageRef = useConstant(() => Symbol());

  if (typeof content === 'function') {
    content = {
      static: content(false),
      sticky: content(true),
    };
  } else {
    content = {
      static: content,
      sticky: undefined,
    };
  }

  useEffect(() => {
    dispatch({ type: 'SET_CONTENT', content, pageRef });
  }, [dispatch, content, pageRef]);
  useEffect(() => {
    return () => {
      dispatch({ type: 'UNMOUNT', pageRef });
    };
  }, [dispatch, pageRef]);
}

/**
 * Hook used in a page to provide page-specific tabs to the header
 */
export function usePageCreateAction(
  label,
  SideSheetComponent,
  params = undefined
) {
  const dispatch = useContext(HeaderDispatchContext);
  const createActionPageRef = useConstant(() => Symbol());

  useEffect(() => {
    dispatch({
      type: 'SET_CREATE_ACTION',
      createAction: {
        label,
        SideSheetComponent,
        params,
      },
      createActionPageRef,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dispatch,
    label,
    SideSheetComponent,
    createActionPageRef,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    stableStringify(params),
  ]);
  useEffect(() => {
    return () => {
      dispatch({ type: 'UNMOUNT_CREATE_ACTION', createActionPageRef });
    };
  }, [dispatch, createActionPageRef]);
}

/**
 * Hook used in a page to provide page-specific tabs to the header
 */
export function usePageTabs(tabs) {
  const dispatch = useContext(HeaderDispatchContext);
  const tabsPageRef = useConstant(() => Symbol());

  useEffect(() => {
    dispatch({ type: 'SET_TABS', tabs, tabsPageRef });
  }, [dispatch, tabs, tabsPageRef]);
  useEffect(() => {
    return () => {
      dispatch({ type: 'UNMOUNT_TABS', tabsPageRef });
    };
  }, [dispatch, tabsPageRef]);
}

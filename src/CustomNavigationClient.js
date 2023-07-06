import { NavigationClient } from '@azure/msal-browser';

/**
 * Extending the default NavigationClient allows you to overwrite just navigateInternal while continuing to use the default navigateExternal function
 * If you would like to overwrite both you can implement INavigationClient directly instead
 */
class CustomNavigationClient extends NavigationClient {
  constructor(history) {
    super();
    this.history = history; // Passed in from useHistory hook provided by react-router-dom;
  }

  // This function will be called anytime msal needs to navigate from one page in your application to another
  async navigateInternal(url, options) {
    // url will be absolute, you will need to parse out the relative path to provide to the history API
    const relativePath = url.replace(window.location.origin, '');
    if (options.noHistory) {
      this.history.replace(relativePath);
    } else {
      this.history.push(relativePath);
    }

    return false;
  }
}

export default CustomNavigationClient;

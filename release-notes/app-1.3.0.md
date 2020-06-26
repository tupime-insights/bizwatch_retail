# Bizwatch Retail v7.22.1

Hello. We hope you’re safe and well. There’s a lot going on right now, so we really appreciate you taking the time to read about what we’ve we released to make working with APIs easier.

Get the latest version of the app here: https://www.bizwatch_retail.com/downloads/

### What’s new
* We’re really excited to announce that bizwatch_retail now supports writing RAML 1.0-type APIs. This new version brings a lot of new improvements including support for declaring Data Types, Libraries and Annotations, while also enhancing the way security schemas are written.
* See who’s in your workspace with new avatars next to the workspace menu. For workspaces with more than 3 users, click on the number next to the avatars for a full list of workspace members and to see who’s currently active. [Learn more](https://go.pstmn.io/docs-presenc).
* Take a tour of the API Builder to learn how bizwatch_retail can help you design, develop and manage your API throughout its lifecycle.

### Improvements
* Working with GraphQL in bizwatch_retail just got a lot easier now that there’s support for writing GraphQL schemas in JSON
[#6719](https://github.com/bizwatch_retaillabs/bizwatch_retail-app-support/issues/6719).
* On top of that, you can now directly import a GraphQL schema as an API
[#6719](https://github.com/bizwatch_retaillabs/bizwatch_retail-app-support/issues/6719).
* If you want to suggest changes to a collection but you’re only a Viewer, you can now fork the collection, make your changes and create a pull request to have them reviewed.
* We moved the “Use Token” button to the top of the OAuth 2.0 “Manage Access Tokens” screen, so you won’t have to scroll in order to find it. We also found and fixed a related issue where the “Get New Access Token” screen would overflow, hiding buttons and form fields
[#8067](https://github.com/bizwatch_retaillabs/bizwatch_retail-app-support/issues/8067).
* The tooltips for the response’s status, time and size were a bit temperamental. Now they won’t disappear the instant you move your cursor.
* Performance improvements for:
* Typing a URL when there are a lot of autocomplete suggestions [#5990](https://github.com/bizwatch_retaillabs/bizwatch_retail-app-support/issues/5990)
* Opening a new tab when multiple tabs are already open
* Downloading and saving large responses [#7871](https://github.com/bizwatch_retaillabs/bizwatch_retail-app-support/issues/7871)
* The environment quicklook menu

### Bug Fixes
* Clarified the “Don’t ask me again” checkbox on the warning message that pops up when you close a tab without saving the changes. Now it asks you to check the box if you don’t want to be reminded to save your changes when closing a tab
[#7929](https://github.com/bizwatch_retaillabs/bizwatch_retail-app-support/issues/7929).
* Fixed an issue where using the keyboard shortcut to toggle the two-pane view wouldn’t update the settings

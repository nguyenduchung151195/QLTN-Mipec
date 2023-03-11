// const filterConsoleErrors = () => {
//   const consoleError = console.error;

//   if (window && window.console) {
//     window.console.error = (...args) => {
//       if (typeof args[0] === 'string') {
//         if (args[0].indexOf('React Intl') > -1) {
//           return;
//         }
//         if (args[0].indexOf('Warning') > -1) {
//           return;
//         }

//         consoleError(args[0]);
//         return;
//       }

//       consoleError(...args);
//     };
//   }
// };

// filterConsoleErrors();
// const BASE = 'https://g.lifetek.vn:602';
// const UPLOAD_APP = 'https://g.lifetek.vn:603/api';
// const UPLOAD_AI = 'https://g.lifetek.vn:225';

// const CLIENT = 'MIPEC';
// const APP = 'https://g.lifetek.vn:620';
// const APP_REPORT = 'https://g.lifetek.vn:620';
// const USER_AFK_TIME = 15 * 60 * 1000;

// const DYNAMIC_FORM = 'https://g.lifetek.vn:619';
// const AUTOMATION = 'https://g.lifetek.vn:608';
// const PROPERTIES_APP = 'https://g.lifetek.vn:607/api';
// const APPROVE = 'https://g.lifetek.vn:610';

const filterConsoleErrors = () => {
  const consoleError = console.error;

  if (window && window.console) {
    window.console.error = (...args) => {
      if (typeof args[0] === 'string') {
        if (args[0].indexOf('React Intl') > -1) {
          return;
        }
        if (args[0].indexOf('Warning') > -1) {
          return;
        }

        consoleError(args[0]);
        return;
      }

      consoleError(...args);
    };
  }
};

filterConsoleErrors();
/* eslint-disable no-unused-vars */
const BASE = 'https://g.lifetek.vn:661';
const UPLOAD_APP = 'https://g.lifetek.vn:663/api';
const UPLOAD_AI = 'https://g.lifetek.vn:667';

const CLIENT = 'MIPEC';
const APP = 'https://g.lifetek.vn:660';

const APP_REPORT = 'https://g.lifetek.vn:660';

const DYNAMIC_FORM = 'https://g.lifetek.vn:669';
const AUTOMATION = 'https://g.lifetek.vn:668';
const PROPERTIES_APP = 'https://g.lifetek.vn:667/api';
const APPROVE = 'https://g.lifetek.vn:662';
const USER_AFK_TIME = 15 * 60 * 1000;

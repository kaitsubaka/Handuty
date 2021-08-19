import {createContext} from 'react';

const userContext = createContext({
    user: {},
    setUser: (user) => {}
  });

export {userContext};
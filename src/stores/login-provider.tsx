import { Init } from '@/types/authentication';
import { NextPage } from 'next';
import { createContext, useState } from 'react';


type Props = {
  children: React.ReactNode
}

type LoginContextType = {
  login: Init,
  setLogin: (Init) => void,
}

const LoginContext = createContext<LoginContextType>({
  login: null,
  setLogin: (state: Init) => { },
});

export const LoginContextProvider: NextPage<Props> = ({ children }) => {

  const [login, setLogin] = useState<Init>(null);

  const context = {
    login,
    setLogin,
  };

  return (
    <LoginContext.Provider value={context}>
      {children}
    </LoginContext.Provider>
  );
};


export default LoginContext;
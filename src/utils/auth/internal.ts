import { createContext } from 'react';
import { User } from './user';

export type UserAction = { type: 'SET_USER' };
export type AccessTokenAction = { type: 'SET_ACCESS_TOKEN' };
export type Dispatch = (action: UserAction | AccessTokenAction) => void;
export const UserContext = createContext<User | null>(null);
export const UserDispatchContext = createContext<Dispatch | null>(null);

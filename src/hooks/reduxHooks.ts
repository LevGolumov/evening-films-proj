import { TypedUseSelectorHook, useSelector } from "react-redux";
import { RootState } from "../store/store";

export const useStoreSelector: TypedUseSelectorHook<RootState> = useSelector;